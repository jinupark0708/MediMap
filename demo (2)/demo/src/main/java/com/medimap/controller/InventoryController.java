package com.medimap.controller;

import com.medimap.dto.InventoryUpdateRequest;
import com.medimap.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateInventory(@RequestBody InventoryUpdateRequest request) {
        try {
            inventoryService.updateStockQuantity(request.getPharmacyId(), request.getDrugName(), request.getChange());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("재고 변경 실패: " + e.getMessage());
        }
    }
}