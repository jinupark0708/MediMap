package com.medimap.repository;

import com.medimap.model.Drug;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional; // ✅ 이거 추가

public interface DrugRepository extends JpaRepository<Drug, Long> {
    List<Drug> findByNameContainingIgnoreCase(String name);
    Optional<Drug> findByName(String name); // 정확한 이름 검색용
}