package com.domux.app.ui.resident.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.domux.app.common.ApiResult
import com.domux.app.common.ServiceLocator
import com.domux.app.common.UiState
import com.domux.app.common.anySessionExpired
import com.domux.app.data.remote.dto.NoticeDto
import com.domux.app.data.remote.dto.PackageDto
import com.domux.app.data.remote.dto.ReservationDto
import com.domux.app.data.remote.dto.VisitorDto
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ResidentHomeSummary(
    val authorizedVisitors: Int,
    val pendingPackages: Int,
    val upcomingReservations: List<ReservationDto>,
    val recentNotices: List<NoticeDto>
)

class ResidentHomeViewModel : ViewModel() {
    private val visitorsRepository = ServiceLocator.visitorsRepository
    private val packagesRepository = ServiceLocator.packagesRepository
    private val reservationsRepository = ServiceLocator.reservationsRepository
    private val noticesRepository = ServiceLocator.noticesRepository

    private val _state = MutableStateFlow<UiState<ResidentHomeSummary>>(UiState.Loading)
    val state: StateFlow<UiState<ResidentHomeSummary>> = _state.asStateFlow()

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            coroutineScope {
                val visitorsDeferred = async { visitorsRepository.listVisitors("AUTHORIZED") }
                val packagesDeferred = async { packagesRepository.listPackages("PENDING") }
                val reservationsDeferred = async { reservationsRepository.listReservations() }
                val noticesDeferred = async { noticesRepository.listNotices() }

                val visitors = visitorsDeferred.await()
                val packages = packagesDeferred.await()
                val reservations = reservationsDeferred.await()
                val notices = noticesDeferred.await()

                // Si cualquier llamada indica sesión expirada, se propaga de inmediato.
                if (anySessionExpired(visitors, packages, reservations, notices)) {
                    _state.value = UiState.SessionExpired
                    return@coroutineScope
                }

                val visitorsList = (visitors as? ApiResult.Success)?.data ?: emptyList<VisitorDto>()
                val packagesList = (packages as? ApiResult.Success)?.data ?: emptyList<PackageDto>()
                val reservationsList = (reservations as? ApiResult.Success)?.data ?: emptyList<ReservationDto>()
                val noticesList = (notices as? ApiResult.Success)?.data ?: emptyList<NoticeDto>()

                _state.value = UiState.Success(
                    ResidentHomeSummary(
                        authorizedVisitors = visitorsList.size,
                        pendingPackages = packagesList.size,
                        upcomingReservations = reservationsList.filter { it.status == "ACTIVE" }.take(3),
                        recentNotices = noticesList.take(3)
                    )
                )
            }
        }
    }
}
