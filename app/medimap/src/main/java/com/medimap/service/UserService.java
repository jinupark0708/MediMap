package com.medimap.service;

import com.medimap.model.User;
import com.medimap.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void updatePassword(String email, String currentPassword, String newPassword) {
        System.out.println("✅ updatePassword 진입");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(currentPassword)) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(newPassword);
            userRepository.save(user); // ✅ 직접 save
        } else {
            throw new RuntimeException("새 비밀번호를 입력해주세요.");
        }
    }

    @Transactional
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }
}