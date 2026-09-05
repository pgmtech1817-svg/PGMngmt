package com.supportportal.pg.repository;

import com.supportportal.pg.model.Pg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PgRepository extends JpaRepository<Pg, Long> {

    @Query(value = "SELECT p.id, p.name, p.address, p.latitude, p.longitude, p.google_map_link, p.created_at, (6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.latitude)))) AS distance_km FROM pgs p HAVING distance_km <= :radiusKm ORDER BY distance_km", nativeQuery = true)
    List<Object[]> findNearbyRaw(@Param("lat") double lat, @Param("lng") double lng, @Param("radiusKm") double radiusKm);
}
