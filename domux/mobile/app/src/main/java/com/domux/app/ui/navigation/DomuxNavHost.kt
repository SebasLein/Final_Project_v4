package com.domux.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.domux.app.ui.gatekeeper.home.GatekeeperHomeScreen
import com.domux.app.ui.gatekeeper.packages.GatekeeperPackagesScreen
import com.domux.app.ui.gatekeeper.visitors.GatekeeperVisitorsScreen
import com.domux.app.ui.login.LoginScreen
import com.domux.app.ui.resident.home.ResidentHomeScreen
import com.domux.app.ui.resident.packages.ResidentPackagesScreen
import com.domux.app.ui.resident.reservations.ReservationsScreen
import com.domux.app.ui.resident.visitors.ResidentVisitorsScreen
import com.domux.app.ui.shared.notices.NoticesScreen
import com.domux.app.ui.shared.profile.ProfileScreen

object Routes {
    const val LOGIN = "login"

    const val RESIDENT_HOME = "resident_home"
    const val RESIDENT_VISITORS = "resident_visitors"
    const val RESIDENT_PACKAGES = "resident_packages"
    const val RESIDENT_RESERVATIONS = "resident_reservations"
    const val RESIDENT_NOTICES = "resident_notices"
    const val RESIDENT_PROFILE = "resident_profile"

    const val GATEKEEPER_HOME = "gatekeeper_home"
    const val GATEKEEPER_VISITORS = "gatekeeper_visitors"
    const val GATEKEEPER_PACKAGES = "gatekeeper_packages"
    const val GATEKEEPER_NOTICES = "gatekeeper_notices"
    const val GATEKEEPER_PROFILE = "gatekeeper_profile"
}

private data class BottomItem(val route: String, val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)

private val RESIDENT_ITEMS = listOf(
    BottomItem(Routes.RESIDENT_HOME, "Inicio", Icons.Filled.Home),
    BottomItem(Routes.RESIDENT_VISITORS, "Visitantes", Icons.Filled.People),
    BottomItem(Routes.RESIDENT_PACKAGES, "Paquetes", Icons.Filled.Inventory2),
    BottomItem(Routes.RESIDENT_RESERVATIONS, "Reservas", Icons.Filled.EventAvailable),
    BottomItem(Routes.RESIDENT_NOTICES, "Avisos", Icons.Filled.Campaign),
    BottomItem(Routes.RESIDENT_PROFILE, "Perfil", Icons.Filled.Person)
)

private val GATEKEEPER_ITEMS = listOf(
    BottomItem(Routes.GATEKEEPER_HOME, "Inicio", Icons.Filled.Home),
    BottomItem(Routes.GATEKEEPER_VISITORS, "Visitantes", Icons.Filled.People),
    BottomItem(Routes.GATEKEEPER_PACKAGES, "Paquetes", Icons.Filled.Inventory2),
    BottomItem(Routes.GATEKEEPER_NOTICES, "Avisos", Icons.Filled.Campaign),
    BottomItem(Routes.GATEKEEPER_PROFILE, "Perfil", Icons.Filled.Person)
)

@Composable
fun DomuxNavHost(startDestination: String) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    val bottomItems = when {
        currentRoute?.startsWith("resident_") == true -> RESIDENT_ITEMS
        currentRoute?.startsWith("gatekeeper_") == true -> GATEKEEPER_ITEMS
        else -> null
    }

    fun goToLogin() {
        navController.navigate(Routes.LOGIN) {
            popUpTo(0) { inclusive = true }
        }
    }

    Scaffold(
        bottomBar = {
            if (bottomItems != null) {
                NavigationBar {
                    bottomItems.forEach { item ->
                        NavigationBarItem(
                            selected = currentRoute == item.route,
                            onClick = {
                                navController.navigate(item.route) {
                                    popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = { Icon(item.icon, contentDescription = item.label) },
                            label = { Text(item.label) }
                        )
                    }
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = androidx.compose.ui.Modifier.padding(padding)
        ) {
            composable(Routes.LOGIN) {
                LoginScreen(onLoginSuccess = { role ->
                    val destination = if (role == "RESIDENT") Routes.RESIDENT_HOME else Routes.GATEKEEPER_HOME
                    navController.navigate(destination) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                })
            }

            // --- RESIDENT ---
            composable(Routes.RESIDENT_HOME) { ResidentHomeScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.RESIDENT_VISITORS) { ResidentVisitorsScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.RESIDENT_PACKAGES) { ResidentPackagesScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.RESIDENT_RESERVATIONS) { ReservationsScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.RESIDENT_NOTICES) { NoticesScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.RESIDENT_PROFILE) { ProfileScreen(onLoggedOut = ::goToLogin) }

            // --- GATEKEEPER ---
            composable(Routes.GATEKEEPER_HOME) { GatekeeperHomeScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.GATEKEEPER_VISITORS) { GatekeeperVisitorsScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.GATEKEEPER_PACKAGES) { GatekeeperPackagesScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.GATEKEEPER_NOTICES) { NoticesScreen(onSessionExpired = ::goToLogin) }
            composable(Routes.GATEKEEPER_PROFILE) { ProfileScreen(onLoggedOut = ::goToLogin) }
        }
    }
}
