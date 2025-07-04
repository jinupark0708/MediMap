package com.medimap.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "pharmacy")
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;

    // ✅ 약국 이미지 URL 필드 추가
    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "pharmacy")
    private List<PharmacyStock> stockList;

    public Pharmacy() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<PharmacyStock> getStockList() {
        return stockList;
    }

    public void setStockList(List<PharmacyStock> stockList) {
        this.stockList = stockList;
    }
}