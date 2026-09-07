package com.domux.app.ui.gatekeeper.home

import androidx.compose.foundation.layout.*
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
fun GatekeeperHomeScreen(
    onSessionExpired: () -> Unit,
    viewModel: GatekeeperHomeViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()

    StateContent(state, "No hay información para mostrar todavía.", onSessionExpired) { summary ->
        Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text("Inicio · Portería", style = MaterialTheme.typography.headlineSmall)
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                SectionCard(title = "Por ingresar", modifier = Modifier.weight(1f)) {
                    Text(summary.awaitingEntry.toString(), style = MaterialTheme.typography.headlineMedium)
                }
                SectionCard(title = "Dentro del conjunto", modifier = Modifier.weight(1f)) {
                    Text(summary.currentlyInside.toString(), style = MaterialTheme.typography.headlineMedium)
                }
            }
            SectionCard(title = "Paquetes pendientes") {
                Text(summary.pendingPackages.toString(), style = MaterialTheme.typography.headlineMedium)
            }
        }
    }
}
