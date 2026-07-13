package com.Placify.Controller;

import com.Placify.Entity.Role;
import com.Placify.Entity.User;
import com.Placify.Service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ------------------------------------------------
    // GET ALL USERS
    // ------------------------------------------------
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAll();
    }

    // ------------------------------------------------
    // DELETE USER + AUDIT LOG
    // ------------------------------------------------
    @DeleteMapping("/{id}")
    public void deleteUser(
            @PathVariable String id,
            @RequestParam String adminEmail
    ) {
        userService.deleteById(id, adminEmail);
    }

    // ------------------------------------------------
    // CHANGE ROLE + AUDIT LOG
    // ------------------------------------------------
    @PutMapping("/{id}/role")
    public User changeRole(
            @PathVariable String id,
            @RequestParam Role role,
            @RequestParam String adminEmail
    ) {
        return userService.updateRole(id, role, adminEmail);
    }

    // ------------------------------------------------
    // BLOCK / UNBLOCK + AUDIT LOG
    // ------------------------------------------------
    @PutMapping("/{id}/block")
    public User blockUser(
            @PathVariable String id,
            @RequestParam String adminEmail
    ) {
        return userService.toggleBlock(id, adminEmail);
    }

    // ------------------------------------------------
    // 🔥 UPLOAD / UPDATE PROFILE IMAGE (CLOUDINARY)
    // ------------------------------------------------
    @PostMapping("/{id}/profile-image")
    public User uploadProfileImage(
            @PathVariable String id,
            @RequestParam("image") MultipartFile image,
            @RequestParam String userEmail
    ) {
        return userService.uploadProfileImage(id, image, userEmail);
    }
    @PostMapping("/profile-image")
    public User uploadProfileImage(
            @RequestParam("image") MultipartFile image,
            Authentication authentication
    ) {
        // JwtFilter sets the principal to the User entity, not the email string
        Object principal = authentication.getPrincipal();
        String email;
        if (principal instanceof com.Placify.Entity.User userPrincipal) {
            email = userPrincipal.getEmail();
        } else {
            email = authentication.getName();
        }
        return userService.uploadProfileImageByEmail(image, email);
    }

}

