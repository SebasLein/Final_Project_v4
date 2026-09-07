package com.domux.app.data.repository

import com.domux.app.common.ApiResult
import com.domux.app.common.safeApiCall
import com.domux.app.data.remote.ApiService
import com.domux.app.data.remote.dto.AuthorizeVisitorRequest
import com.domux.app.data.remote.dto.RegisterVisitorManuallyRequest
import com.domux.app.data.remote.dto.VisitorDto

class VisitorsRepository(private val api: ApiService) {

    suspend fun listVisitors(status: String? = null): ApiResult<List<VisitorDto>> = safeApiCall {
        api.listVisitors(status)
    }

    suspend fun authorizeVisitor(fullName: String, documentId: String, type: String): ApiResult<VisitorDto> =
        safeApiCall { api.authorizeVisitor(AuthorizeVisitorRequest(fullName, documentId, type)) }

    suspend fun cancelVisitor(id: String): ApiResult<VisitorDto> = safeApiCall { api.cancelVisitor(id) }

    suspend fun registerManually(fullName: String, documentId: String, type: String, unitCode: String): ApiResult<VisitorDto> =
        safeApiCall { api.registerVisitorManually(RegisterVisitorManuallyRequest(fullName, documentId, type, unitCode)) }

    suspend fun registerEntry(id: String): ApiResult<VisitorDto> = safeApiCall { api.registerVisitorEntry(id) }

    suspend fun registerExit(id: String): ApiResult<VisitorDto> = safeApiCall { api.registerVisitorExit(id) }
}
