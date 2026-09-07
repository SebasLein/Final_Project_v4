package com.domux.app.data.remote.dto

data class LoginRequest(
    val email: String,
    val password: String
)

data class UserDto(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val tenantId: String?
)

data class LoginResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: UserDto
)

data class RefreshRequest(
    val refreshToken: String
)

data class RefreshResponse(
    val accessToken: String
)
