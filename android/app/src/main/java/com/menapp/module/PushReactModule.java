package com.menapp.module;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.avos.avoscloud.*;

import java.util.Map;

public class PushReactModule extends ReactContextBaseJavaModule {

  public PushReactModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "PushAndroid";
  }

  @ReactMethod
  public void getInstallationId(Callback callback) {
    String installationId = AVInstallation.getCurrentInstallation().getInstallationId();
    callback.invoke(installationId);
  }
}