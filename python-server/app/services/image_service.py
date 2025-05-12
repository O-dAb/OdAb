import cv2
import numpy as np
from PIL import Image
import io
import logging
import requests
import os
import base64
import json
from anthropic import AsyncAnthropic
import re

logger = logging.getLogger(__name__)

class ImageService:
    def __init__(self):
        api_key = os.getenv("CLAUDE_API_KEY")
        if not api_key:
            raise ValueError("CLAUDE_API_KEY environment variable is not set")
        self.client = AsyncAnthropic(api_key=api_key)
    
    def preprocess_image(self, image_data):
        """이미지 전처리: 노이즈 제거, 대비 향상 등"""
        try:
            # 바이트 데이터를 NumPy 배열로 변환
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # 그레이스케일로 변환
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # 노이즈 제거 (가우시안 블러)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # 대비 향상
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            enhanced = clahe.apply(blurred)
            
            # 결과 이미지를 바이트로 변환
            _, processed_image = cv2.imencode('.jpg', enhanced)
            return processed_image.tobytes()
        
        except Exception as e:
            logger.error(f"이미지 전처리 오류: {str(e)}")
            return image_data
    
    async def extract_text_from_image(self, image_data):
        """Claude API를 사용해 이미지에서 수학 문제 텍스트 추출"""
        try:
            # 이미지를 base64로 인코딩
            base64_image = base64.b64encode(image_data).decode('utf-8')
            
            # Claude에 보낼 메시지 설정
            messages = [{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": base64_image
                        }
                    },
                    {
                        "type": "text",
                        "text": "이 이미지에서 수학 문제의 텍스트를 LaTeX 형식으로 정확하게 추출해 주세요. LaTeX 형식으로 수식을 표현하고, 별도의 설명 없이 텍스트만 반환해 주세요. 수식은 $...$ 또는 $$...$$ 형태로 표현해 주세요."
                    }
                ]
            }]
            
            # Claude API 호출
            response = await self.client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=1000,
                messages=messages
            )
            
            return {
                "text": response.content[0].text,
                "latex": self._extract_latex_from_text(response.content[0].text)
            }
                
        except Exception as e:
            logger.error(f"이미지 텍스트 추출 오류: {str(e)}")
            return {"text": f"텍스트 추출 오류: {str(e)}", "latex": ""}
    
    def _extract_latex_from_text(self, text):
        """텍스트에서 LaTeX 수식 추출"""
        # 블록 수식($$...$$) 추출
        block_latex = re.findall(r'\$\$(.*?)\$\$', text, re.DOTALL)
        
        # 인라인 수식($...$) 추출
        inline_latex = re.findall(r'\$(.*?)\$', text)
        
        # 추출된 모든 수식
        all_latex = []
        
        # 블록 수식 추가 (원래 형식 보존)
        for latex in block_latex:
            all_latex.append(f"$${latex}$$")
        
        # 인라인 수식 추가 (원래 형식 보존)
        for latex in inline_latex:
            # 이미 블록 수식에 포함된 것은 제외
            if f"$${latex}$$" not in all_latex:
                all_latex.append(f"${latex}$")
        
        # 추출된 모든 수식을 하나의 문자열로 결합
        return "\n".join(all_latex) 