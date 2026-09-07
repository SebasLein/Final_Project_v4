package com.domux.app.ui.resident.visitors

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.domux.app.data.remote.dto.VisitorDto
import com.domux.app.ui.shared.ChipTone
import com.domux.app.ui.shared.SectionCard
import com.domux.app.ui.shared.StateContent
import com.domux.app.ui.shared.StatusChip

private fun toneFor(status: String) = when (status) {
    "AUTHORIZED" -> ChipTone.Warning
    "ENTERED" -> ChipTone.Success
    "EXITED" -> ChipTone.Default
    "CANCELLED" -> ChipTone.Danger
    else -> ChipTone.Default
}

private fun labelFor(status: String) = when (status) {
    "AUTHORIZED" -> "Autorizado"
    "ENTERED" -> "Ingresó"
    "EXITED" -> "Salió"
    "CANCELLED" -> "Cancelado"
    else -> status
}

@Composable
fun ResidentVisitorsScreen(
    onSessionExpired: () -> Unit,
    viewModel: ResidentVisitorsViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val actionError by viewModel.actionError.collectAsState()
    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { showDialog = true }) {
                Icon(Icons.Filled.Add, contentDescription = "Autorizar visitante")
            }
        }
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            StateContent(state, "No has autorizado visitantes todavía.", onSessionExpired) { visitors ->
                LazyColumn(
                    Modifier.fillMaxSize().padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(visitors) { visitor -> VisitorRow(visitor, onCancel = { viewModel.cancel(visitor.id) }) }
                }
            }
        }
    }

    if (showDialog) {
        AuthorizeVisitorDialog(
            errorMessage = actionError,
            onDismiss = {
                showDialog = false
                viewModel.dismissActionError()
            },
            onConfirm = { name, doc, type ->
                viewModel.authorize(name, doc, type) { showDialog = false }
            }
        )
    }
}

@Composable
private fun VisitorRow(visitor: VisitorDto, onCancel: () -> Unit) {
    SectionCard(title = visitor.fullName) {
        Text("Documento: ${visitor.documentId}", style = MaterialTheme.typography.bodySmall)
        Text("Tipo: ${visitor.type}", style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            StatusChip(labelFor(visitor.status), toneFor(visitor.status))
            if (visitor.status == "AUTHORIZED") {
                TextButton(onClick = onCancel) { Text("Cancelar") }
            }
        }
    }
}

@Composable
private fun AuthorizeVisitorDialog(
    errorMessage: String?,
    onDismiss: () -> Unit,
    onConfirm: (fullName: String, documentId: String, type: String) -> Unit
) {
    var fullName by remember { mutableStateOf("") }
    var documentId by remember { mutableStateOf("") }
    var type by remember { mutableStateOf("VISITOR") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Autorizar visitante") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = fullName, onValueChange = { fullName = it }, label = { Text("Nombre completo") }, singleLine = true)
                OutlinedTextField(value = documentId, onValueChange = { documentId = it }, label = { Text("Documento") }, singleLine = true)
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
                onClick = { if (fullName.isNotBlank() && documentId.isNotBlank()) onConfirm(fullName, documentId, type) }
            ) { Text("Autorizar") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancelar") } }
    )
}
