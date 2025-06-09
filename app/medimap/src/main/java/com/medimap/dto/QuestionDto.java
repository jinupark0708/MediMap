package com.medimap.dto;

public class QuestionDto {
    private Long id;
    private String question;

    public QuestionDto(Long id, String question) {
        this.id = id;
        this.question = question;
    }

    public Long getId() { return id; }
    public String getQuestion() { return question; }
}