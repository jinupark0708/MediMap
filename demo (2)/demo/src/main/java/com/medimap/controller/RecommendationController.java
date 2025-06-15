package com.medimap.controller;

import com.medimap.dto.AnswerRequestDto;
import com.medimap.dto.DrugDto;
import com.medimap.dto.QuestionDto;
import com.medimap.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    // 질문 리스트 반환
    @GetMapping("/questions")
    public List<QuestionDto> getSymptomQuestions() {
        return recommendationService.getSymptomQuestions();
    }

    // 응답 기반 약 추천
    @PostMapping
    public List<DrugDto> recommendDrugs(@RequestBody AnswerRequestDto request) {
        return recommendationService.recommendDrugs(request);
    }
}