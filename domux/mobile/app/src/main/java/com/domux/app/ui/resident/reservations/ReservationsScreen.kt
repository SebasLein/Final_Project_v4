package com.domux.app.ui.resident.reservations

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
import com.domux.app.data.remote.dto.CommonAreaDto
import com.domux.app.data.remote.dto.ReservationDto
import com.domux.app.ui.shared.ChipTone
import com.domux.app.ui.shared.SectionCard
import com.domux.app.ui.shared.StateContent
import com.domux.app.ui.shared.StatusChip

@Composable
fun ReservationsScreen(
    onSessionExpired: () -> Unit,
    viewModel: ReservationsViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val commonAreas by viewModel.commonAreas.collectAsState()
    val actionError by viewModel.actionError.collectAsState()
    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { showDialog = true }) {
                Icon(Icons.Filled.Add, contentDescription = "Nueva reserva")
            }
        }
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            StateContent(state, "No tienes reservas todavía.", onSessionExpired) { reservations ->
                LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(reservations) { reservation ->
                        ReservationRow(reservation, onCancel = { viewModel.cancelReservation(reservation.id) })
                    }
                }
            }
        }
    }

    if (showDialog) {
        CreateReservationDialog(
            areas = commonAreas,
            errorMessage = actionError,
            onDismiss = {
                showDialog = false
                viewModel.dismissActionError()
            },
            onConfirm = { areaId, date, start, end ->
                viewModel.createReservation(areaId, date, start, end) { showDialog = false }
            }
        )
    }
}

@Composable
private fun ReservationRow(reservation: ReservationDto, onCancel: () -> Unit) {
    SectionCard(title = reservation.commonArea?.name ?: "Zona común") {
        Text("Fecha: ${reservation.date.take(10)}")
        Text("Horario: ${reservation.startTime} - ${reservation.endTime}")
        Spacer(Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            StatusChip(
                if (reservation.status == "ACTIVE") "Activa" else "Cancelada",
                if (reservation.status == "ACTIVE") ChipTone.Success else ChipTone.Danger
            )
            if (reservation.status == "ACTIVE") {
                TextButton(onClick = onCancel) { Text("Cancelar") }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CreateReservationDialog(
    areas: List<CommonAreaDto>,
    errorMessage: String?,
    onDismiss: () -> Unit,
    onConfirm: (commonAreaId: String, date: String, startTime: String, endTime: String) -> Unit
) {
    var selectedArea by remember { mutableStateOf(areas.firstOrNull()) }
    var date by remember { mutableStateOf("") }
    var startTime by remember { mutableStateOf("") }
    var endTime by remember { mutableStateOf("") }
    var expanded by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Nueva reserva") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                if (areas.isEmpty()) {
                    Text("No hay zonas comunes activas en este momento.", style = MaterialTheme.typography.bodySmall)
                } else {
                    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }) {
                        OutlinedTextField(
                            value = selectedArea?.name ?: "",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Zona común") },
                            modifier = Modifier.menuAnchor()
                        )
                        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                            areas.forEach { area ->
                                DropdownMenuItem(text = { Text("${area.name} (${area.openTime}-${area.closeTime})") }, onClick = {
                                    selectedArea = area
                                    expanded = false
                                })
                            }
                        }
                    }
                }
                OutlinedTextField(value = date, onValueChange = { date = it }, label = { Text("Fecha (yyyy-MM-dd)") }, singleLine = true)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = startTime, onValueChange = { startTime = it }, label = { Text("Inicio (HH:mm)") }, singleLine = true, modifier = Modifier.weight(1f))
                    OutlinedTextField(value = endTime, onValueChange = { endTime = it }, label = { Text("Fin (HH:mm)") }, singleLine = true, modifier = Modifier.weight(1f))
                }
                if (errorMessage != null) {
                    Text(errorMessage, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    val area = selectedArea
                    if (area != null && date.isNotBlank() && startTime.isNotBlank() && endTime.isNotBlank()) {
                        onConfirm(area.id, date, startTime, endTime)
                    }
                },
                enabled = areas.isNotEmpty()
            ) { Text("Reservar") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancelar") } }
    )
}
