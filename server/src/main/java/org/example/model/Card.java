package org.example.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty; // IMPORTANTE

@Entity
@Table(name = "user_cards")
@Data
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    
    @Column(name = "card_number")
    @JsonProperty("cardNumber")
    private String cardNumber;
    
    @Column(name = "card_holder_name")
    @JsonProperty("cardHolderName")
    private String cardHolderName;
    
    @Column(name = "expiry_date")
    @JsonProperty("expiryDate")
    private String expiryDate;

    private String cvv;

    // --- DATOS DE ENTREGA ---
    // El @JsonProperty debe coincidir con el payload de React
    // El @Column debe coincidir con tu tabla de PostgreSQL
    
    @Column(name = "first_name")
    @JsonProperty("firstName") 
    private String firstName;

    @Column(name = "last_name")
    @JsonProperty("lastName")
    private String lastName;

    @Column(name = "address")
    @JsonProperty("address")
    private String address;

    @Column(name = "apartment")
    @JsonProperty("apartment")
    private String apartment;

    @Column(name = "city")
    @JsonProperty("city")
    private String city;

    @Column(name = "postal_code")
    @JsonProperty("postalCode")
    private String postalCode;

    @Column(name = "province")
    @JsonProperty("province")
    private String province;

    @Column(name = "phone")
    @JsonProperty("phone")
    private String phone;

    // --- DATOS DE FACTURACIÓN ---
    
    @Column(name = "billing_first_name")
    @JsonProperty("billingFirstName")
    private String billingFirstName;

    @Column(name = "billing_last_name")
    @JsonProperty("billingLastName")
    private String billingLastName;

    @Column(name = "billing_address")
    @JsonProperty("billingAddress")
    private String billingAddress;

    @Column(name = "billing_city")
    @JsonProperty("billingCity")
    private String billingCity;

    @Column(name = "billing_postal_code")
    @JsonProperty("billingPostalCode")
    private String billingPostalCode;

    @Column(name = "billing_province")
    @JsonProperty("billingProvince")
    private String billingProvince;
}