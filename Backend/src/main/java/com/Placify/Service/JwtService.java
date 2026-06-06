package com.Placify.Service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET;
    private static final long EXPIRATION = 1000 * 60 * 60 * 24;

    // ----------------------------------------
    // CREATE TOKEN
    // ----------------------------------------
    public String generateToken(String email, String role) {
        try {
            JWSSigner signer = new MACSigner(SECRET);

            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(email)
                    .claim("role", role)
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION))
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),
                    claims
            );

            signedJWT.sign(signer);
            return signedJWT.serialize();

        } catch (Exception e) {
            throw new RuntimeException("JWT creation failed!", e);
        }
    }

    // ----------------------------------------
    // PARSE TOKEN
    // ----------------------------------------
    private SignedJWT parseToken(String token) {
        try {
            return SignedJWT.parse(token);
        } catch (ParseException e) {
            throw new RuntimeException("Invalid JWT Token!", e);
        }
    }

    // ----------------------------------------
    // EXTRACT EMAIL (SUBJECT)
    // ----------------------------------------
    public String extractEmail(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return null;
            }

            SignedJWT jwt = parseToken(token);
            return jwt.getJWTClaimsSet().getSubject();

        } catch (Exception e) {
            // Invalid or corrupted token
            return null;
        }
    }


    // ----------------------------------------
    // VALIDATE TOKEN (SIGNATURE + EXPIRY)
    // ----------------------------------------
    public boolean isValid(String token) {
        try {
            SignedJWT jwt = parseToken(token);

            // 🔐 Signature verify
            MACVerifier verifier = new MACVerifier(SECRET);
            if (!jwt.verify(verifier)) return false;

            // ⏳ Expiry check
            Date exp = jwt.getJWTClaimsSet().getExpirationTime();
            return exp != null && exp.after(new Date());

        } catch (Exception e) {
            return false;
        }
    }
}
