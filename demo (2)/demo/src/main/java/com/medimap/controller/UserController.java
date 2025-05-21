package com.medimap.controller;

import com.medimap.model.LoginRequest;
import com.medimap.model.User;
import com.medimap.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api") // ✅ 경로의 앞부분: /api
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ 로그인: /api/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        User user = userOpt.get();

        Map<String, String> result = new HashMap<>();
        result.put("role", user.getRole().name());
        result.put("email", user.getEmail());

        return ResponseEntity.ok(result);
    }

    // ✅ 회원가입: /api/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 이메일입니다.");
        }

        userRepository.save(newUser);
        return ResponseEntity.ok("회원가입 성공");
    }

    // ✅ 회원정보 수정: /api/users/me (프론트 PUT 요청과 일치)
    @PutMapping("/users/me")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password does not match");
        }

        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(newPassword);
            userRepository.save(user);
            return ResponseEntity.ok("Password updated");
        } else {
            return ResponseEntity.ok("No password change");
        }
    }

    // ✅ 회원 탈퇴: /api/users/me?email=... (프론트 DELETE 요청과 일치)
    @DeleteMapping("/users/me")
    public ResponseEntity<?> deleteUser(@RequestParam("email") String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userRepository.delete(userOpt.get());
        return ResponseEntity.ok("User deleted");
    }
}