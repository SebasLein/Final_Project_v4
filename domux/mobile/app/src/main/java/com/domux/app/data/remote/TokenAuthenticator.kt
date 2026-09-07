package com.domux.app.data.remote

import com.domux.app.data.remote.dto.RefreshRequest
import com.domux.app.data.session.SessionManager
import kotlinx.coroutines.runBlocking
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

/**
 * Intenta refrescar el access token exactamente una vez cuando el backend responde 401.
 * Si el refresh también falla, limpia la sesión y deja que el 401 se propague:
 * el repositorio lo traduce a ApiResult.SessionExpired y la UI redirige a login.
 */
class TokenAuthenticator(
    private val sessionManager: SessionManager,
    private val refreshApi: ApiService
) : Authenticator {

    override fun authenticate(route: Route?, response: Response): Request? {
        // Evita loops infinitos: si ya reintentamos una vez, nos rendimos.
        if (responseCount(response) >= 2) return null

        val refreshToken = runBlocking { sessionManager.getRefreshToken() } ?: return null

        return runBlocking {
            try {
                val result = refreshApi.refresh(RefreshRequest(refreshToken))
                sessionManager.updateAccessToken(result.accessToken)
                response.request.newBuilder()
                    .header("Authorization", "Bearer ${result.accessToken}")
                    .build()
            } catch (e: Exception) {
                sessionManager.clear()
                null
            }
        }
    }

    private fun responseCount(response: Response): Int {
        var count = 1
        var prior = response.priorResponse
        while (prior != null) {
            count++
            prior = prior.priorResponse
        }
        return count
    }
}
