package com.Placify.Service;

import com.Placify.Entity.AuditLog;
import com.Placify.Entity.Role;
import com.Placify.Entity.User;
import com.Placify.Repository.AuditLogRepository;
import com.Placify.Repository.UserRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final Cloudinary cloudinary;

    // ✅ Constructor Injection
    public UserService(UserRepository userRepository,
                       AuditLogRepository auditLogRepository,
                       Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.cloudinary = cloudinary;
    }

    // ------------------------------------------------
    public List<User> getAll() {
        return userRepository.findAll();
    }

    public void save(User user) {
        userRepository.save(user);
    }

    // ------------------------------------------------
    // DELETE USER + AUDIT LOG
    // ------------------------------------------------
    public void deleteById(String userId, String adminEmail) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 delete profile image from cloudinary (if exists)
        if (user.getProfileImagePublicId() != null) {
            try {
                cloudinary.uploader().destroy(
                        user.getProfileImagePublicId(),
                        ObjectUtils.emptyMap()
                );
            } catch (Exception e) {
                // ignore image delete failure
            }
        }

        userRepository.deleteById(userId);

        auditLogRepository.save(
                new AuditLog(
                        null,
                        adminEmail,
                        "DELETE_USER",
                        user.getEmail(),
                        Instant.now()
                )
        );
    }

    // ------------------------------------------------
    // UPDATE ROLE + AUDIT LOG
    // ------------------------------------------------
    public User updateRole(String id, Role role, String adminEmail) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String oldRole = user.getRole().name();
        user.setRole(role);
        User updated = userRepository.save(user);

        auditLogRepository.save(
                new AuditLog(
                        null,
                        adminEmail,
                        "CHANGE_ROLE_" + oldRole + "_TO_" + role.name(),
                        user.getEmail(),
                        Instant.now()
                )
        );

        return updated;
    }

    // ------------------------------------------------
    // BLOCK / UNBLOCK + AUDIT LOG
    // ------------------------------------------------
    public User toggleBlock(String id, String adminEmail) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(!user.isBlocked());
        User updated = userRepository.save(user);

        auditLogRepository.save(
                new AuditLog(
                        null,
                        adminEmail,
                        user.isBlocked() ? "BLOCK_USER" : "UNBLOCK_USER",
                        user.getEmail(),
                        Instant.now()
                )
        );

        return updated;
    }

    // ------------------------------------------------
// 🔹 UPLOAD / UPDATE PROFILE IMAGE (CLOUDINARY)
// ------------------------------------------------
    public User uploadProfileImage(String userId,
                                   MultipartFile file,
                                   String userEmail) {

        // ✅ FILE VALIDATION (IMPORTANT)
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Image file is empty or missing");
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 🔥 delete old image if exists
            if (user.getProfileImagePublicId() != null &&
                    !user.getProfileImagePublicId().isBlank()) {

                cloudinary.uploader().destroy(
                        user.getProfileImagePublicId(),
                        ObjectUtils.emptyMap()
                );
            }

            // 🔥 upload new image to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "placify/users",
                            "resource_type", "image"
                    )
            );

            // 🔐 SAFETY CHECK
            if (uploadResult == null || !uploadResult.containsKey("secure_url")) {
                throw new RuntimeException("Cloudinary upload failed");
            }

            user.setProfileImage(uploadResult.get("secure_url").toString());
            user.setProfileImagePublicId(uploadResult.get("public_id").toString());

            User updated = userRepository.save(user);

            // 📝 audit log
            auditLogRepository.save(
                    new AuditLog(
                            null,
                            userEmail,
                            "UPDATE_PROFILE_IMAGE",
                            user.getEmail(),
                            Instant.now()
                    )
            );

            return updated;

        } catch (Exception e) {
            // 🔥 PRINT ACTUAL ERROR
            e.printStackTrace();

            throw new RuntimeException(
                    "Profile image upload failed: " + e.getMessage()
            );
        }
    }
    public User uploadProfileImageByEmail(
            MultipartFile file,
            String email
    ) {

        // ✅ File validation
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Image file is empty");
        }

        try {
            // 🔍 Find user by email (from JWT)
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 🔥 Delete old image if exists
            if (user.getProfileImagePublicId() != null &&
                    !user.getProfileImagePublicId().isBlank()) {

                cloudinary.uploader().destroy(
                        user.getProfileImagePublicId(),
                        ObjectUtils.emptyMap()
                );
            }

            // ☁️ Upload new image to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "placify/users",
                            "resource_type", "image"
                    )
            );

            // 🛡️ Safety check
            if (uploadResult == null || !uploadResult.containsKey("secure_url")) {
                throw new RuntimeException("Cloudinary upload failed");
            }

            // 📝 Update user
            user.setProfileImage(uploadResult.get("secure_url").toString());
            user.setProfileImagePublicId(uploadResult.get("public_id").toString());

            User updatedUser = userRepository.save(user);

            // 🧾 Audit log
            auditLogRepository.save(
                    new AuditLog(
                            null,
                            email,
                            "UPDATE_PROFILE_IMAGE",
                            user.getEmail(),
                            Instant.now()
                    )
            );

            return updatedUser;

        } catch (Exception e) {
            // 🔥 Print exact error in console
            e.printStackTrace();
            throw new RuntimeException(
                    "Profile image upload failed: " + e.getMessage()
            );
        }
    }


}
