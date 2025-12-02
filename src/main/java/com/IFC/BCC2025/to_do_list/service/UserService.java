package com.IFC.BCC2025.to_do_list.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Service;

import com.IFC.BCC2025.to_do_list.model.User;
import com.IFC.BCC2025.to_do_list.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String name, String email, String password) {
        User newUser = new User(name, email, gerarHash(password, email));
        if (userRepository.findByEmail(email) != null) {
            throw new SecurityException("Email já cadastrado");
        }
        return userRepository.save(newUser);
    }

    public User logarUser(String email, String password) {
        User user = userRepository.findByEmailAndPassword(email, gerarHash(password, email));
        if (user == null) {
            throw new SecurityException("Email ou senha inválidos");
        } else {
            return user;
        }
    }

    private String gerarHash(String senha, String email) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest((senha + email).getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash", e);
        }
    }
}