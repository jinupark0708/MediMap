package com.medimap.dto;

public class InventoryUpdateRequest {
    private Long pharmacyId;
    private String drugName;
    private int change; // +1, -1, +10, -10

    public Long getPharmacyId() {
        return pharmacyId;
    }

    public String getDrugName() {
        return drugName;
    }

    public int getChange() {
        return change;
    }

    public void setPharmacyId(Long pharmacyId) {
        this.pharmacyId = pharmacyId;
    }

    public void setDrugName(String drugName) {
        this.drugName = drugName;
    }

    public void setChange(int change) {
        this.change = change;
    }
}