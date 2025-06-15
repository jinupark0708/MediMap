package com.medimap.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "pharmacy_stock")
public class PharmacyStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pharmacy_id")
    @JsonBackReference
    private Pharmacy pharmacy;

    @ManyToOne
    @JoinColumn(name = "drug_id")
    @JsonBackReference
    private Drug drug;

    private int quantity;

    public PharmacyStock() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pharmacy getPharmacy() { return pharmacy; }
    public void setPharmacy(Pharmacy pharmacy) { this.pharmacy = pharmacy; }

    public Drug getDrug() { return drug; }
    public void setDrug(Drug drug) { this.drug = drug; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}