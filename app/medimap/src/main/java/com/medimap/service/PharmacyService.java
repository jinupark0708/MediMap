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
                        stock.getDrug().getName(),           // ✅ undefined 해결
                        stock.getQuantity(),
                        stock.getDrug().getImageUrl()
                ))
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("id", pharmacy.getId());
        result.put("name", pharmacy.getName());
        result.put("address", pharmacy.getAddress());
        result.put("imageUrl", pharmacy.getImageUrl());
        result.put("stockList", dtoList);

        return result;
    }

    // 이름 + 주소로 약국 찾기
    public Optional<Pharmacy> resolvePharmacy(String name, String address) {
        return pharmacyRepository.findAll().stream()
                .filter(p -> p.getName().equals(name) && p.getAddress().equals(address))
                .findFirst();
    }

    // 전체 약국 목록
    public List<Pharmacy> getAllPharmacies() {
        List<Pharmacy> all = pharmacyRepository.findAll();

        return all.stream()
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                p -> p.getName() + "::" + p.getAddress(), // name + address 기준으로 중복 제거
                                p -> p,
                                (existing, duplicate) -> existing // 중복 시 첫 항목 유지
                        ),
                        map -> new ArrayList<>(map.values())
                ));
    }
}