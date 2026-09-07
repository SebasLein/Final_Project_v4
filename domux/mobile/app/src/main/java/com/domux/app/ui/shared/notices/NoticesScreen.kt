package com.domux.app.ui.shared.notices

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.domux.app.data.remote.dto.NoticeDto
import com.domux.app.ui.shared.SectionCard
import com.domux.app.ui.shared.StateContent

@Composable
fun NoticesScreen(
    onSessionExpired: () -> Unit,
    viewModel: NoticesViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()

    StateContent(state, "No hay comunicados publicados.", onSessionExpired) { notices ->
        LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(notices) { notice -> NoticeRow(notice) }
        }
    }
}

@Composable
private fun NoticeRow(notice: NoticeDto) {
    SectionCard(title = notice.title) {
        Spacer(Modifier.height(4.dp))
        androidx.compose.material3.Text(notice.body)
    }
}
