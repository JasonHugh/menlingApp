package com.menapp;

import com.facebook.react.ReactActivity;
import com.avos.avoscloud.*;

import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.os.Bundle;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.shell.MainReactPackage;
import android.content.Intent;
import android.widget.Toast;

import com.menapp.service.RingService;
import com.tencent.connect.UserInfo;
import com.tencent.connect.common.Constants;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends ReactActivity {
    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;
	private Tencent mTencent;
	private UserInfo mInfo;
	private Toast mToast;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "menApp";
    }

    @Override
  	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//推送
		PushService.setDefaultPushCallback(this, MainActivity.class);
		AVInstallation.getCurrentInstallation().saveInBackground(new SaveCallback() {
		    public void done(AVException e) {
		        if (e == null) {
		            // 保存成功
		            String installationId = AVInstallation.getCurrentInstallation().getInstallationId();
		            Log.i("com.menapp.push",installationId);
		        } else {
		            Log.i("com.menapp.push","保存失败");
		        }
		    }
		});

		//查看是否有通知,关闭响铃
		Intent intent = getIntent();
		//int isRing = intent.getIntExtra("isRing",0);
		//把需要的数据存入变量
		GlobalData.visitor = intent.getStringExtra("visitor");
		GlobalData.customer = intent.getStringExtra("customer");
		GlobalData.convId = intent.getStringExtra("convId");
		//if (isRing == 1) {
		//	Intent i=new Intent(MainActivity.this,RingService.class);
        //	stopService(i);
		//}
  	}

}
