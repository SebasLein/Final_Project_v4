package com.domux.app.data.repository

import com.domux.app.common.ApiResult
import com.domux.app.common.safeApiCall
import com.domux.app.data.remote.ApiService
import com.domux.app.data.remote.dto.CommonAreaDto
import com.domux.app.data.remote.dto.CreateReservationRequest
import com.domux.app.data.remote.dto.ReservationDto

class ReservationsRepository(private val api: ApiService) {

    suspend fun listCommonAreas(): ApiResult<List<CommonAreaDto>> = safeApiCall { api.listCommonAreas() }

    suspend fun listReservations(commonAreaId: String? = null, date: String? = null): ApiResult<List<ReservationDto>> =
        safeApiCall { api.listReservations(commonAreaId, date) }

    suspend fun createReservation(commonAreaId: String, date: String, startTime: String, endTime: String): ApiResult<ReservationDto> =
        safeApiCall { api.createReservation(CreateReservationRequest(commonAreaId, date, startTime, endTime)) }

    suspend fun cancelReservation(id: String): ApiResult<ReservationDto> = safeApiCall { api.cancelReservation(id) }
}
