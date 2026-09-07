package com.domux.app.ui.resident.reservations

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.domux.app.common.ApiResult
import com.domux.app.common.ServiceLocator
import com.domux.app.common.UiState
import com.domux.app.common.toListUiState
import com.domux.app.data.remote.dto.CommonAreaDto
import com.domux.app.data.remote.dto.ReservationDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ReservationsViewModel : ViewModel() {
    private val repository = ServiceLocator.reservationsRepository

    private val _state = MutableStateFlow<UiState<List<ReservationDto>>>(UiState.Loading)
    val state: StateFlow<UiState<List<ReservationDto>>> = _state.asStateFlow()

    private val _commonAreas = MutableStateFlow<List<CommonAreaDto>>(emptyList())
    val commonAreas: StateFlow<List<CommonAreaDto>> = _commonAreas.asStateFlow()

    private val _actionError = MutableStateFlow<String?>(null)
    val actionError: StateFlow<String?> = _actionError.asStateFlow()

    init {
        loadAreas()
        load()
    }

    private fun loadAreas() {
        viewModelScope.launch {
            when (val result = repository.listCommonAreas()) {
                is ApiResult.Success -> _commonAreas.value = result.data.filter { it.active }
                else -> Unit // el error de reservas ya se muestra; esto es secundario para el formulario
            }
        }
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = repository.listReservations().toListUiState()
        }
    }

    fun createReservation(commonAreaId: String, date: String, startTime: String, endTime: String, onDone: () -> Unit) {
        viewModelScope.launch {
            when (val result = repository.createReservation(commonAreaId, date, startTime, endTime)) {
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

    fun cancelReservation(id: String) {
        viewModelScope.launch {
            when (val result = repository.cancelReservation(id)) {
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
