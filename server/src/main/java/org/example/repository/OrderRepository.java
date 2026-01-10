package org.example.repository;

import org.example.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Genera automáticamente la consulta SQL: SELECT * FROM orders WHERE user_id = ?
    List<Order> findByUserId(Long userId);
}