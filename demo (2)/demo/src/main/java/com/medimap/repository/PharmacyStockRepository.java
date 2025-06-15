package com.medimap.repository;

import com.medimap.model.PharmacyStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PharmacyStockRepository extends JpaRepository<PharmacyStock, Long> {

    List<PharmacyStock> findByPharmacyId(Long pharmacyId);

    List<PharmacyStock> findByDrug_Id(Long drugId);

    Optional<PharmacyStock> findByPharmacyIdAndDrug_Name(Long pharmacyId, String drugName);
}