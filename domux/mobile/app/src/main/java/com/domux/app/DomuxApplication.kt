package com.domux.app

import android.app.Application
import com.domux.app.common.ServiceLocator

class DomuxApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        ServiceLocator.init(this)
    }
}
