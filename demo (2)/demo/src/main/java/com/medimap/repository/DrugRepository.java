package com.medimap.repository;

import com.medimap.model.Drug;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DrugRepository extends JpaRepository<Drug, Long> {
    List<Drug> findByNameContainingIgnoreCase(String name);
}