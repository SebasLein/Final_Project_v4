package com.domux.app.ui.shared.notices

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.domux.app.common.ServiceLocator
import com.domux.app.common.UiState
import com.domux.app.common.toListUiState
import com.domux.app.data.remote.dto.NoticeDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class NoticesViewModel : ViewModel() {
    private val repository = ServiceLocator.noticesRepository

    private val _state = MutableStateFlow<UiState<List<NoticeDto>>>(UiState.Loading)
    val state: StateFlow<UiState<List<NoticeDto>>> = _state.asStateFlow()

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = repository.listNotices().toListUiState()
        }
    }
}
