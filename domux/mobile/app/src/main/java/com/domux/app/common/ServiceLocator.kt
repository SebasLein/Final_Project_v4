package com.domux.app.common

import android.content.Context
import com.domux.app.data.remote.ApiService
import com.domux.app.data.remote.RetrofitProvider
import com.domux.app.data.repository.AuthRepository
import com.domux.app.data.repository.NoticesRepository
import com.domux.app.data.repository.PackagesRepository
import com.domux.app.data.repository.ReservationsRepository
import com.domux.app.data.repository.VisitorsRepository
import com.domux.app.data.session.SessionManager

/**
 * DI manual y explícito: para el alcance de DOMUX 1.0 no se justifica
 * introducir Hilt/Dagger. Se inicializa una única vez desde DomuxApplication.
 */
object ServiceLocator {
    lateinit var sessionManager: SessionManager
        private set
    private lateinit var apiService: ApiService

    lateinit var authRepository: AuthRepository
        private set
    lateinit var visitorsRepository: VisitorsRepository
        private set
    lateinit var packagesRepository: PackagesRepository
        private set
    lateinit var reservationsRepository: ReservationsRepository
        private set
    lateinit var noticesRepository: NoticesRepository
        private set

    fun init(context: Context) {
        sessionManager = SessionManager(context.applicationContext)
        apiService = RetrofitProvider.create(sessionManager)

        authRepository = AuthRepository(apiService, sessionManager)
        visitorsRepository = VisitorsRepository(apiService)
        packagesRepository = PackagesRepository(apiService)
        reservationsRepository = ReservationsRepository(apiService)
        noticesRepository = NoticesRepository(apiService)
    }
}
