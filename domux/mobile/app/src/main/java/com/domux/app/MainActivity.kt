package com.domux.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.domux.app.common.ServiceLocator
import com.domux.app.ui.navigation.DomuxNavHost
import com.domux.app.ui.navigation.Routes
import com.domux.app.ui.theme.DomuxTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DomuxTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    DomuxRoot()
                }
            }
        }
    }
}

@Composable
private fun DomuxRoot() {
    var isCheckingSession by remember { mutableStateOf(true) }
    var startDestination by remember { mutableStateOf(Routes.LOGIN) }

    LaunchedEffect(Unit) {
        val session = ServiceLocator.sessionManager.currentSession()
        startDestination = when (session?.role) {
            "RESIDENT" -> Routes.RESIDENT_HOME
            "GATEKEEPER" -> Routes.GATEKEEPER_HOME
            else -> Routes.LOGIN
        }
        isCheckingSession = false
    }

    if (isCheckingSession) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
    } else {
        DomuxNavHost(startDestination = startDestination)
    }
}
