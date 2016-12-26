package com.menapp;

import com.menapp.module.PushReactPackage;
import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;
import com.avos.avoscloud.AVOSCloud;
import com.menapp.module.QQConnectPackage;
import com.tencent.tauth.Tencent;

public class MainApplication extends Application implements ReactApplication {

  @Override
  public void onCreate() {
    super.onCreate();
    // 初始化推送信息
    AVOSCloud.initialize(this, "nfxWSOjzkw6t3KMkBVsc5LMJ-gzGzoHsz",
        "rtMwao5t0tbBMMgFgqqnjkiS");
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new PushReactPackage(),
          new QQConnectPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
