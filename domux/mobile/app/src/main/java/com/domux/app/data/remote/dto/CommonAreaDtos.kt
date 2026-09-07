package com.domux.app.data.remote.dto

data class CommonAreaDto(
    val id: String,
    val name: String,
    val description: String?,
    val openTime: String,
    val closeTime: String,
    val active: Boolean
)
