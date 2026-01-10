package org.example.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_cards")
@Data
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    
    @Column(name = "card_number")
    private String cardNumber;
    
    @Column(name = "card_holder_name")
    private String cardHolderName;
    
    @Column(name = "expiry_date")
    private String expiryDate;

    private String cvv;
}