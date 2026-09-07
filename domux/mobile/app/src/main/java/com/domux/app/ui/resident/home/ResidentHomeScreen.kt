package com.domux.app.ui.resident.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.domux.app.ui.shared.SectionCard
import com.domux.app.ui.shared.StateContent

@Composable
fun ResidentHomeScreen(
    onSessionExpired: () -> Unit,
    viewModel: ResidentHomeViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()

    StateContent(state, "No hay información para mostrar todavía.", onSessionExpired) { summary ->
        Column(
            Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text("Inicio", style = MaterialTheme.typography.headlineSmall)

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                SummaryStat("Visitantes autorizados", summary.authorizedVisitors, Modifier.weight(1f))
                SummaryStat("Paquetes pendientes", summary.pendingPackages, Modifier.weight(1f))
            }

            SectionCard(title = "Próximas reservas") {
                if (summary.upcomingReservations.isEmpty()) {
                    Text("No tienes reservas activas.", style = MaterialTheme.typography.bodySmall)
                } else {
                    summary.upcomingReservations.forEach { r ->
                        Text("${r.commonArea?.name ?: "Zona"} · ${r.date.take(10)} · ${r.startTime}-${r.endTime}")
                    }
                }
            }

            SectionCard(title = "Comunicados recientes") {
                if (summary.recentNotices.isEmpty()) {
                    Text("No hay comunicados recientes.", style = MaterialTheme.typography.bodySmall)
                } else {
                    summary.recentNotices.forEach { n -> Text("• ${n.title}") }
                }
            }
        }
    }
}

@Composable
private fun SummaryStat(label: String, value: Int, modifier: Modifier = Modifier) {
    SectionCard(title = label, modifier = modifier) {
        Text(value.toString(), style = MaterialTheme.typography.headlineMedium)
    }
}
