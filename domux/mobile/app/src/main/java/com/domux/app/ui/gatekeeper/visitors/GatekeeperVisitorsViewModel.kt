package com.domux.app.ui.gatekeeper.visitors

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.domux.app.common.ApiResult
import com.domux.app.common.ServiceLocator
import com.domux.app.common.UiState
import com.domux.app.common.toListUiState
import com.domux.app.data.remote.dto.VisitorDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class GatekeeperVisitorsViewModel : ViewModel() {
    private val repository = ServiceLocator.visitorsRepository

    private val _state = MutableStateFlow<UiState<List<VisitorDto>>>(UiState.Loading)
    val state: StateFlow<UiState<List<VisitorDto>>> = _state.asStateFlow()

    private val _actionError = MutableStateFlow<String?>(null)
    val actionError: StateFlow<String?> = _actionError.asStateFlow()

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            // Sin filtro: el service de GATEKEEPER ya devuelve AUTHORIZED + ENTERED por defecto.
            _state.value = repository.listVisitors().toListUiState()
        }
    }

    fun registerManually(fullName: String, documentId: String, type: String, unitCode: String, onDone: () -> Unit) {
        viewModelScope.launch {
            when (val result = repository.registerManually(fullName, documentId, type, unitCode)) {
                is ApiResult.Success -> {
                    _actionError.value = null
                    onDone()
                    load()
                }
                is ApiResult.Error -> _actionError.value = result.message
                ApiResult.SessionExpired -> _state.value = UiState.SessionExpired
            }
        }
    }

    fun registerEntry(visitorId: String) {
        viewModelScope.launch {
            when (val result = repository.registerEntry(visitorId)) {
                is ApiResult.Success -> load()
                is ApiResult.Error -> _actionError.value = result.message
                ApiResult.SessionExpired -> _state.value = UiState.SessionExpired
            }
        }
    }

    fun registerExit(visitorId: String) {
        viewModelScope.launch {
            when (val result = repository.registerExit(visitorId)) {
                is ApiResult.Success -> load()
                is ApiResult.Error -> _actionError.value = result.message
                ApiResult.SessionExpired -> _state.value = UiState.SessionExpired
            }
        }
    }

    fun dismissActionError() {
        _actionError.value = null
    }
}
