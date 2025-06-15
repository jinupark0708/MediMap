package com.medimap.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "drug")
public class Drug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String efficacy;

    @Column(columnDefinition = "TEXT")
    private String dosage;

    @Column(columnDefinition = "TEXT")
    private String caution;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "drug")
    private List<PharmacyStock> stockList;

    public Drug() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEfficacy() { return efficacy; }
    public void setEfficacy(String efficacy) { this.efficacy = efficacy; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getCaution() { return caution; }
    public void setCaution(String caution) { this.caution = caution; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<PharmacyStock> getStockList() { return stockList; }
    public void setStockList(List<PharmacyStock> stockList) { this.stockList = stockList; }
}