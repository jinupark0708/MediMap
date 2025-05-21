package com.medimap.service;

import com.medimap.dto.AnswerRequestDto;
import com.medimap.dto.DrugDto;
import com.medimap.dto.QuestionDto;
import com.medimap.model.Drug;
import com.medimap.repository.DrugRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationService {

    private final DrugRepository drugRepository;

    public RecommendationService(DrugRepository drugRepository) {
        this.drugRepository = drugRepository;
    }

    // 고정된 질문 리스트 제공
    public List<QuestionDto> getSymptomQuestions() {
        return List.of(
                new QuestionDto(1L, "열이 나시나요?"),
                new QuestionDto(2L, "두통이 있으신가요?"),
                new QuestionDto(3L, "기침이 나시나요?"),
                new QuestionDto(4L, "콧물이 나시나요?"),
                new QuestionDto(5L, "속이 더부룩하거나 소화가 잘 안 되시나요?"),
                new QuestionDto(6L, "목이 따갑거나 아프신가요?"),
                new QuestionDto(7L, "멀미 증상이 있나요?"),
                new QuestionDto(8L, "변비가 있으신가요?"),
                new QuestionDto(9L, "여드름이 고민이신가요?"),
                new QuestionDto(10L, "몸살 기운이 있으신가요?")
        );
    }

    // 응답 기반 추천
    public List<DrugDto> recommendDrugs(AnswerRequestDto request) {
        Map<Long, Boolean> answers = request.getAnswers();
        List<DrugDto> results = new ArrayList<>();

        // 간단한 매핑 기반 추천 로직
        if (Boolean.TRUE.equals(answers.get(1L))) addIfExists(results, "타이레놀");
        if (Boolean.TRUE.equals(answers.get(2L))) addIfExists(results, "이부프로펜");
        if (Boolean.TRUE.equals(answers.get(3L)) || Boolean.TRUE.equals(answers.get(4L)))
            addIfExists(results, "판콜에스");
        if (Boolean.TRUE.equals(answers.get(5L))) addIfExists(results, "훼스탈 플러스");
        if (Boolean.TRUE.equals(answers.get(6L))) addIfExists(results, "스트렙실");
        if (Boolean.TRUE.equals(answers.get(7L))) addIfExists(results, "베나치오");
        if (Boolean.TRUE.equals(answers.get(8L))) addIfExists(results, "둘코락스");
        if (Boolean.TRUE.equals(answers.get(9L))) addIfExists(results, "디페린");
        if (Boolean.TRUE.equals(answers.get(10L))) addIfExists(results, "타이레놀");

        return results.stream().distinct().toList();
    }

    // 약 이름으로 조회 후 존재하면 리스트에 추가
    private void addIfExists(List<DrugDto> list, String drugName) {
        Optional<Drug> drugOpt = drugRepository.findByName(drugName);
        drugOpt.ifPresent(drug -> list.add(new DrugDto(drug)));
    }
}