package com.IFC.BCC2025.to_do_list.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.IFC.BCC2025.to_do_list.model.User;
import com.IFC.BCC2025.to_do_list.repository.UserRepository;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController { 

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        User user = userRepository.findByEmailAndPassword(email, gerarHash(password));

        if (user != null) {
            return ResponseEntity.ok(Map.of(
                "status", "success", 
                "name", user.getName(),
                "userId", user.getId() 
            ));
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "fail", "message", "Email ou senha inválidos."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        
        if (userRepository.findByEmail(email) != null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("status", "fail", "message", "Email já cadastrado"));
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(gerarHash(password));
        
        User savedUser = userRepository.save(newUser); 

        return ResponseEntity.ok(Map.of(
            "status", "success", 
            "message", "Usuário cadastrado com sucesso",
            "userId", savedUser.getId() 
        ));
    }

    private String gerarHash(String senha) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(senha.getBytes());
            StringBuilder hexString = new StringBuilder();
            for(byte b : hash){
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash", e);
        }
    }
}