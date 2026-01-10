package org.example.controller;

import org.example.model.Card;
import org.example.model.Order;
import org.example.repository.CardRepository;
import org.example.service.MercadoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*") // Necesario para que el Webhook de Mercado Pago entre sin bloqueos
public class PaymentController {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private MercadoPagoService mpService;

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
     * Express Checkout: Genera el link de pago y persiste la orden como PENDIENTE.
     */
    @PostMapping("/mercadopago")
    public ResponseEntity<?> createMPPayment(@RequestBody Order order) {
        try {
            // Generamos la preferencia y devolvemos el link de redirección
            String initPoint = mpService.createPreference(order);
            if (initPoint != null) {
                return ResponseEntity.ok(Map.of("init_point", initPoint));
            } else {
                return ResponseEntity.status(500).body("No se pudo generar el link de Mercado Pago");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }

    /**
     * WEBHOOK: Endpoint que Mercado Pago llama automáticamente al procesar el pago.
     * Usa los parámetros data.id y type según la documentación oficial.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(
            @RequestParam(value = "data.id", required = false) String dataId,
            @RequestParam(value = "type", required = false) String type) {

        // Si la notificación es de un pago exitoso, procesamos la actualización
        if ("payment".equals(type) && dataId != null) {
            mpService.handlePaymentNotification(Long.parseLong(dataId));
        }

        // Siempre responder 200 OK para evitar que Mercado Pago reintente el envío
        return ResponseEntity.ok().build();
    }
}