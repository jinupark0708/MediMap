package com.medimap.repository;

import com.medimap.model.PharmacyStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PharmacyStockRepository extends JpaRepository<PharmacyStock, Long> {
    List<PharmacyStock> findByDrugId(Long drugId);
}