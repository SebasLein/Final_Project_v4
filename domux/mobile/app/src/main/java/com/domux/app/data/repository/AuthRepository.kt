package com.domux.app.data.repository

import com.domux.app.common.ApiResult
import com.domux.app.common.safeApiCall
import com.domux.app.data.remote.ApiService
import com.domux.app.data.remote.dto.LoginRequest
import com.domux.app.data.session.SessionData
import com.domux.app.data.session.SessionManager
import kotlinx.coroutines.flow.Flow

class AuthRepository(
    private val api: ApiService,
    private val sessionManager: SessionManager
) {
    val session: Flow<SessionData?> = sessionManager.session

    suspend fun login(email: String, password: String): ApiResult<SessionData> = safeApiCall {
        val response = api.login(LoginRequest(email, password))
        val role = response.user.role
        require(role == "RESIDENT" || role == "GATEKEEPER") {
            "Esta aplicación es solo para Residentes y Portería. Usa el panel web de DOMUX para tu rol."
        }
        val session = SessionData(
            accessToken = response.accessToken,
            refreshToken = response.refreshToken,
            userId = response.user.id,
            name = response.user.name,
            email = response.user.email,
            role = role,
            tenantId = response.user.tenantId
        )
        sessionManager.saveSession(session)
        session
    }

    suspend fun logout() {
        sessionManager.clear()
    }
}
