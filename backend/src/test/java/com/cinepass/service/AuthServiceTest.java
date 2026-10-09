package com.cinepass.service;

import com.cinepass.dto.AuthResponse;
import com.cinepass.dto.LoginRequest;
import com.cinepass.dto.RegisterRequest;
import com.cinepass.dto.UserDto;
import com.cinepass.entity.User;
import com.cinepass.exception.ConflictException;
import com.cinepass.exception.ResourceNotFoundException;
import com.cinepass.repository.UserRepository;
import com.cinepass.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("alice@test.com", "encodedPass", "Alice", false);
        sampleUser.setId(UUID.randomUUID());
    }

    @Test
    @DisplayName("Register - Success when email is unique")
    void register_success() {
        RegisterRequest req = new RegisterRequest("alice@test.com", "password123", "Alice");

        when(userRepository.existsByEmailIgnoreCase("alice@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateToken(sampleUser.getId(), sampleUser.getEmail(), sampleUser.getName(), sampleUser.isAdmin()))
                .thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("alice@test.com", response.getUser().getEmail());
        assertEquals("Alice", response.getUser().getName());
        assertFalse(response.getUser().isAdmin());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Register - Throws ConflictException when email already exists")
    void register_emailExists() {
        RegisterRequest req = new RegisterRequest("alice@test.com", "password123", "Alice");
        when(userRepository.existsByEmailIgnoreCase("alice@test.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login - Success returns token and user")
    void login_success() {
        LoginRequest req = new LoginRequest("alice@test.com", "password123");

        when(userRepository.findByEmailIgnoreCase("alice@test.com")).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateToken(sampleUser.getId(), sampleUser.getEmail(), sampleUser.getName(), sampleUser.isAdmin()))
                .thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals(sampleUser.getEmail(), response.getUser().getEmail());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("Login - Throws ResourceNotFoundException when user does not exist")
    void login_userNotFound() {
        LoginRequest req = new LoginRequest("unknown@test.com", "password123");

        when(userRepository.findByEmailIgnoreCase("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("GetCurrentUser - Returns user DTO")
    void getCurrentUser_success() {
        when(userRepository.findByEmailIgnoreCase("alice@test.com")).thenReturn(Optional.of(sampleUser));

        UserDto dto = authService.getCurrentUser("alice@test.com");

        assertNotNull(dto);
        assertEquals("alice@test.com", dto.getEmail());
        assertEquals("Alice", dto.getName());
    }

    @Test
    @DisplayName("UserDto - Serializes admin flag using the frontend contract")
    void userDto_serializesAdminFlag() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode json = objectMapper.readTree(objectMapper.writeValueAsString(
                new UserDto(UUID.randomUUID(), "admin@test.com", "Admin", true)));

        assertTrue(json.get("isAdmin").asBoolean());
        assertNull(json.get("admin"));
    }
}
