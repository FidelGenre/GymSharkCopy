package org.example.controller;

import org.example.dto.PasswordChangeRequest;
import org.example.dto.UserUpdateRequest;
import org.example.model.User;
import org.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
// CORS eliminado: Se gestiona globalmente en WebConfig para soportar producción
public class UserController {

    private final UserService userService;

    // Inyección por constructor (Standard en Spring Boot para producción)
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        try {
            User updatedUser = userService.updateUser(id, request);
            
            // Seguridad: Borramos la password antes de devolver el objeto al frontend
            // Aunque lo ideal es un DTO, esta línea es vital para no exponer el hash BCrypt
            updatedUser.setPassword(null); 
            
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            // Logueamos el error para verlo en el dashboard de Render si ocurre
            System.err.println("Error actualizando perfil: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody PasswordChangeRequest request) {
        try {
            userService.changePassword(id, request);
            return ResponseEntity.ok("Contraseña actualizada correctamente.");
        } catch (RuntimeException e) {
            // Manejamos errores de negocio (ej: password actual incorrecta)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Manejamos errores inesperados
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }
}