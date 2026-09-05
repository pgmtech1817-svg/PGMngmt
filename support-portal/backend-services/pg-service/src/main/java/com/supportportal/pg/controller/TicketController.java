package com.supportportal.pg.controller;

import com.supportportal.pg.model.Ticket;
import com.supportportal.pg.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketRepository repo;
    public TicketController(TicketRepository repo){this.repo = repo;}

    @GetMapping
    public List<Ticket> list(){ return repo.findAll(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Ticket t){
        if (t.getTitle() == null) return ResponseEntity.badRequest().body("Title required");
        t.setStatus(t.getStatus()==null?"open":t.getStatus());
        t.setPriority(t.getPriority()==null?"normal":t.getPriority());
        Ticket saved = repo.save(t);
        return ResponseEntity.status(201).body(saved);
    }
}
