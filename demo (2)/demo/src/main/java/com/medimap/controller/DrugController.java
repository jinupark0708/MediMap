package com.medimap.controller;

import com.medimap.model.Drug;
import com.medimap.model.PharmacyStock;
import com.medimap.repository.DrugRepository;
import com.medimap.repository.PharmacyStockRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/drugs")
public class DrugController {

    private final DrugRepository drugRepository;
    private final PharmacyStockRepository pharmacyStockRepository;

    public DrugController(DrugRepository drugRepository, PharmacyStockRepository pharmacyStockRepository) {
        this.drugRepository = drugRepository;
        this.pharmacyStockRepository = pharmacyStockRepository;
    }

    @GetMapping
    public List<Drug> searchDrugs(@RequestParam("name") String name) {
        return drugRepository.findByNameContainingIgnoreCase(name);
    }

    @GetMapping("/{id}")
    public Drug getDrugDetail(@PathVariable("id") Long id) {
        return drugRepository.findById(id).orElseThrow();
    }

    @GetMapping("/{id}/pharmacies")
    public ResponseEntity<List<Map<String, Object>>> getPharmaciesByDrug(@PathVariable("id") Long id) {
        List<PharmacyStock> stocks = pharmacyStockRepository.findByDrugId(id);

        List<Map<String, Object>> result = stocks.stream().map(stock -> {
            Map<String, Object> data = new HashMap<>();
            data.put("name", stock.getPharmacy().getName());
            data.put("address", stock.getPharmacy().getAddress());
            data.put("quantity", stock.getQuantity());
            return data;
        }).toList();

        return ResponseEntity.ok(result);
    }
}