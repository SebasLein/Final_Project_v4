package com.domux.app.data.remote.dto

data class PackageDto(
    val id: String,
    val unitId: String,
    val recipient: String,
    val status: String, // PENDING | DELIVERED
    val deliveredAt: String?,
    val createdAt: String,
    // Presente para GATEKEEPER/ADMIN; null para RESIDENT.
    val unit: UnitDto?
)

data class RegisterPackageRequest(
    val unitCode: String,
    val recipient: String
)
