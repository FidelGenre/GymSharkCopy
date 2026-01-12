package org.example.controller;

import org.example.model.Card;
import org.example.model.Order;
import org.example.repository.CardRepository;
import org.example.service.MercadoPagoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
// CORS eliminado: SecurityConfig ya permite el acceso público a /api/payments/** // para que los Webhooks de Mercado Pago entren sin problemas.
public class PaymentController {

    private final CardRepository cardRepository;
    private final MercadoPagoService mpService;

    // Inyección de dependencias por constructor (Best Practice)
    public PaymentController(CardRepository cardRepository, MercadoPagoService mpService) {
        this.cardRepository = cardRepository;
        this.mpService = mpService;
    }

    /**
     * Pago manual: Guarda los datos en 'user_cards'.
     * Útil si decides implementar tu propia pasarela o guardar tarjetas de prueba.
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
     * Express Checkout: Genera el link de pago (Preference) de Mercado Pago.
     * CAMBIO: Renombrado a "/create-preference" para coincidir con tu frontend React.
     */
    @PostMapping("/create-preference")
    public ResponseEntity<?> createPreference(@RequestBody Order order) {
        try {
            // Generamos la preferencia usando el servicio y recibimos la URL (init_point)
            String initPoint = mpService.createPreference(order);
            
            if (initPoint != null) {
                // Devolvemos un JSON simple con la URL de redirección
                return ResponseEntity.ok(Map.of("init_point", initPoint));
            } else {
                return ResponseEntity.status(500).body("No se pudo generar el link de Mercado Pago");
            }
        } catch (Exception e) {
            e.printStackTrace(); // Para ver el error en los logs de Render
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }

    /**
     * WEBHOOK: Endpoint que Mercado Pago llama automáticamente al procesar el pago.
     * SecurityConfig.java permite el acceso sin autenticación a esta ruta.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(
            @RequestParam(value = "data.id", required = false) String dataId,
            @RequestParam(value = "type", required = false) String type) {

        try {
            // Solo procesamos si es una notificación de pago
            if ("payment".equals(type) && dataId != null) {
                System.out.println("Webhook recibido: Pago ID " + dataId);
                mpService.handlePaymentNotification(Long.parseLong(dataId));
            }
        } catch (NumberFormatException e) {
            System.err.println("Error al parsear ID del pago: " + dataId);
        } catch (Exception e) {
            System.err.println("Error procesando webhook: " + e.getMessage());
        }

        // Siempre responder 200 OK rápidamente para que Mercado Pago no reintente el envío
        // ni bloquee tu integración por timeout.
        return ResponseEntity.ok().build();
    }
}