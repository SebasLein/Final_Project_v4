package com.domux.app.data.remote

import com.domux.app.data.session.SessionManager
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val sessionManager: SessionManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val path = original.url.encodedPath
        if (path.contains("auth/login") || path.contains("auth/refresh")) {
            return chain.proceed(original)
        }

        val token = runBlocking { sessionManager.getAccessToken() }
        val request = if (token != null) {
            original.newBuilder().addHeader("Authorization", "Bearer $token").build()
        } else {
            original
        }
        return chain.proceed(request)
    }
}
