package com.supportportal.pg.controller;

import com.supportportal.pg.model.Customer;
import com.supportportal.pg.repository.CustomerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerRepository repo;
    public CustomerController(CustomerRepository repo){this.repo = repo;}

    @GetMapping
    public List<Customer> list(){ return repo.findAll(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Customer c){
        if (c.getName() == null || c.getEmail() == null) return ResponseEntity.badRequest().body("Name and email required");
        Customer saved = repo.save(c);
        return ResponseEntity.status(201).body(saved);
    }
}
