package org.example.repository;

import org.example.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    // Permite guardar y buscar tarjetas en la tabla user_cards
}