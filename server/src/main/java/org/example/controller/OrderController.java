package org.example.controller;

import org.example.model.Order;
import org.example.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
// CORS eliminado: Se gestiona globalmente en WebConfig para soportar producción
public class OrderController {

    private final OrderRepository orderRepository;

    // Inyección por constructor (Best Practice en Spring Boot)
    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            // Asignamos la fecha del servidor para evitar discrepancias de zona horaria
            order.setOrderDate(LocalDateTime.now());
            
            // Nota: En un futuro, podrías recibir el estado desde el webhook de Mercado Pago
            if (order.getStatus() == null || order.getStatus().isEmpty()) {
                order.setStatus("COMPLETADO");
            }
            
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            e.printStackTrace(); // Útil para ver el error en los logs de Render
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Obtiene los pedidos de un usuario específico.
     * Mantenemos @PathVariable("userId") para evitar errores de compilación en Docker.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable("userId") Long userId) {
        try {
            List<Order> orders = orderRepository.findByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error al obtener pedidos: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}