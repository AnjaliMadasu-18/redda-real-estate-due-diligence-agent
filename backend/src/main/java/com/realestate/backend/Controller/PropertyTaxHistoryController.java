package com.realestate.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestate.backend.Entity.PropertyTaxHistory;
import com.realestate.backend.Service.PropertyTaxHistoryService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.realestate.backend.Entity.Property;
import com.realestate.backend.Service.PropertyService;

import jakarta.validation.Valid;
@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/api/property-tax-history")
public class PropertyTaxHistoryController {

    private final PropertyTaxHistoryService propertyTaxHistoryService;

    public PropertyTaxHistoryController(
            PropertyTaxHistoryService propertyTaxHistoryService) {
        this.propertyTaxHistoryService = propertyTaxHistoryService;
    }

    @PostMapping
    public ResponseEntity<PropertyTaxHistory> createTaxHistory(
            @RequestBody PropertyTaxHistory taxHistory) {

        return ResponseEntity.ok(
                propertyTaxHistoryService.createTaxHistory(taxHistory));
    }

    @GetMapping
    public ResponseEntity<List<PropertyTaxHistory>> getAllTaxHistory() {

        return ResponseEntity.ok(
                propertyTaxHistoryService.getAllTaxHistory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyTaxHistory> getTaxHistoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                propertyTaxHistoryService.getTaxHistoryById(id));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<PropertyTaxHistory>> getTaxHistoryByPropertyId(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                propertyTaxHistoryService
                        .getTaxHistoryByPropertyId(propertyId));
    }
    @PutMapping("/{id}")
    public ResponseEntity<PropertyTaxHistory> updateTaxHistory(
            @PathVariable Long id,
            @RequestBody PropertyTaxHistory taxHistory) {

        return ResponseEntity.ok(
                propertyTaxHistoryService.updateTaxHistory(id, taxHistory));
    }
}