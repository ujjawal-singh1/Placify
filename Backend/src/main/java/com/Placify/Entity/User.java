package com.Placify.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;
    private boolean blocked = false;

    // Cloudinary image URL (frontend me show hoga)
    @Builder.Default
    private String profileImage =
            "https://res.cloudinary.com/dukk62zbk/image/upload/v1/default-avatar.png";

    // (Optional but good practice)
    // Cloudinary public_id (image update/delete ke kaam aata hai)
    private String profileImagePublicId;

    @Builder.Default
    private Role role = Role.USER;

    @Builder.Default
    private Provider provider = Provider.LOCAL;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public String getUsername() {
        return this.email;
    }
}
