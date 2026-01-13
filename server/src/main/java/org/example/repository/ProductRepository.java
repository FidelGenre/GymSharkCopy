package org.example.repository;

import org.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 🚀 AHORA ES SIMPLE: Spring Data JPA usa el "batch_fetch_size" automático.
    // Ya no necesitamos JOIN FETCH manuales aquí.
    
    // 1. Filtra por género y tipo
    @Query("SELECT p FROM Product p WHERE UPPER(p.category) = UPPER(?1) AND UPPER(p.subCategory) = UPPER(?2)")
    List<Product> findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(String category, String subCategory);

    // 2. Filtra sólo por género
    @Query("SELECT p FROM Product p WHERE UPPER(p.category) = UPPER(?1)")
    List<Product> findByCategoryIgnoreCase(String category);

    // 3. Buscadores automáticos
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryContainingIgnoreCase(String category);
}