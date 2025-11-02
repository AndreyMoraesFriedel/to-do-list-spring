package com.IFC.BCC2025.to_do_list.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.IFC.BCC2025.to_do_list.model.User;
import com.IFC.BCC2025.to_do_list.repository.UserRepository;

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

    User user = userRepository.findByEmailAndPassword(email, password);

    if (user != null) {
        return ResponseEntity.ok(Map.of("status", "success", "name", user.getName()));
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("status", "fail"));
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
        newUser.setPassword(password); //criptografa bb
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("status", "success", "message", "Usuário cadastrado com sucesso"));
    }
}



