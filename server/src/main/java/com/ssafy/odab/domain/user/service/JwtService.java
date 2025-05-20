package com.ssafy.odab.domain.user.service;

import com.ssafy.odab.domain.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity;

    private Key key;

    @PostConstruct
    protected void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 사용자 정보를 기반으로 Access Token을 생성합니다.
     */
    public String createAccessToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getId().toString());
        claims.put("userName", user.getUserName());

        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidity*1000);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 사용자 정보를 기반으로 Refresh Token을 생성합니다.
     */
    public String createRefreshToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getId().toString());
        Date now = new Date();
        Date validity = new Date(now.getTime() + refreshTokenValidity * 1000);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Access Token에서 사용자 ID를 추출합니다.
     */
    public Integer getUserIdFromAccessToken(String accessToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(accessToken)
                .getBody();
        return Integer.parseInt(claims.getSubject());
    }

    public Integer getUserIdFromRequest() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes == null) {
                throw new RuntimeException("Request not found");
            }

            String accessToken = resolveAccessToken(attributes.getRequest());
            return getUserIdFromToken(accessToken);
        } catch (Exception e) {
            throw new RuntimeException("토큰에서 사용자 ID를 추출할 수 없습니다: " + e.getMessage());
        }
    }

    public Integer getUserIdFromToken(String token) {
        if (token != null && validateAccessToken(token)) {
            return getUserIdFromAccessToken(token);
        }
        throw new RuntimeException("유효한 인증 Access Token이 없습니다.");
    }

    /**
     * Access Token의 유효성을 검증합니다.
     */
    public boolean validateAccessToken(String accessToken) {
        try {
            System.out.println("accessToken오나?" + accessToken);
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken);
            return true;
        } catch (Exception e) {
            System.out.println("토큰 검증 오류: " + e.getClass().getName() + " - " + e.getMessage());
            return false;
        }
    }

    public long getRefreshTokenValidity() {
        return refreshTokenValidity;
    }

    // 현재 요청의 HttpServletRequest 가져오기
    private HttpServletRequest getCurrentRequest() {
//        System.out.println("여기 오나11");
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
//        System.out.println("여기 오나22");
        if (attributes == null) {
            throw new RuntimeException("Request not found");
        }
        return attributes.getRequest();
    }

    // 컨트롤러에서 매개변수 없이 userId 추출
    public Integer getUserId() {
        String accessToken = resolveAccessToken(getCurrentRequest());
        if (accessToken != null && validateAccessToken(accessToken)) {
            return getUserIdFromAccessToken(accessToken);
        }
        throw new RuntimeException("유효한 인증 Access Token이 없습니다.");
    }

    // Request의 Header에서 access token 값 추출
    public String resolveAccessToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}