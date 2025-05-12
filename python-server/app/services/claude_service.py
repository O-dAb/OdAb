from anthropic import AsyncAnthropic
import os
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
import logging
import json
import re

logger = logging.getLogger(__name__)
load_dotenv()

# --- Levenshtein distance function ---
def calculate_edit_distance(s1, s2):
    """Calculates the Levenshtein distance between two strings."""
    if len(s1) < len(s2):
        return calculate_edit_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]
# --- End of Levenshtein function ---

class ClaudeService:
    def __init__(self):
        api_key = os.getenv("CLAUDE_API_KEY")
        if not api_key:
            raise ValueError("CLAUDE_API_KEY environment variable is not set")
        logger.info("Initializing ClaudeService")
        self.client = AsyncAnthropic(api_key=api_key)
        logger.info("ClaudeService initialized successfully")
    
    async def send_message(self, message: str, image: Optional[str] = None) -> Dict[str, Any]:
        """
        Handles the initial request. Analyzes the problem, transcribes it, identifies concepts/conditions,
        and outlines a plan or first step. Does NOT solve the full problem here.
        """
        try:
            logger.info("=== Starting send_message process (Initial Analysis) ===")
            logger.info(f"Message content (first 100 chars): {message[:100]}...")
            messages = []
            image_context_for_prompt = "No image provided." # Default text
            image_data = None # Initialize image_data to None

            if image:
                logger.info("Processing image data...")
                # Log the raw image data URL received (first 100 chars for brevity)
                logger.debug(f"Raw image data URL (start): {image[:100]}...")
                try:
                    # 데이터 URL에서 media type과 base64 데이터 추출
                    match = re.match(r"data:(?P<media_type>.*?);base64,(?P<data>.*)", image)
                    if not match:
                        logger.error("Regex did not match the image data URL format.")
                        raise ValueError("Invalid image data URL format")
                    
                    media_type = match.group("media_type")
                    base64_data = match.group("data")
                    
                    # Log extracted parts
                    logger.info(f"Successfully extracted media type: {media_type}")
                    logger.debug(f"Extracted base64 data (start): {base64_data[:50]}...")

                    image_data = { # Assign processed data
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type, # 추출한 media type 사용
                            "data": base64_data       # 추출한 base64 데이터 사용
                        }
                    }
                    logger.info("Image data processed successfully")
                    image_context_for_prompt = "An image was provided. Please analyze it carefully along with the query."
                    
                except Exception as img_error:
                    logger.error(f"Error processing image: {str(img_error)}")
                    raise # Reraise the exception after logging
            
            # --- NEW Initial Prompt Logic (Applied whether image exists or not, context adjusted) ---
            initial_prompt = f"""
            You are an AI assistant tasked with accurately understanding a mathematical problem presented via text { 'and image' if image_data else ''}.

            **Original Query:** {message}
            **Context:** {image_context_for_prompt}

            **Your Task (Initial Analysis - Three Parts):**

            **Part 1: Accurate Transcription**
            - Carefully analyze the original query { 'and the image' if image_data else ''}.
            - Accurately transcribe the *entire* problem statement, including all text, conditions, and mathematical expressions.
            - **CRITICAL:** Use LaTeX for all mathematical formulas and expressions (e.g., $inline_{{math}}$ or $$block_{{math}}$$). Pay very close attention to specific notations like the floor function (often represented as `[x]`). Ensure your transcription is precise.

            **Part 2: Identify Conditions & Concepts**
            - Based *only* on the accurate transcription from Part 1, explicitly list:
                - All given conditions (e.g., variable constraints, definitions like `[a]` is the greatest integer not exceeding `a`).
                - The key mathematical concepts or theorems likely required to solve the problem (e.g., modular arithmetic, binomial theorem, number theory, calculus, etc.).

            **Part 3: Outline Plan or First Step**
            - Based on the transcription and identified concepts/conditions, either:
                a) Outline a high-level step-by-step plan to solve the problem.
                b) OR, provide only the very *first* logical calculation or reasoning step needed to begin the solution.
            - **IMPORTANT: Do NOT provide the final answer or the complete multi-step solution in this initial response.**

            **Provide your response structured clearly with Part 1 (Transcription), Part 2 (Conditions & Concepts), and Part 3 (Plan/First Step).**
            """

            if image_data:
                 messages = [{
                     "role": "user",
                     "content": [
                         {"type": "text", "text": initial_prompt},
                         image_data # Include the processed image data dict if it exists
                     ]
                 }]
            else: # No image
                 messages = [{"role": "user", "content": initial_prompt}]
            # --- End of NEW Initial Prompt Logic ---

            logger.info("Sending initial analysis request to Claude API...")
            response = await self.client.messages.create(
                model="claude-3-5-sonnet-20240620", # Using Sonnet 3.5
                max_tokens=1500, # Increased slightly for potentially longer analysis
                messages=messages
            )
            logger.info("Received initial analysis response from Claude API")
            
            return {
                "content": response.content[0].text, # This now contains the structured analysis
                "thoughts": [] # Thoughts will be populated by the next stage
            }
            
        except Exception as e:
            logger.error(f"=== Error in send_message ===")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Error message: {str(e)}")
            logger.exception("Full traceback:")
            raise
    
    async def _process_sequential_thinking(self, initial_analysis_response: str, original_query: str, image_data: Optional[str] = None) -> Dict[str, Any]:
        """
        Performs the step-by-step thinking process based on the initial analysis.
        """
        logger.info("=== Starting sequential thinking process ===")
        logger.info(f"Original Query (first 100): {original_query[:100]}...")
        logger.info(f"Initial Analysis Response (first 100): {initial_analysis_response[:100]}...") # Renamed variable
        logger.info(f"Image provided: {bool(image_data)}")
        
        thoughts: List[Dict[str, Any]] = []
        # The 'initial_analysis_response' IS the starting point, but not counted as 'thought 0'.
        # 'current_thought_text' will start with the plan/first step derived from the analysis.
        # We might need to parse the initial_analysis_response to extract the actual first step/plan
        # For simplicity now, let's pass the whole initial analysis as context for the first real thought.
        current_thought_text = initial_analysis_response # The full analysis serves as context for thought 1

        thought_number = 1
        max_thoughts = 10 # Initial max thoughts
        dynamic_max_thoughts = max_thoughts # Allow dynamic increase
        current_branch_id = "main"

        while thought_number <= dynamic_max_thoughts: # Use dynamic_max_thoughts for loop condition
            logger.info(f"=== Processing thought {thought_number}/{dynamic_max_thoughts} (Branch: {current_branch_id}) ===")
            
            previous_thoughts_formatted = ""
            if thoughts: # This will be true for thought_number >= 2
                previous_thoughts_formatted = "\n".join([
                    f"Thought {t['thoughtNumber']} (Branch: {t.get('branchId', 'main')}): {t['thought']}" for t in thoughts
                ])
            
            # --- REMOVED: Special prompt for thought 1 is no longer needed ---
            # --- Unified prompt logic for all thoughts ---
            prompt = f"""
            You are an AI assistant performing a step-by-step thinking process to solve a mathematical problem.

            **Original Query:** {original_query}
            **Context:**
            {'An image was provided.' if image_data else 'No image provided.'}
            **Initial Analysis (Transcription, Concepts, Plan/First Step):** 
            {initial_analysis_response} 

            **Previous Thoughts Log (Execution History):**
            {previous_thoughts_formatted if previous_thoughts_formatted else 'You are about to generate the first execution step (Thought 1) based on the Initial Analysis.'}

            **Current Task (Thought {thought_number}):**
            Based on the **Initial Analysis** and the **Previous Thoughts Log**, generate the *next* logical step in executing the solution plan.
            - If Thought 1, execute the first step outlined in the Initial Analysis.
            - If subsequent thoughts, continue executing the plan or adapt as needed based on previous results.
            - Build upon the previous thought ({current_thought_text[:100]}...).
            - Critically evaluate progress: Refine previous thoughts, verify results, express uncertainty, or change approach if the plan seems flawed.

            **Instructions for your response:**
            1.  Clearly state your thinking and actions for step {thought_number}.
            2.  Analyze the state & include *only ONE* relevant keyword phrase if applicable:
                *   `REVISE_THOUGHT_N`: If correcting/refining thought #N's execution.
                *   `BRANCH_FROM_N`: If exploring an alternative execution path from thought #N.
                *   `NEED_MORE_THOUGHTS`: If more execution steps are needed than current estimate ({dynamic_max_thoughts}).
                *   `THOUGHT_COMPLETE`: If the problem is *fully* solved and the final answer is obtained. Use fuzzy matching logic targetting this phrase.
            3.  If none apply, just provide the thought/execution step.
            4.  Be concise. Do not repeat the full Initial Analysis or long past thoughts unless necessary for context.
            5.  If appropriate, perform calculations and state results clearly.

            **Generate Execution Thought {thought_number} (Branch: {current_branch_id}):**
            *Important: Use LaTeX for all mathematical formulas and expressions (e.g., $inline_{{math}}$ or $$block_{{math}}$$) *
            """
            # --- End of Unified Prompt ---
            
            logger.debug(f"Sending prompt for thought {thought_number}...")
            
            try:
                response = await self.client.messages.create(
                    model="claude-3-5-sonnet-20240620", # Changed to Sonnet 3.5
                    max_tokens=500, # Max tokens for a single thought step
                    messages=[{"role": "user", "content": prompt}]
                )
                logger.info(f"Received response from Claude API for thought {thought_number}")
                raw_response_text = response.content[0].text.strip()
                logger.debug(f"Raw response content (first 100): {raw_response_text[:100]}...")
                
                # --- Enhanced Response Parsing --- 
                final_thought_text = raw_response_text
                is_complete = False
                is_revision = False
                revises_thought = None
                branch_from = None
                needs_more_thoughts = False
                new_branch_id = current_branch_id # Ensure new_branch_id is initialized

                # --- MODIFICATION START: Fuzzy Matching for Completion ---
                target_keyword = "THOUGHT_COMPLETE"
                max_allowed_distance = 2 # Max Levenshtein distance allowed

                lines = final_thought_text.strip().split('\n') # Use splitlines() for better handling? Let's stick to split for now.
                last_non_empty_line = ""
                last_non_empty_line_index = -1

                # Find the last non-empty line from the response
                for i in range(len(lines) - 1, -1, -1):
                    stripped_line = lines[i].strip()
                    if stripped_line:
                        last_non_empty_line = stripped_line
                        last_non_empty_line_index = i
                        break
                
                # Check similarity of the last non-empty line (case-insensitive)
                if last_non_empty_line: 
                    distance = calculate_edit_distance(last_non_empty_line.upper(), target_keyword)
                    if distance <= max_allowed_distance:
                        is_complete = True
                        # Attempt to remove the matched line from the final thought text
                        if last_non_empty_line_index != -1:
                             final_thought_text = '\n'.join(lines[:last_non_empty_line_index]).strip()
                        else: # Handle case where the entire response was similar to the keyword
                             final_thought_text = "" 
                        logger.info(f"Completion keyword '{last_non_empty_line}' found with fuzzy match (distance: {distance}).")
                # --- MODIFICATION END ---

                # Only proceed with other keyword checks if not complete
                if not is_complete:
                    # Check for keywords and extract info (NEED_MORE_THOUGHTS, REVISE, BRANCH)
                    if "NEED_MORE_THOUGHTS" in final_thought_text:
                        needs_more_thoughts = True
                        final_thought_text = final_thought_text.replace("NEED_MORE_THOUGHTS", "").strip()
                        logger.info("Keyword 'NEED_MORE_THOUGHTS' found.")
                        # Increase max thoughts dynamically, e.g., by 3
                        dynamic_max_thoughts += 3
                        logger.info(f"Increased dynamic_max_thoughts to {dynamic_max_thoughts}")

                    revision_match = re.search(r"REVISE_THOUGHT_(\d+)", final_thought_text)
                    if revision_match:
                        is_revision = True
                        revises_thought = int(revision_match.group(1))
                        final_thought_text = final_thought_text.replace(revision_match.group(0), "").strip()
                        logger.info(f"Keyword 'REVISE_THOUGHT_{revises_thought}' found.")
                    
                    branch_match = re.search(r"BRANCH_FROM_(\d+)", final_thought_text)
                    if branch_match:
                        branch_from = int(branch_match.group(1))
                        final_thought_text = final_thought_text.replace(branch_match.group(0), "").strip()
                        new_branch_id = f"b{thought_number}" 
                        logger.info(f"Keyword 'BRANCH_FROM_{branch_from}' found. New branch: {new_branch_id}")

                if is_complete:
                     logger.info("Breaking sequential thinking loop due to completion.")
                     if thoughts and final_thought_text: # Store the final thought before breaking
                         # Update the last thought's content if it wasn't just the keyword
                         thoughts[-1]['thought'] += f"\nFinal Step (derived before completion signal): {final_thought_text}" # Adjusted how final text is appended
                         thoughts[-1]['isComplete'] = True
                     elif final_thought_text: # Handle case where completion happens on the first real thought
                          thought_data = { # Create a final thought entry
                              "thought": final_thought_text, # Store the text preceding the fuzzy matched keyword
                              "thoughtNumber": thought_number,
                              "isComplete": True, 
                              "isRevision": False, "revisesThought": None, 
                              "branchFromThought": None, "branchId": current_branch_id, 
                              "needsMoreThoughts": False,
                          }
                          thoughts.append(thought_data)
                     elif thoughts: # Only fuzzy keyword received (or removed), mark last thought complete
                          thoughts[-1]['isComplete'] = True
                     break 
                elif not final_thought_text:
                    logger.warning(f"Thought {thought_number} response was empty after removing keywords. Skipping.")
                    # Decide if skipping is appropriate or if loop should break
                    # continue # Skip to next iteration if appropriate
                else:
                    thought_data = {
                        "thought": final_thought_text,
                        "thoughtNumber": thought_number,
                        "isComplete": False, 
                        "isRevision": is_revision,
                        "revisesThought": revises_thought,
                        "branchFromThought": branch_from,
                        "branchId": new_branch_id,
                        "needsMoreThoughts": needs_more_thoughts,
                    }
                    thoughts.append(thought_data)
                    current_thought_text = final_thought_text 
                    current_branch_id = new_branch_id

                if thought_number == dynamic_max_thoughts: # Check against dynamic max thoughts
                    logger.warning(f"Reached dynamic maximum number of thoughts ({dynamic_max_thoughts}).")
                    if thoughts and not is_complete:
                         thoughts[-1]['isComplete'] = False # Mark the last thought as incomplete
                    break
                
                thought_number += 1
                
            except Exception as e:
                logger.error(f"Error processing thought {thought_number}: {str(e)}")
                logger.exception("Full traceback:")
                break
        
        logger.info(f"=== Sequential thinking finished with {len(thoughts)} thoughts ===")
        
        # --- Final Summary Step --- 
        final_summary = "Could not generate a final summary." # Default message
        if thoughts: # Only generate summary if there are thoughts
            logger.info("Generating final summary...")
            # Renamed initial_response variable in the f-string
            summary_prompt = f"""
            Based on the initial analysis and the following step-by-step thinking process, provide a final, clean, and concise explanation or solution to the original query: '{original_query}'. 
            Integrate the key insights from the steps. Ensure all mathematical formulas are rendered using LaTeX ($inline$ or $$block$$).

            **Initial Analysis Provided:**
            {initial_analysis_response} 

            **Thinking Process Log (Execution Steps):**
            """
            for thought in thoughts:
                # Optionally filter thought content for summary prompt if needed
                # thought_text_for_summary = thought['thought'].replace("THOUGHT_COMPLETE", "").strip() # Example filtering
                summary_prompt += f"Step {thought['thoughtNumber']} (Branch: {thought.get('branchId', 'main')} - Complete: {thought['isComplete']}): {thought['thought']}\n" # Keep original for now

            # --- Add specific instructions to the summary prompt ---
            summary_prompt += """

            **Instructions for Final Summary:**
            - Synthesize the initial analysis and the key execution steps from the thinking process log.
            - Provide a clear and concise final explanation or solution based *only* on the relevant reasoning and execution.
            - **CRITICAL: Do NOT include the literal phrase 'THOUGHT_COMPLETE' or any repetitive boilerplate statements like 'The problem has been fully solved...' from the log in your final output.** Focus solely on presenting the derived solution path and the answer.
            - Ensure all mathematical formulas are rendered using LaTeX ($inline$ or $$block$$).

            **Final Summarized Explanation/Solution:**
            """
            # --- End of added instructions ---

            try:
                summary_response = await self.client.messages.create(
                    model="claude-3-5-sonnet-20240620", # Changed to Sonnet 3.5
                    max_tokens=1000, # Max tokens for summary
                    messages=[{"role": "user", "content": summary_prompt}]
                )
                final_summary = summary_response.content[0].text.strip()
                logger.info("Final summary generated successfully.")
            except Exception as summary_error:
                logger.error(f"Error generating final summary: {summary_error}")
                # Keep the default error message for final_summary

        # Return thoughts and final summary
        # Pass initial_analysis_response along if needed by the caller, or just thoughts/summary
        return {"initial_analysis": initial_analysis_response, "thoughts": thoughts, "final_summary": final_summary} # Modified return structure 