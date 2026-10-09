package com.cinepass.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

public class UserDto {
    private UUID id;
    private String email;
    private String name;
    private boolean isAdmin;

    public UserDto() {}

    public UserDto(UUID id, String email, String name, boolean isAdmin) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.isAdmin = isAdmin;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("isAdmin")
    public boolean isAdmin() {
        return isAdmin;
    }

    @JsonProperty("isAdmin")
    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}
