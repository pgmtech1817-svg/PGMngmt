package com.supportportal.pg.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "text")
    private String description;
    private String status;
    private String priority;
    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId(){return id;} public void setId(Long id){this.id=id;} public String getTitle(){return title;} public void setTitle(String title){this.title=title;} public String getDescription(){return description;} public void setDescription(String description){this.description=description;} public String getStatus(){return status;} public void setStatus(String status){this.status=status;} public String getPriority(){return priority;} public void setPriority(String priority){this.priority=priority;} public OffsetDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(OffsetDateTime createdAt){this.createdAt=createdAt;}
}
