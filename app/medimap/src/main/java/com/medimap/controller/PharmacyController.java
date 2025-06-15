package com.medimap.controller;

import com.medimap.model.Pharmacy;
import com.medimap.service.PharmacyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pharmacies")
public class PharmacyController {

    private final PharmacyService pharmacyService;

    public PharmacyController(PharmacyService pharmacyService) {
        this.pharmacyService = pharmacyService;
    }

    // ✅ 약국 ID로 재고 포함 상세 정보 조회
    @GetMapping("/{id}/stock")
    public ResponseEntity<?> getPharmacyStock(@PathVariable("id") Long id) {
        return ResponseEntity.ok(pharmacyService.getPharmacyWithStock(id));
    }

    // ✅ 약국 이름 + 주소로 약국 ID 조회
    @GetMapping("/resolve")
    public ResponseEntity<?> resolvePharmacy(
            @RequestParam("name") String name,
            @RequestParam("address") String address) {

        Optional<Pharmacy> pharmacy = pharmacyService.resolvePharmacy(name, address);
        if (pharmacy.isPresent()) {
            return ResponseEntity.ok(Map.of("id", pharmacy.get().getId()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("약국을 찾을 수 없습니다.");
        }
    }

    // ✅ 모든 약국 목록 조회 (Manage Inventory용)
    @GetMapping("/all")
    public ResponseEntity<List<Pharmacy>> getAllPharmacies() {
        return ResponseEntity.ok(pharmacyService.getAllPharmacies());
    }
}