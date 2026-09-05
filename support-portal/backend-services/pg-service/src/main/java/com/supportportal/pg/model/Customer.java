package com.supportportal.pg.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String company;
    private String phone;
    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId(){return id;} public void setId(Long id){this.id=id;} public String getName(){return name;} public void setName(String name){this.name=name;} public String getEmail(){return email;} public void setEmail(String email){this.email=email;} public String getCompany(){return company;} public void setCompany(String company){this.company=company;} public String getPhone(){return phone;} public void setPhone(String phone){this.phone=phone;} public OffsetDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(OffsetDateTime createdAt){this.createdAt=createdAt;}
}
