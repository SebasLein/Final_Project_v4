package com.domux.app.ui.resident.packages

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.domux.app.common.ServiceLocator
import com.domux.app.common.UiState
import com.domux.app.common.toListUiState
import com.domux.app.data.remote.dto.PackageDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ResidentPackagesViewModel : ViewModel() {
    private val repository = ServiceLocator.packagesRepository

    private val _state = MutableStateFlow<UiState<List<PackageDto>>>(UiState.Loading)
    val state: StateFlow<UiState<List<PackageDto>>> = _state.asStateFlow()

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = repository.listPackages().toListUiState()
        }
    }
}
