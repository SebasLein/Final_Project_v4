package com.domux.app.ui.gatekeeper.packages

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.domux.app.data.remote.dto.PackageDto
import com.domux.app.ui.shared.ChipTone
import com.domux.app.ui.shared.SectionCard
import com.domux.app.ui.shared.StateContent
import com.domux.app.ui.shared.StatusChip

@Composable
fun GatekeeperPackagesScreen(
    onSessionExpired: () -> Unit,
    viewModel: GatekeeperPackagesViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val actionError by viewModel.actionError.collectAsState()
    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { showDialog = true }) {
                Icon(Icons.Filled.Add, contentDescription = "Registrar paquete")
            }
        }
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            StateContent(state, "No hay paquetes registrados.", onSessionExpired) { packages ->
                LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(packages) { pkg ->
                        GatekeeperPackageRow(pkg, onDeliver = { viewModel.markDelivered(pkg.id) })
                    }
                }
            }
        }
    }

    if (showDialog) {
        RegisterPackageDialog(
            errorMessage = actionError,
            onDismiss = {
                showDialog = false
                viewModel.dismissActionError()
            },
            onConfirm = { unitCode, recipient ->
                viewModel.register(unitCode, recipient) { showDialog = false }
            }
        )
    }
}

@Composable
private fun GatekeeperPackageRow(pkg: PackageDto, onDeliver: () -> Unit) {
    SectionCard(title = pkg.recipient) {
        Text("Unidad: ${pkg.unit?.code ?: "—"}", style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            StatusChip(
                if (pkg.status == "DELIVERED") "Entregado" else "Pendiente",
                if (pkg.status == "DELIVERED") ChipTone.Success else ChipTone.Warning
            )
            if (pkg.status == "PENDING") {
                Button(onClick = onDeliver) { Text("Marcar entregado") }
            }
        }
    }
}

@Composable
private fun RegisterPackageDialog(
    errorMessage: String?,
    onDismiss: () -> Unit,
    onConfirm: (unitCode: String, recipient: String) -> Unit
) {
    var unitCode by remember { mutableStateOf("") }
    var recipient by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Registrar paquete") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = unitCode, onValueChange = { unitCode = it }, label = { Text("Código de unidad (ej. T1-101)") }, singleLine = true)
                OutlinedTextField(value = recipient, onValueChange = { recipient = it }, label = { Text("Destinatario") }, singleLine = true)
                if (errorMessage != null) {
                    Text(errorMessage, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = { if (unitCode.isNotBlank() && recipient.isNotBlank()) onConfirm(unitCode, recipient) }
            ) { Text("Registrar") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancelar") } }
    )
}
