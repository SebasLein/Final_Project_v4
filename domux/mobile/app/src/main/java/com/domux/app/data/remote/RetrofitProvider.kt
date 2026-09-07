package com.domux.app.data.remote

import com.domux.app.BuildConfig
import com.domux.app.data.session.SessionManager
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitProvider {

    fun create(sessionManager: SessionManager): ApiService {
        val logging = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BASIC else HttpLoggingInterceptor.Level.NONE
        }

        // Cliente sin Authenticator, usado únicamente para llamar /auth/refresh
        // desde dentro del Authenticator principal (evita recursión infinita).
        val plainClient = OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()
        val refreshApi = buildRetrofit(plainClient).create(ApiService::class.java)

        val mainClient = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(sessionManager))
            .addInterceptor(logging)
            .authenticator(TokenAuthenticator(sessionManager, refreshApi))
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()

        return buildRetrofit(mainClient).create(ApiService::class.java)
    }

    private fun buildRetrofit(client: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
}
