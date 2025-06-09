package com.medimap.dto;

import com.medimap.model.Drug;

public class DrugDto {
    private Long id;
    private String name;
    private String efficacy;
    private String dosage;
    private String caution;
    private String imageUrl;

    public DrugDto(Drug drug) {
        this.id = drug.getId();
        this.name = drug.getName();
        this.efficacy = drug.getEfficacy();
        this.dosage = drug.getDosage();
        this.caution = drug.getCaution();
        this.imageUrl = drug.getImageUrl();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEfficacy() { return efficacy; }
    public String getDosage() { return dosage; }
    public String getCaution() { return caution; }
    public String getImageUrl() { return imageUrl; }
}