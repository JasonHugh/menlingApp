package com.menapp.module;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.menapp.MainActivity;
import com.tencent.connect.UserInfo;
import com.tencent.connect.common.Constants;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by hay on 2016/12/26.
 */
public class QQConnectModule extends ReactContextBaseJavaModule {
    private Tencent mTencent;
    private UserInfo mInfo;
    private Toast mToast;
    public QQConnectModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "QQConnect";
    }

    /** ------------------------QQ第三方登录-------------------- */
    @ReactMethod
    public void login(){
        mTencent = Tencent.createInstance("1105866460", getCurrentActivity().getApplicationContext());
        /** 判断是否登陆过 */
        if (!mTencent.isSessionValid()){
            mTencent.login(getCurrentActivity(), "all",loginListener);
        }
    }
    IUiListener loginListener = new BaseUiListener() {
        @Override
        protected void doComplete(JSONObject values) {
            initOpenidAndToken(values);
            updateUserInfo();
        }
    };
    /** QQ登录第一步：获取token和openid */
    private class BaseUiListener implements IUiListener {
        @Override
        public void onComplete(Object response) {
            if (null == response) {
                Log.i("com.menapp.QQLogin","登录失败");
                return;
            }
            JSONObject jsonResponse = (JSONObject) response;
            if (null != jsonResponse && jsonResponse.length() == 0) {
                Log.i("com.menapp.QQLogin","登录失败");
                return;
            }
            Log.i("com.menapp.QQLogin","QQ登录成功返回结果-" + response.toString());
            doComplete((JSONObject)response);
        }
        protected void doComplete(JSONObject response) {}
        @Override
        public void onError(UiError e) {
            Log.e("com.menapp.QQLogin","onError: " + e.errorDetail);
        }
        @Override
        public void onCancel() {
            Log.i("com.menapp.QQLogin","onCancel: ");
        }
    }
    /** QQ登录第二步：存储token和openid */
    public void initOpenidAndToken(JSONObject jsonObject) {
        try {
            String token = jsonObject.getString(Constants.PARAM_ACCESS_TOKEN);
            String expires = jsonObject.getString(Constants.PARAM_EXPIRES_IN);
            String openId = jsonObject.getString(Constants.PARAM_OPEN_ID);
            if (!TextUtils.isEmpty(token) && !TextUtils.isEmpty(expires) && !TextUtils.isEmpty(openId)) {
                mTencent.setAccessToken(token, expires);
                mTencent.setOpenId(openId);
            }
        } catch(Exception e) {
        }
    }
    /** QQ登录第三步：获取用户信息 */
    private void updateUserInfo() {
        Looper.prepare();
        final Handler mHandler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                /** 获取用户信息成功 */
                if (msg.what == 0) {
                    JSONObject response = (JSONObject) msg.obj;
                    if (response.has("nickname")) {
                        try {
                            Log.i("com.menapp.QQInfo","获取用户信息成功，返回结果："+response.toString());
                            Log.i("com.menapp.QQInfo","登录成功\n"+"用户id:"+mTencent.getOpenId()+"\n昵称:"+response.getString("nickname")+"\n头像地址:"+response.get("figureurl_qq_1"));
                            //把用户信息传给react
                            WritableMap params = Arguments.createMap();
                            params.putString("openId",mTencent.getOpenId());
                            params.putString("nickname",response.getString("nickname"));
                            params.putString("headimg",response.getString("figureurl_qq_1"));
                            sendEvent(getReactApplicationContext(), "QQLoginSuccess", params);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }else if(msg.what == 1){
                    Log.i("com.menapp.QQInfo",msg+"");
                }else if(msg.what == 2){
                    Log.i("com.menapp.QQInfo",msg+"");
                }
            }

        };
        if (mTencent != null && mTencent.isSessionValid()) {
            IUiListener listener = new IUiListener() {
                @Override
                public void onError(UiError e) {
                    Message msg = new Message();
                    msg.obj = "把手机时间改成获取网络时间";
                    msg.what = 1;
                    mHandler.sendMessage(msg);
                }

                @Override
                public void onComplete(final Object response) {
                    Message msg = new Message();
                    msg.obj = response;
                    msg.what = 0;
                    mHandler.sendMessage(msg);
                }
                @Override
                public void onCancel() {
                    Message msg = new Message();
                    msg.obj = "获取用户信息失败";
                    msg.what = 2;
                    mHandler.sendMessage(msg);
                }
            };
            mInfo = new UserInfo(getCurrentActivity(), mTencent.getQQToken());
            mInfo.getUserInfo(listener);
        } else {

        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

}
