package org.example.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import org.example.model.Order;
import org.example.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @Autowired
    private OrderRepository orderRepository;

    public String createPreference(Order order) {
        try {
            if (order == null || order.getTotalAmount() == null) {
                throw new IllegalArgumentException("La orden o el monto total son nulos.");
            }

            MercadoPagoConfig.setAccessToken(accessToken);

            // 1. Guardar orden (Confirmado que funciona por tus logs de Hibernate)
            order.setOrderDate(LocalDateTime.now());
            order.setStatus("PENDIENTE");
            Order savedOrder = orderRepository.save(order);

            // 2. URL de ngrok (Asegúrate de que coincida con tu terminal)
            String ngrokUrl = "https://unpausing-dell-reversely.ngrok-free.dev"; 

            // 3. Creación de Preferencia con URLs integradas
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(List.of(PreferenceItemRequest.builder()
                    .title("Gymshark Order #" + savedOrder.getId())
                    .quantity(1)
                    .unitPrice(new BigDecimal(order.getTotalAmount()))
                    .currencyId("ARS")
                    .build()))
                .notificationUrl(ngrokUrl + "/api/payments/webhook")
                .externalReference(savedOrder.getId().toString())
                // SOLUCIÓN DEFINITIVA AL ERROR 400:
                .backUrls(PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:5173/profile") // Esta es la que MP reclama
                    .failure("http://localhost:5173/checkout")
                    .pending("http://localhost:5173/profile")
                    .build())
                .autoReturn("approved")
                .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            System.out.println("✅ Preferencia creada con éxito para Orden #" + savedOrder.getId());
            return preference.getInitPoint();

        } catch (MPApiException apiException) {
            System.err.println("--- ERROR DETALLADO DE MERCADO PAGO ---");
            System.err.println("Status: " + apiException.getApiResponse().getStatusCode());
            System.err.println("Cuerpo: " + apiException.getApiResponse().getContent());
            System.err.println("---------------------------------------");
            return null;
        } catch (Exception e) {
            System.err.println("Error general: " + e.getMessage());
            return null;
        }
    }

    public void handlePaymentNotification(Long paymentId) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(paymentId);

            if ("approved".equals(payment.getStatus())) {
                Long orderId = Long.parseLong(payment.getExternalReference());
                orderRepository.findById(orderId).ifPresent(order -> {
                    order.setStatus("COMPLETADO");
                    orderRepository.save(order);
                    System.out.println("✅ Pedido #" + orderId + " PAGADO.");
                });
            }
        } catch (Exception e) {
            System.err.println("Error en Webhook: " + e.getMessage());
        }
    }
}