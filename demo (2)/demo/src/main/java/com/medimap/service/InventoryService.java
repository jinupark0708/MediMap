package com.medimap.service;

import com.medimap.model.PharmacyStock;
import com.medimap.repository.PharmacyStockRepository;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    private final PharmacyStockRepository stockRepository;

    public InventoryService(PharmacyStockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public void updateStockQuantity(Long pharmacyId, String drugName, int change) {
        PharmacyStock stock = stockRepository
                .findByPharmacyIdAndDrug_Name(pharmacyId, drugName)
                .orElseThrow(() -> new IllegalArgumentException("해당 재고를 찾을 수 없습니다."));

        int newQuantity = stock.getQuantity() + change;
        if (newQuantity < 0) {
            throw new IllegalArgumentException("재고는 0보다 작을 수 없습니다.");
        }

        stock.setQuantity(newQuantity);
        stockRepository.save(stock);
    }
}