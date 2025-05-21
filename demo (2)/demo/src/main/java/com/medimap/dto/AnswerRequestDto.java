package com.medimap.dto;

import java.util.Map;

public class AnswerRequestDto {
    private Map<Long, Boolean> answers;

    public Map<Long, Boolean> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, Boolean> answers) {
        this.answers = answers;
    }
}