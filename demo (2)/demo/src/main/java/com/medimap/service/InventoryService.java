package com.medimap.service;

import com.medimap.model.Drug;
import com.medimap.model.Pharmacy;
import com.medimap.model.PharmacyStock;
import com.medimap.repository.DrugRepository;
import com.medimap.repository.PharmacyRepository;
import com.medimap.repository.PharmacyStockRepository;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    private final PharmacyStockRepository stockRepository;
    private final DrugRepository drugRepository;
    private final PharmacyRepository pharmacyRepository;

    public InventoryService(
            PharmacyStockRepository stockRepository,
            DrugRepository drugRepository,
            PharmacyRepository pharmacyRepository
    ) {
        this.stockRepository = stockRepository;
        this.drugRepository = drugRepository;
        this.pharmacyRepository = pharmacyRepository;
    }

    public void updateStockQuantity(Long pharmacyId, String drugName, int change) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new IllegalArgumentException("약국을 찾을 수 없습니다."));

        Drug drug = drugRepository.findByName(drugName).orElseGet(() -> {
            Drug newDrug = new Drug();
            newDrug.setName(drugName);
            newDrug.setEfficacy("효능 정보 없음");
            newDrug.setDosage("용법 정보 없음");
            newDrug.setCaution("주의사항 없음");
            newDrug.setImageUrl(null);
            return drugRepository.save(newDrug);
        });

        PharmacyStock stock = stockRepository
                .findByPharmacyIdAndDrug_Name(pharmacyId, drugName)
                .orElse(null);

        if (stock == null) {
            if (change < 0) {
                throw new IllegalArgumentException("신규 품목의 수량은 0 이상이어야 합니다.");
            }
            PharmacyStock newStock = new PharmacyStock();
            newStock.setPharmacy(pharmacy);
            newStock.setDrug(drug);
            newStock.setQuantity(change);
            stockRepository.save(newStock);
        } else {
            int newQuantity = stock.getQuantity() + change;
            if (newQuantity < 0) {
                throw new IllegalArgumentException("재고는 0보다 작을 수 없습니다.");
            }
            stock.setQuantity(newQuantity);
            stockRepository.save(stock);
        }
    }

    public void deleteStock(Long pharmacyId, String drugName) {
        PharmacyStock stock = stockRepository
                .findByPharmacyIdAndDrug_Name(pharmacyId, drugName)
                .orElseThrow(() -> new IllegalArgumentException("해당 품목을 찾을 수 없습니다."));
        stockRepository.delete(stock);
    }
}