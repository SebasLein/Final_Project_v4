package com.domux.app.data.repository

import com.domux.app.common.ApiResult
import com.domux.app.common.safeApiCall
import com.domux.app.data.remote.ApiService
import com.domux.app.data.remote.dto.NoticeDto

class NoticesRepository(private val api: ApiService) {
    suspend fun listNotices(): ApiResult<List<NoticeDto>> = safeApiCall { api.listNotices() }
}
