package org.example.repository;

import org.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // --- OPTIMIZACIÓN CLAVE (JOIN FETCH) ---
    // Esto trae el producto Y sus imágenes (y talles) en UN SOLO viaje.
    // Usamos DISTINCT para evitar duplicados si un producto tiene varias fotos.
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.sizes")
    List<Product> findAllWithRelationships();

    // 1. Filtra por género y tipo (Optimizada también)
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.sizes WHERE UPPER(p.category) = UPPER(:category) AND UPPER(p.subCategory) = UPPER(:subCategory)")
    List<Product> findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(String category, String subCategory);

    // 2. Filtra sólo por género (Optimizada)
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.sizes WHERE UPPER(p.category) = UPPER(:category)")
    List<Product> findByCategoryIgnoreCase(String category);

    // 3. Buscador por nombre
    List<Product> findByNameContainingIgnoreCase(String name);

    // 4. Buscador parcial por categoría
    List<Product> findByCategoryContainingIgnoreCase(String category);
}