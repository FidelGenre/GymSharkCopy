package org.example.controller;

import org.example.model.Product;
import org.example.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
// CORS eliminado: Se gestiona globalmente en WebConfig para permitir gymshark.com.ar
public class ProductController {

    private final ProductRepository productRepository;

    // Inyección por constructor (Best Practice)
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "subCategory", required = false) String subCategory,
            @RequestParam(name = "search", required = false) String search) {
        
        try {
            // 1. Buscador de la Navbar (prioridad alta)
            if (search != null && !search.isEmpty()) {
                return productRepository.findByNameContainingIgnoreCase(search);
            }
            
            // 2. Lógica para "VER TODO"
            // Si el frontend envía "VER TODO", mostramos todos los productos de ese género
            if (category != null && (subCategory == null || subCategory.equalsIgnoreCase("VER TODO"))) {
                return productRepository.findByCategoryIgnoreCase(category);
            }
            
            // 3. Filtro específico (ej: HOMBRE + REMERAS)
            if (category != null && subCategory != null) {
                return productRepository.findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(category, subCategory);
            }
            
            // 4. Si no hay filtros, devolvemos todo (Home page o fallback)
            return productRepository.findAll();

        } catch (Exception e) {
            e.printStackTrace(); // Para ver errores en los logs de Render si algo falla en la DB
            return List.of(); // Devolvemos lista vacía en vez de romper la app
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable(name = "id") Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}