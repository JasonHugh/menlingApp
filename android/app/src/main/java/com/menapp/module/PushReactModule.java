package com.menapp.module;

import com.menapp.GlobalData;

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

  @ReactMethod
  public void getVisitorId(Callback callback) {
    String visitor = GlobalData.visitor;
    callback.invoke(visitor);
  }
  
  @ReactMethod
  public void getCustomer(Callback callback) {
    String customer = GlobalData.customer;
    callback.invoke(customer);
  }

  @ReactMethod
  public void getConvId(Callback callback) {
    String convId = GlobalData.convId;
    callback.invoke(convId);
  }
}