package com.medimap.controller;

import com.medimap.service.UserService;
import com.medimap.model.LoginRequest;
import com.medimap.model.User;
import com.medimap.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        System.out.println("✅ 입력 email: [" + request.getEmail() + "]");
        System.out.println("✅ 입력 password: [" + request.getPassword() + "]");

        if (userOpt.isEmpty()) {
            System.out.println("✅ 해당 email 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        System.out.println("✅ DB password: [" + userOpt.get().getPassword() + "]");

        if (!userOpt.get().getPassword().equals(request.getPassword())) {
            System.out.println("✅ 비밀번호 불일치");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        User user = userOpt.get();
        Map<String, String> result = new HashMap<>();
        result.put("role", user.getRole().name());
        result.put("email", user.getEmail());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 이메일입니다.");
        }

        userRepository.save(newUser);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PutMapping("/users/me")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> body) {
        System.out.println("✅ UserController.updateUser 진입");
        try {
            String email = body.get("email");
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");

            userService.updatePassword(email, currentPassword, newPassword);
            return ResponseEntity.ok("Password updated");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/users/me")
    public ResponseEntity<?> deleteUser(@RequestParam("email") String email) {
        try {
            userService.deleteUser(email);
            return ResponseEntity.ok("User deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}