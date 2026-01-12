package org.example.controller;

import org.example.model.Card;
import org.example.model.Order;
import org.example.repository.CardRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final CardRepository cardRepository;

    // Solo inyectamos el repositorio de tarjetas, nada de Mercado Pago
    public PaymentController(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Pago manual: Guarda los datos en 'user_cards'.
     */
    @PostMapping("/manual")
    public ResponseEntity<String> saveManualCard(@RequestBody Card card) {
        try {
            cardRepository.save(card);
            return ResponseEntity.ok("Tarjeta guardada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar la tarjeta: " + e.getMessage());
        }
    }

    /**
     * Express Checkout: STUB (Simulacro)
     * Mantenemos el endpoint para que el frontend no de error 404,
     * pero avisamos que el servicio está deshabilitado.
     */
    @PostMapping("/create-preference")
    public ResponseEntity<?> createPreference(@RequestBody Order order) {
        // Devolvemos un mensaje simple. El frontend no redireccionará porque no hay "init_point".
        return ResponseEntity.ok(Map.of("message", "Mercado Pago ha sido deshabilitado en este entorno."));
    }
}