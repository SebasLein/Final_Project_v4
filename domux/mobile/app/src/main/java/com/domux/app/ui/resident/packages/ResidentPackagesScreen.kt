package com.domux.app.ui.resident.packages

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.domux.app.data.remote.dto.PackageDto
import com.domux.app.ui.shared.ChipTone
import com.domux.app.ui.shared.SectionCard
import com.domux.app.ui.shared.StateContent
import com.domux.app.ui.shared.StatusChip

@Composable
fun ResidentPackagesScreen(
    onSessionExpired: () -> Unit,
    viewModel: ResidentPackagesViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()

    StateContent(state, "No tienes paquetes registrados.", onSessionExpired) { packages ->
        LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(packages) { pkg -> PackageRow(pkg) }
        }
    }
}

@Composable
private fun PackageRow(pkg: PackageDto) {
    SectionCard(title = pkg.recipient) {
        Spacer(Modifier.height(4.dp))
        StatusChip(
            if (pkg.status == "DELIVERED") "Entregado" else "Pendiente",
            if (pkg.status == "DELIVERED") ChipTone.Success else ChipTone.Warning
        )
    }
}
