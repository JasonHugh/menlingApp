package com.menapp.module;

import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.menapp.GlobalData;
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
    private String token;
    private String expires;
    private String openId;
    private UserInfo mInfo;
    private ReactContext context = getReactApplicationContext();
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
        System.out.println("qqlogin登录中");
        mTencent = Tencent.createInstance("1105866460", context);
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
                System.out.println("qqlogin登录失败");
                return;
            }
            JSONObject jsonResponse = (JSONObject) response;
            if (null != jsonResponse && jsonResponse.length() == 0) {
                System.out.println("qqlogin登录失败");
                return;
            }
            System.out.println("qqloginQQ登录成功返回结果-" + response.toString());
            doComplete((JSONObject)response);
        }
        protected void doComplete(JSONObject response) {}
        @Override
        public void onError(UiError e) {
            System.out.println("qqloginonError: " + e.errorDetail);
        }
        @Override
        public void onCancel() {
            System.out.println("qqloginonCancel: ");
        }
    }
    /** QQ登录第二步：存储token和openid */
    public void initOpenidAndToken(JSONObject jsonObject) {
        try {
            token = jsonObject.getString(Constants.PARAM_ACCESS_TOKEN);
            expires = jsonObject.getString(Constants.PARAM_EXPIRES_IN);
            openId = jsonObject.getString(Constants.PARAM_OPEN_ID);
            if (!TextUtils.isEmpty(token) && !TextUtils.isEmpty(expires) && !TextUtils.isEmpty(openId)) {
                mTencent.setAccessToken(token, expires);
                mTencent.setOpenId(openId);
            }
        } catch(Exception e) {
        }
    }
    /** QQ登录第三步：获取用户信息 */
    private void updateUserInfo() {

        if (mTencent != null && mTencent.isSessionValid()) {
            IUiListener listener = new IUiListener() {

                @Override
                public void onError(UiError e) {
                    System.out.println("qqlogin把手机时间改成获取网络时间");
                }

                @Override
                public void onComplete(Object response) {
                    JSONObject json = (JSONObject) response;
                    if (json.has("nickname")) {
                        try {
                            System.out.println("qqlogin获取用户信息成功，返回结果："+response.toString());
                            System.out.println("qqlogin登录成功\n"+"用户id:"+mTencent.getOpenId()+"\n昵称:"+json.getString("nickname")+"\n头像地址:"+json.get("figureurl_qq_1"));
                            //把用户信息保存到全局
                            String nickname = json.getString("nickname");
                            String headimg = json.getString("figureurl_qq_2");
                            String gender = json.getString("gender");
                            String province = json.getString("province");
                            String city = json.getString("city");
                            WritableMap map = new WritableNativeMap();
                            map.putString("openId",openId);
                            map.putString("token",token);
                            map.putString("expires",expires);
                            map.putString("headimg",headimg);
                            map.putString("nickname",nickname);
                            map.putString("gender",gender);
                            map.putString("province",province);
                            map.putString("city",city);
                            sendEvent(getReactApplicationContext(),"QQLoginSuccess",map);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
                @Override
                public void onCancel() {
                    System.out.println("qqlogin获取用户信息失败");
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
