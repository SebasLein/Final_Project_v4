package com.domux.app.common

/** Estado de UI genérico para pantallas que cargan una lista o un recurso. */
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    object Empty : UiState<Nothing>()
    data class Error(val message: String) : UiState<Nothing>()
    object SessionExpired : UiState<Nothing>()
}

/** Convierte un ApiResult en UiState, marcando "Empty" cuando la lista viene vacía. */
fun <T> ApiResult<List<T>>.toListUiState(): UiState<List<T>> = when (this) {
    is ApiResult.Success -> if (data.isEmpty()) UiState.Empty else UiState.Success(data)
    is ApiResult.Error -> UiState.Error(message)
    ApiResult.SessionExpired -> UiState.SessionExpired
}

fun <T> ApiResult<T>.toUiState(): UiState<T> = when (this) {
    is ApiResult.Success -> UiState.Success(data)
    is ApiResult.Error -> UiState.Error(message)
    ApiResult.SessionExpired -> UiState.SessionExpired
}
