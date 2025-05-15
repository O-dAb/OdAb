package com.ssafy.odab.mcpLLM.dto;

public class ThoughtData {
    public String thought;
    public int thoughtNumber;
    public int totalThoughts;
    public boolean nextThoughtNeeded;
    public Boolean isRevision;
    public Integer revisesThought;
    public Integer branchFromThought;
    public String branchId;
    public Boolean needsMoreThoughts;

    public ThoughtData(String thought, int thoughtNumber, int totalThoughts, boolean nextThoughtNeeded,
                       Boolean isRevision, Integer revisesThought, Integer branchFromThought, String branchId, Boolean needsMoreThoughts) {
        this.thought = thought;
        this.thoughtNumber = thoughtNumber;
        this.totalThoughts = totalThoughts;
        this.nextThoughtNeeded = nextThoughtNeeded;
        this.isRevision = isRevision;
        this.revisesThought = revisesThought;
        this.branchFromThought = branchFromThought;
        this.branchId = branchId;
        this.needsMoreThoughts = needsMoreThoughts;
    }
}