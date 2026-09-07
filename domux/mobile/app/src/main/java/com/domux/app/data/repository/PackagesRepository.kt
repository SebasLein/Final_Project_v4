package com.domux.app.data.repository

import com.domux.app.common.ApiResult
import com.domux.app.common.safeApiCall
import com.domux.app.data.remote.ApiService
import com.domux.app.data.remote.dto.PackageDto
import com.domux.app.data.remote.dto.RegisterPackageRequest

class PackagesRepository(private val api: ApiService) {

    suspend fun listPackages(status: String? = null): ApiResult<List<PackageDto>> = safeApiCall {
        api.listPackages(status)
    }

    suspend fun registerPackage(unitCode: String, recipient: String): ApiResult<PackageDto> =
        safeApiCall { api.registerPackage(RegisterPackageRequest(unitCode, recipient)) }

    suspend fun markDelivered(id: String): ApiResult<PackageDto> = safeApiCall { api.markPackageDelivered(id) }
}
