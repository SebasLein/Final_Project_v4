package com.domux.app.ui.shared

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.domux.app.common.UiState

@Composable
fun <T> StateContent(
    state: UiState<T>,
    emptyMessage: String,
    onSessionExpired: () -> Unit,
    content: @Composable (T) -> Unit
) {
    when (state) {
        is UiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        is UiState.Empty -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(emptyMessage, style = MaterialTheme.typography.bodyMedium)
        }
        is UiState.Error -> Box(Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
            Text(state.message, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.error)
        }
        is UiState.SessionExpired -> {
            onSessionExpired()
        }
        is UiState.Success -> content(state.data)
    }
}

@Composable
fun SectionCard(title: String, modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Card(modifier = modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp)) {
            Text(title, style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(8.dp))
            content()
        }
    }
}

@Composable
fun StatusChip(label: String, tone: ChipTone = ChipTone.Default) {
    val (bg, fg) = when (tone) {
        ChipTone.Success -> MaterialTheme.colorScheme.primaryContainer to MaterialTheme.colorScheme.primary
        ChipTone.Warning -> MaterialTheme.colorScheme.tertiaryContainer to MaterialTheme.colorScheme.tertiary
        ChipTone.Danger -> MaterialTheme.colorScheme.errorContainer to MaterialTheme.colorScheme.error
        ChipTone.Default -> MaterialTheme.colorScheme.surfaceVariant to MaterialTheme.colorScheme.onSurfaceVariant
    }
    Surface(color = bg, contentColor = fg, shape = MaterialTheme.shapes.small) {
        Text(label, modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp), style = MaterialTheme.typography.labelSmall)
    }
}

enum class ChipTone { Default, Success, Warning, Danger }

@Composable
fun ErrorBanner(message: String?) {
    if (message == null) return
    Surface(color = MaterialTheme.colorScheme.errorContainer, shape = MaterialTheme.shapes.medium) {
        Text(
            message,
            modifier = Modifier.padding(12.dp),
            color = MaterialTheme.colorScheme.error,
            style = MaterialTheme.typography.bodySmall
        )
    }
}
