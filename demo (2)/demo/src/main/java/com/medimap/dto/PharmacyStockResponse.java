package com.medimap.dto;

public class PharmacyStockResponse {
    private String drugName;
    private int quantity;
    private String imageUrl;

    public PharmacyStockResponse(String drugName, int quantity, String imageUrl) {
        this.drugName = drugName;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public String getDrugName() {
        return drugName;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}