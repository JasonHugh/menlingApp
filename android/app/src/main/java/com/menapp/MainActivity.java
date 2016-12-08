package com.menapp;

import com.facebook.react.ReactActivity;
import com.avos.avoscloud.*;
import android.util.Log;
import android.os.Bundle;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.shell.MainReactPackage;
import android.content.Intent;
import com.menapp.service.RingService;

public class MainActivity extends ReactActivity {
    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

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
		PushService.setDefaultPushCallback(this, MainActivity.class);
		AVInstallation.getCurrentInstallation().saveInBackground(new SaveCallback() {
		    public void done(AVException e) {
		        if (e == null) {
		            // 保存成功
		            String installationId = AVInstallation.getCurrentInstallation().getInstallationId();
		            Log.i("push",installationId);
		        } else {
		            Log.i("push","保存失败");
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
