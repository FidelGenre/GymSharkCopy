package org.example.controller;

import org.example.model.Product;
import org.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "subCategory", required = false) String subCategory,
            @RequestParam(name = "search", required = false) String search) {
        
        // 1. Buscador de la Navbar
        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        
        // 2. Lógica para "VER TODO"
        // Si el usuario pide "VER TODO", ignoramos la subcategoría y mostramos todo el género
        if (category != null && (subCategory == null || subCategory.equalsIgnoreCase("VER TODO"))) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        
        // 3. Filtro específico (ej: HOMBRE + REMERAS)
        if (category != null && subCategory != null) {
            return productRepository.findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(category, subCategory);
        }
        
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable(name = "id") Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}