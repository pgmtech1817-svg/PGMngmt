package com.supportportal.pg.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pgs")
public class Pg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private Double latitude;
    private Double longitude;

    @Column(name = "google_map_link")
    private String googleMapLink;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    public Pg() {}

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getGoogleMapLink() { return googleMapLink; }
    public void setGoogleMapLink(String googleMapLink) { this.googleMapLink = googleMapLink; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
