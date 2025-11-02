package com.IFC.BCC2025.to_do_list.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.IFC.BCC2025.to_do_list.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmailAndPassword(String email, String password);
    User findByEmail(String email);
}
