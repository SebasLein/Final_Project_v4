package com.domux.app.ui.gatekeeper.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.domux.app.common.ApiResult
import com.domux.app.common.ServiceLocator
import com.domux.app.common.UiState
import com.domux.app.common.anySessionExpired
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class GatekeeperHomeSummary(
    val awaitingEntry: Int,
    val currentlyInside: Int,
    val pendingPackages: Int
)

class GatekeeperHomeViewModel : ViewModel() {
    private val visitorsRepository = ServiceLocator.visitorsRepository
    private val packagesRepository = ServiceLocator.packagesRepository

    private val _state = MutableStateFlow<UiState<GatekeeperHomeSummary>>(UiState.Loading)
    val state: StateFlow<UiState<GatekeeperHomeSummary>> = _state.asStateFlow()

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            coroutineScope {
                val authorizedDeferred = async { visitorsRepository.listVisitors("AUTHORIZED") }
                val enteredDeferred = async { visitorsRepository.listVisitors("ENTERED") }
                val pendingPackagesDeferred = async { packagesRepository.listPackages("PENDING") }

                val authorized = authorizedDeferred.await()
                val entered = enteredDeferred.await()
                val pendingPackages = pendingPackagesDeferred.await()

                if (anySessionExpired(authorized, entered, pendingPackages)) {
                    _state.value = UiState.SessionExpired
                    return@coroutineScope
                }

                _state.value = UiState.Success(
                    GatekeeperHomeSummary(
                        awaitingEntry = (authorized as? ApiResult.Success)?.data?.size ?: 0,
                        currentlyInside = (entered as? ApiResult.Success)?.data?.size ?: 0,
                        pendingPackages = (pendingPackages as? ApiResult.Success)?.data?.size ?: 0
                    )
                )
            }
        }
    }
}
