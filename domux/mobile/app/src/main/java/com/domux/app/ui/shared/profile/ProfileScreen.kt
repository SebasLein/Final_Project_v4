package com.domux.app.ui.shared.profile

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.domux.app.common.ServiceLocator
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen(onLoggedOut: () -> Unit) {
    val session by ServiceLocator.sessionManager.session.collectAsState(initial = null)
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().padding(24.dp)) {
        Text("Perfil", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(24.dp))

        session?.let {
            ProfileField("Nombre", it.name)
            ProfileField("Correo", it.email)
            ProfileField("Rol", if (it.role == "RESIDENT") "Residente" else "Portería")
        }

        Spacer(Modifier.weight(1f))

        Button(
            onClick = {
                scope.launch {
                    ServiceLocator.authRepository.logout()
                    onLoggedOut()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.errorContainer)
        ) {
            Text("Cerrar sesión", color = MaterialTheme.colorScheme.error)
        }
    }
}

@Composable
private fun ProfileField(label: String, value: String) {
    Column(Modifier.padding(bottom = 16.dp)) {
        Text(label, style = MaterialTheme.typography.labelMedium)
        Text(value, style = MaterialTheme.typography.bodyLarge)
    }
}
