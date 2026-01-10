package org.example.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    private String status;

    @ElementCollection
    @CollectionTable(name = "order_product_names", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "product_names")
    private List<String> productNames;
}