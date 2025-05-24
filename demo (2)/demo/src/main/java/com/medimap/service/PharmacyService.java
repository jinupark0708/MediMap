package com.medimap.service;

import com.medimap.dto.PharmacyStockResponse;
import com.medimap.model.Pharmacy;
import com.medimap.model.PharmacyStock;
import com.medimap.repository.PharmacyRepository;
import com.medimap.repository.PharmacyStockRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PharmacyService {

    private final PharmacyStockRepository stockRepository;
    private final PharmacyRepository pharmacyRepository;

    public PharmacyService(PharmacyStockRepository stockRepository, PharmacyRepository pharmacyRepository) {
        this.stockRepository = stockRepository;
        this.pharmacyRepository = pharmacyRepository;
    }

    // 약국 ID로 상세정보 + 재고 반환
    public Map<String, Object> getPharmacyWithStock(Long id) {
        Pharmacy pharmacy = pharmacyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("약국을 찾을 수 없습니다."));

        List<PharmacyStock> stockList = stockRepository.findByPharmacyId(id);
        List<PharmacyStockResponse> dtoList = stockList.stream()
                .map(stock -> new PharmacyStockResponse(
                        stock.getDrug().getName(),
                        stock.getQuantity(),
                        stock.getDrug().getImageUrl()
                ))
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("name", pharmacy.getName());
        result.put("address", pharmacy.getAddress());
        result.put("imageUrl", pharmacy.getImageUrl()); // 👈 약국 이미지도 포함
        result.put("stockList", dtoList);
        return result;
    }

    // 이름 + 주소로 약국 찾기
    public Optional<Pharmacy> resolvePharmacy(String name, String address) {
        return pharmacyRepository.findAll().stream()
                .filter(p -> p.getName().equals(name) && p.getAddress().equals(address))
                .findFirst();
    }
}