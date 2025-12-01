package com.IFC.BCC2025.to_do_list.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.IFC.BCC2025.to_do_list.model.User;
import com.IFC.BCC2025.to_do_list.model.DTO.UserDTO;
import com.IFC.BCC2025.to_do_list.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController { 

    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody UserDTO body) throws Exception{
        User user = userService.logarUser(body.getEmail(), body.getPassword());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserDTO body) throws Exception {
        User userSaved = userService.createUser(body.getName(), body.getEmail(), body.getPassword());
        return ResponseEntity.ok(userSaved);
    }

}