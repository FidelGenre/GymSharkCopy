package org.example.repository;

import org.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 1. Filtra por género y tipo de prenda (Ej: MUJER y Shorts)
    List<Product> findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(String category, String subCategory);

    // 2. Filtra sólo por género (HOMBRE o MUJER)
    List<Product> findByCategoryIgnoreCase(String category);

    // 3. Buscador por nombre (Barra de búsqueda)
    List<Product> findByNameContainingIgnoreCase(String name);

    // 4. SOLUCIÓN AL ERROR: Buscador parcial por categoría
    List<Product> findByCategoryContainingIgnoreCase(String category);
}