package com.domux.app.ui.gatekeeper.packages

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.domux.app.common.ApiResult
import com.domux.app.common.ServiceLocator
import com.domux.app.common.UiState
import com.domux.app.common.toListUiState
import com.domux.app.data.remote.dto.PackageDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class GatekeeperPackagesViewModel : ViewModel() {
    private val repository = ServiceLocator.packagesRepository

    private val _state = MutableStateFlow<UiState<List<PackageDto>>>(UiState.Loading)
    val state: StateFlow<UiState<List<PackageDto>>> = _state.asStateFlow()

    private val _actionError = MutableStateFlow<String?>(null)
    val actionError: StateFlow<String?> = _actionError.asStateFlow()

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = repository.listPackages().toListUiState()
        }
    }

    fun register(unitCode: String, recipient: String, onDone: () -> Unit) {
        viewModelScope.launch {
            when (val result = repository.registerPackage(unitCode, recipient)) {
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

    fun markDelivered(packageId: String) {
        viewModelScope.launch {
            when (val result = repository.markDelivered(packageId)) {
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
