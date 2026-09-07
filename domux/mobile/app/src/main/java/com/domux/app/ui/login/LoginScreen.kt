package com.domux.app.ui.login

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.domux.app.ui.shared.ErrorBanner

@Composable
fun LoginScreen(
    onLoginSuccess: (role: String) -> Unit,
    viewModel: LoginViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    LaunchedEffect(state.loggedInRole) {
        state.loggedInRole?.let {
            onLoginSuccess(it)
            viewModel.consumeNavigation()
        }
    }

    Box(Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
        Column(Modifier.fillMaxWidth()) {
            Text("DOMUX", style = MaterialTheme.typography.headlineMedium)
            Text(
                "Inicia sesión como residente o portería",
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(top = 4.dp, bottom = 24.dp)
            )

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Correo") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Contraseña") },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(16.dp))

            ErrorBanner(state.error)
            Spacer(Modifier.height(8.dp))

            Button(
                onClick = { viewModel.login(email, password) },
                enabled = !state.loading,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(if (state.loading) "Verificando…" else "Ingresar")
            }
        }
    }
}
