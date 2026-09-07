package com.domux.app.data.session

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "domux_session")

data class SessionData(
    val accessToken: String,
    val refreshToken: String,
    val userId: String,
    val name: String,
    val email: String,
    val role: String, // "GATEKEEPER" o "RESIDENT" en esta app
    val tenantId: String?
)

/**
 * Guarda únicamente tokens y datos de perfil no sensibles.
 * NUNCA se almacena la contraseña del usuario en ningún punto de la app.
 */
class SessionManager(private val context: Context) {

    private object Keys {
        val ACCESS_TOKEN = stringPreferencesKey("access_token")
        val REFRESH_TOKEN = stringPreferencesKey("refresh_token")
        val USER_ID = stringPreferencesKey("user_id")
        val NAME = stringPreferencesKey("name")
        val EMAIL = stringPreferencesKey("email")
        val ROLE = stringPreferencesKey("role")
        val TENANT_ID = stringPreferencesKey("tenant_id")
    }

    val session: Flow<SessionData?> = context.dataStore.data.map { prefs ->
        val accessToken = prefs[Keys.ACCESS_TOKEN] ?: return@map null
        val refreshToken = prefs[Keys.REFRESH_TOKEN] ?: return@map null
        SessionData(
            accessToken = accessToken,
            refreshToken = refreshToken,
            userId = prefs[Keys.USER_ID] ?: "",
            name = prefs[Keys.NAME] ?: "",
            email = prefs[Keys.EMAIL] ?: "",
            role = prefs[Keys.ROLE] ?: "",
            tenantId = prefs[Keys.TENANT_ID]
        )
    }

    suspend fun currentSession(): SessionData? = session.first()

    suspend fun saveSession(data: SessionData) {
        context.dataStore.edit { prefs ->
            prefs[Keys.ACCESS_TOKEN] = data.accessToken
            prefs[Keys.REFRESH_TOKEN] = data.refreshToken
            prefs[Keys.USER_ID] = data.userId
            prefs[Keys.NAME] = data.name
            prefs[Keys.EMAIL] = data.email
            prefs[Keys.ROLE] = data.role
            data.tenantId?.let { prefs[Keys.TENANT_ID] = it }
        }
    }

    suspend fun updateAccessToken(accessToken: String) {
        context.dataStore.edit { prefs -> prefs[Keys.ACCESS_TOKEN] = accessToken }
    }

    suspend fun clear() {
        context.dataStore.edit { it.clear() }
    }

    suspend fun getAccessToken(): String? = currentSession()?.accessToken
    suspend fun getRefreshToken(): String? = currentSession()?.refreshToken
}
