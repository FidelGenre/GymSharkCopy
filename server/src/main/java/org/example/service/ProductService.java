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

    public List<Product> getAllProducts(String category, String search) {
        // 1. Búsqueda por texto
        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }

        // 2. Filtro por categoría
        if (category != null && !category.isEmpty()) {
            if (category.equalsIgnoreCase("HOMBRE") || category.equalsIgnoreCase("MUJER")) {
                 return productRepository.findByCategoryIgnoreCase(category);
            }
            return productRepository.findByCategoryContainingIgnoreCase(category);
        }

        // 3. HOME PAGE (Sin filtros)
        // Gracias a 'default_batch_fetch_size=50', esto ahora hace solo 3 consultas rápidas
        // en lugar de 1 gigante o 51 lentas.
        return productRepository.findAll();
    }
    
    // ... resto de métodos (getProductById, etc.) igual que antes
    public List<Product> getProductsByGenderAndType(String category, String subCategory) {
        return productRepository.findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(category, subCategory);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
}