package com.Placify.Controller;


import com.Placify.Entity.Company;
import com.Placify.Service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company")
public class CompanyController {
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCompany(@RequestBody Company company){
        return companyService.addCompany(company);
    }

    @PostMapping("/addAll")
    public ResponseEntity<String> addCompanies(@RequestBody List<Company> companies){
        return companyService.addCompanies(companies);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Company>> getCompanies(){
        return companyService.getCompanies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable String id) {
        return companyService.getCompanyById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCompany(@PathVariable String id) {
        return companyService.deleteCompany(id);
    }
}
