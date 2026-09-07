package com.domux.app.data.remote.dto

data class UnitDto(
    val id: String,
    val code: String
)

data class VisitorDto(
    val id: String,
    val unitId: String,
    val fullName: String,
    val documentId: String,
    val type: String, // VISITOR | DELIVERY | TECHNICIAN
    val status: String, // AUTHORIZED | CANCELLED | ENTERED | EXITED
    val entryAt: String?,
    val exitAt: String?,
    val createdAt: String,
    // Presente solo cuando GATEKEEPER (o ADMIN) hace la consulta; null para RESIDENT.
    val unit: UnitDto?
)

data class AuthorizeVisitorRequest(
    val fullName: String,
    val documentId: String,
    val type: String
)

data class RegisterVisitorManuallyRequest(
    val fullName: String,
    val documentId: String,
    val type: String,
    val unitCode: String
)
