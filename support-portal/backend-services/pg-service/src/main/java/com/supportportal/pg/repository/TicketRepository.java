package com.supportportal.pg.repository;

import com.supportportal.pg.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {}
