package com.domux.app.common

import com.google.gson.Gson
import retrofit2.HttpException
import java.io.IOException

/** Resultado de una llamada de repositorio hacia la API. */
sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class Error(val message: String) : ApiResult<Nothing>()
    /** El access token expiró y el refresh también falló: hay que forzar login. */
    object SessionExpired : ApiResult<Nothing>()
}

private data class ApiErrorBody(val message: String?)

/** Ejecuta [block] y traduce cualquier excepción a un [ApiResult] legible para el usuario. */
suspend fun <T> safeApiCall(block: suspend () -> T): ApiResult<T> {
    return try {
        ApiResult.Success(block())
    } catch (e: HttpException) {
        if (e.code() == 401) {
            ApiResult.SessionExpired
        } else {
            val message = parseErrorMessage(e) ?: defaultMessageForCode(e.code())
            ApiResult.Error(message)
        }
    } catch (e: IOException) {
        ApiResult.Error("Sin conexión a internet. Verifica tu red e inténtalo de nuevo.")
    } catch (e: IllegalArgumentException) {
        ApiResult.Error(e.message ?: "Datos inválidos.")
    } catch (e: Exception) {
        ApiResult.Error("Ocurrió un error inesperado. Inténtalo de nuevo.")
    }
}

private fun parseErrorMessage(e: HttpException): String? {
    return try {
        val body = e.response()?.errorBody()?.string() ?: return null
        Gson().fromJson(body, ApiErrorBody::class.java)?.message
    } catch (_: Exception) {
        null
    }
}

private fun defaultMessageForCode(code: Int): String = when (code) {
    403 -> "No tienes permisos para realizar esta acción."
    404 -> "No se encontró el recurso solicitado."
    409 -> "La operación entra en conflicto con el estado actual."
    in 500..599 -> "El servidor de DOMUX tuvo un problema. Inténtalo más tarde."
    else -> "No se pudo completar la operación."
}

/**
 * Comprueba si alguno de varios ApiResult (de tipos genéricos distintos) es SessionExpired,
 * sin depender de que Kotlin infiera un supertipo común al mezclarlos en un listOf(...).
 */
fun anySessionExpired(vararg results: ApiResult<*>): Boolean = results.any { it is ApiResult.SessionExpired }
