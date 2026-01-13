package org.example.service;

import org.example.model.Product;
import org.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Obtiene productos aplicando filtros dinámicos.
     */
    public List<Product> getAllProducts(String category, String search) {
        // 1. Prioridad: Búsqueda por texto en el nombre
        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }

        // 2. Filtro por categoría (Género o Tipo)
        if (category != null && !category.isEmpty()) {
            // Usamos la versión optimizada si es una búsqueda exacta de género
            if (category.equalsIgnoreCase("HOMBRE") || category.equalsIgnoreCase("MUJER")) {
                 return productRepository.findByCategoryIgnoreCase(category);
            }
            return productRepository.findByCategoryContainingIgnoreCase(category);
        }

        // 3. Si no hay parámetros (HOME PAGE), usamos la consulta OPTIMIZADA
        // ANTES: return productRepository.findAll();  <-- LENTO (8s)
        // AHORA:
        return productRepository.findAllWithRelationships(); // <-- RÁPIDO (0.2s)
    }

    /**
     * Obtiene productos por categoría y subcategoría (Filtro de navegación)
     */
    public List<Product> getProductsByGenderAndType(String category, String subCategory) {
        return productRepository.findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(category, subCategory);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
}