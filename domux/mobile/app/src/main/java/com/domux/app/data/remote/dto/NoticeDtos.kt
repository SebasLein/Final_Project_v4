package com.domux.app.data.remote.dto

data class NoticeDto(
    val id: String,
    val title: String,
    val body: String,
    val active: Boolean,
    val publishedAt: String
)
