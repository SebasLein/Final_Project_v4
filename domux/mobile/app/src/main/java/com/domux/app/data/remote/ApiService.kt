package com.domux.app.data.remote

import com.domux.app.data.remote.dto.*
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // --- Auth ---
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("auth/refresh")
    suspend fun refresh(@Body request: RefreshRequest): RefreshResponse

    // --- Visitantes ---
    @GET("visitors")
    suspend fun listVisitors(@Query("status") status: String? = null): List<VisitorDto>

    @POST("visitors/authorize")
    suspend fun authorizeVisitor(@Body request: AuthorizeVisitorRequest): VisitorDto

    @PATCH("visitors/{id}/cancel")
    suspend fun cancelVisitor(@Path("id") id: String): VisitorDto

    @POST("visitors/manual")
    suspend fun registerVisitorManually(@Body request: RegisterVisitorManuallyRequest): VisitorDto

    @PATCH("visitors/{id}/entry")
    suspend fun registerVisitorEntry(@Path("id") id: String): VisitorDto

    @PATCH("visitors/{id}/exit")
    suspend fun registerVisitorExit(@Path("id") id: String): VisitorDto

    // --- Paquetes ---
    @GET("packages")
    suspend fun listPackages(@Query("status") status: String? = null): List<PackageDto>

    @POST("packages")
    suspend fun registerPackage(@Body request: RegisterPackageRequest): PackageDto

    @PATCH("packages/{id}/deliver")
    suspend fun markPackageDelivered(@Path("id") id: String): PackageDto

    // --- Zonas comunes y reservas ---
    @GET("common-areas")
    suspend fun listCommonAreas(): List<CommonAreaDto>

    @GET("reservations")
    suspend fun listReservations(
        @Query("commonAreaId") commonAreaId: String? = null,
        @Query("date") date: String? = null
    ): List<ReservationDto>

    @POST("reservations")
    suspend fun createReservation(@Body request: CreateReservationRequest): ReservationDto

    @PATCH("reservations/{id}/cancel")
    suspend fun cancelReservation(@Path("id") id: String): ReservationDto

    // --- Comunicados ---
    @GET("notices")
    suspend fun listNotices(): List<NoticeDto>
}
