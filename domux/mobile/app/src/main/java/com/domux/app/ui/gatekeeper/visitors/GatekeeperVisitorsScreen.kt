package com.domux.app.ui.gatekeeper.visitors

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
import com.domux.app.data.remote.dto.VisitorDto
import com.domux.app.ui.shared.ChipTone
import com.domux.app.ui.shared.SectionCard
import com.domux.app.ui.shared.StateContent
import com.domux.app.ui.shared.StatusChip

@Composable
fun GatekeeperVisitorsScreen(
    onSessionExpired: () -> Unit,
    viewModel: GatekeeperVisitorsViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val actionError by viewModel.actionError.collectAsState()
    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { showDialog = true }) {
                Icon(Icons.Filled.Add, contentDescription = "Registrar visitante manual")
            }
        }
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            StateContent(state, "No hay visitantes autorizados ni dentro del conjunto.", onSessionExpired) { visitors ->
                LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(visitors) { visitor ->
                        GatekeeperVisitorRow(
                            visitor,
                            onEntry = { viewModel.registerEntry(visitor.id) },
                            onExit = { viewModel.registerExit(visitor.id) }
                        )
                    }
                }
            }
        }
    }

    if (showDialog) {
        ManualVisitorDialog(
            errorMessage = actionError,
            onDismiss = {
                showDialog = false
                viewModel.dismissActionError()
            },
            onConfirm = { name, doc, type, unitCode ->
                viewModel.registerManually(name, doc, type, unitCode) { showDialog = false }
            }
        )
    }
}

@Composable
private fun GatekeeperVisitorRow(visitor: VisitorDto, onEntry: () -> Unit, onExit: () -> Unit) {
    SectionCard(title = visitor.fullName) {
        Text("Unidad: ${visitor.unit?.code ?: "—"}", style = MaterialTheme.typography.bodySmall)
        Text("Documento: ${visitor.documentId} · ${visitor.type}", style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            StatusChip(
                if (visitor.status == "AUTHORIZED") "Autorizado" else "Dentro",
                if (visitor.status == "AUTHORIZED") ChipTone.Warning else ChipTone.Success
            )
            when (visitor.status) {
                "AUTHORIZED" -> Button(onClick = onEntry) { Text("Registrar entrada") }
                "ENTERED" -> Button(onClick = onExit) { Text("Registrar salida") }
            }
        }
    }
}

@Composable
private fun ManualVisitorDialog(
    errorMessage: String?,
    onDismiss: () -> Unit,
    onConfirm: (fullName: String, documentId: String, type: String, unitCode: String) -> Unit
) {
    var fullName by remember { mutableStateOf("") }
    var documentId by remember { mutableStateOf("") }
    var unitCode by remember { mutableStateOf("") }
    var type by remember { mutableStateOf("VISITOR") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Registro manual de visitante") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = fullName, onValueChange = { fullName = it }, label = { Text("Nombre completo") }, singleLine = true)
                OutlinedTextField(value = documentId, onValueChange = { documentId = it }, label = { Text("Documento") }, singleLine = true)
                OutlinedTextField(value = unitCode, onValueChange = { unitCode = it }, label = { Text("Código de unidad (ej. T1-101)") }, singleLine = true)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("VISITOR" to "Visita", "DELIVERY" to "Domicilio", "TECHNICIAN" to "Técnico").forEach { (value, label) ->
                        FilterChip(selected = type == value, onClick = { type = value }, label = { Text(label) })
                    }
                }
                if (errorMessage != null) {
                    Text(errorMessage, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    if (fullName.isNotBlank() && documentId.isNotBlank() && unitCode.isNotBlank()) {
                        onConfirm(fullName, documentId, type, unitCode)
                    }
                }
            ) { Text("Registrar") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancelar") } }
    )
}
