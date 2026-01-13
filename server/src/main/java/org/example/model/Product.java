package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

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

    // Usamos SET para permitir la carga rápida (JOIN FETCH)
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<String> images = new HashSet<>();

    private String category;    // HOMBRE, MUJER

    @Column(name = "sub_category")
    private String subCategory; // REMERAS, JOGGERS, etc.

    private String tag;         // NEW, BEST SELLER
    private String description;

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<String> sizes = new HashSet<>();
}