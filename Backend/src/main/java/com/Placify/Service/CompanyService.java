package com.Placify.Service;

import com.Placify.Entity.Company;
import com.Placify.Repository.CompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public ResponseEntity<String> addCompanies(List<Company> companies) {
        try {
            companyRepository.saveAll(companies);
            return ResponseEntity.ok("Companies added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add companies");
        }
    }

    public ResponseEntity<String> addCompany(Company company) {
        try {
            companyRepository.save(company);
            return ResponseEntity.ok("Company added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add company");
        }
    }

    public ResponseEntity<List<Company>> getCompanies() {
        try {
            List<Company> companies = companyRepository.findAll();
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    public ResponseEntity<Company> getCompanyById(String id) {
        try {
            Company company = companyRepository.findById(id).orElse(null);
            if (company == null) {
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(company);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    public ResponseEntity<String> deleteCompany(String id) {
        try {
            companyRepository.deleteById(id);
            return ResponseEntity.ok("Company deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete company");
        }
    }
}
