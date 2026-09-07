package com.domux.app.data.remote.dto

data class ReservationDto(
    val id: String,
    val commonAreaId: String,
    val date: String, // ISO 8601, ej. "2026-09-07T00:00:00.000Z"
    val startTime: String, // "HH:mm"
    val endTime: String,
    val status: String, // ACTIVE | CANCELLED
    val createdAt: String,
    val commonArea: CommonAreaDto?
)

data class CreateReservationRequest(
    val commonAreaId: String,
    val date: String, // "yyyy-MM-dd"
    val startTime: String,
    val endTime: String
)
