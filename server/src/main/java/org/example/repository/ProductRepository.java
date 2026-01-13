package org.example.repository;

import org.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 🚀 CONSULTA MAESTRA (Trae todo junto):
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.sizes")
    List<Product> findAllWithRelationships();

    // 1. FILTRO GÉNERO Y TIPO (Arreglado con ?1 y ?2)
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.sizes WHERE UPPER(p.category) = UPPER(?1) AND UPPER(p.subCategory) = UPPER(?2)")
    List<Product> findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(String category, String subCategory);

    // 2. FILTRO SÓLO GÉNERO (Arreglado con ?1)
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.sizes WHERE UPPER(p.category) = UPPER(?1)")
    List<Product> findByCategoryIgnoreCase(String category);

    // 3. Buscadores simples (Estos Spring los hace automáticos, no necesitan @Query)
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryContainingIgnoreCase(String category);
}