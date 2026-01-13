package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    private String currency;

    // 🚀 OPTIMIZACIÓN DE VELOCIDAD:
    // Usamos Set en lugar de List para permitir "JOIN FETCH" múltiples
    // Esto reduce las consultas a la base de datos de 51 a solo 1.
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private Set<String> images = new HashSet<>();

    private String category;    // HOMBRE, MUJER

    @Column(name = "sub_category")
    private String subCategory; // REMERAS, JOGGERS, etc.

    private String tag;         // NEW, BEST SELLER
    private String description;

    // 🚀 OPTIMIZACIÓN DE VELOCIDAD:
    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    private Set<String> sizes = new HashSet<>();
}