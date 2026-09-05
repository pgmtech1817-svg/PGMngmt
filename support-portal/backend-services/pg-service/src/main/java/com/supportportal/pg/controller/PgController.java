package com.supportportal.pg.controller;

import com.supportportal.pg.model.Pg;
import com.supportportal.pg.repository.PgRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/pgs")
public class PgController {
    private final PgRepository repo;
    public PgController(PgRepository repo){ this.repo = repo; }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Pg p){
        Pg saved = repo.save(p);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam double lat, @RequestParam double lng, @RequestParam(defaultValue = "5") double radiusKm){
        List<Object[]> rows = repo.findNearbyRaw(lat, lng, radiusKm);
        List<Map<String,Object>> out = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("id", r[0]);
            m.put("name", r[1]);
            m.put("address", r[2]);
            m.put("latitude", r[3]);
            m.put("longitude", r[4]);
            m.put("googleMapLink", r[5]);
            m.put("createdAt", r[6]);
            m.put("distanceKm", r[r.length-1]);
            out.add(m);
        }
        return ResponseEntity.ok(out);
    }
}
