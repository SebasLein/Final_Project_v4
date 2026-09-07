package com.domux.app.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.domux.app.common.ApiResult
import com.domux.app.common.ServiceLocator
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class LoginUiState(
    val loading: Boolean = false,
    val error: String? = null,
    val loggedInRole: String? = null
)

class LoginViewModel : ViewModel() {
    private val authRepository = ServiceLocator.authRepository

    private val _state = MutableStateFlow(LoginUiState())
    val state: StateFlow<LoginUiState> = _state.asStateFlow()

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _state.value = _state.value.copy(error = "Ingresa correo y contraseña.")
            return
        }
        _state.value = _state.value.copy(loading = true, error = null)
        viewModelScope.launch {
            when (val result = authRepository.login(email.trim(), password)) {
                is ApiResult.Success -> _state.value = LoginUiState(loading = false, loggedInRole = result.data.role)
                is ApiResult.Error -> _state.value = LoginUiState(loading = false, error = result.message)
                ApiResult.SessionExpired -> _state.value = LoginUiState(loading = false, error = "Credenciales inválidas.")
            }
        }
    }

    fun consumeNavigation() {
        _state.value = _state.value.copy(loggedInRole = null)
    }
}
