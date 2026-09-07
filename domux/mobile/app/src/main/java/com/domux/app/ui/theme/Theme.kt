package com.domux.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val DomuxInk = Color(0xFF07111F)
val DomuxCyan = Color(0xFF6EE7FF)
val DomuxViolet = Color(0xFF8B5CF6)
val DomuxEmerald = Color(0xFF22C55E)
val DomuxSurface = Color(0xFF0F1729)
val DomuxDanger = Color(0xFFEF4444)

private val DomuxColorScheme = darkColorScheme(
    primary = DomuxCyan,
    secondary = DomuxViolet,
    background = DomuxInk,
    surface = DomuxSurface,
    error = DomuxDanger,
    onPrimary = DomuxInk,
    onBackground = Color.White,
    onSurface = Color.White
)

@Composable
fun DomuxTheme(content: @Composable () -> Unit) {
    // La app siempre usa el esquema oscuro de marca, igual que la landing/panel web.
    MaterialTheme(
        colorScheme = DomuxColorScheme,
        content = content
    )
}
