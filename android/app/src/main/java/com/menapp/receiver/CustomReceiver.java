package com.menapp.receiver;

import com.menapp.GlobalData;

import com.menapp.MainActivity;
import com.menapp.service.RingService;
import com.menapp.R;
import org.json.JSONObject;

import com.avos.avoscloud.AVOSCloud;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.widget.Toast;
import android.util.Log;
import android.media.MediaPlayer; 
import android.media.RingtoneManager;
import java.io.IOException;
import com.facebook.react.bridge.ReactContext;

public class CustomReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {
    try {
        if (intent.getAction().equals("com.menapp.bell_alert")) {
            JSONObject json = new JSONObject(intent.getExtras().getString("com.avos.avoscloud.Data"));
            String message = json.getString("alert");
            String visitor = json.getString("visitor");
            String customer = json.getString("customer");
            String convId = json.getString("conv_id");
            Intent resultIntent = new Intent(AVOSCloud.applicationContext, MainActivity.class);
            resultIntent.putExtra("isRing", 1);  //发送状态给activity关闭ringservice
            //发送数据给activity
            resultIntent.putExtra("visitor", visitor); 
            resultIntent.putExtra("customer", customer); 
            resultIntent.putExtra("convId", convId); 
            PendingIntent pendingIntent =
                PendingIntent.getActivity(AVOSCloud.applicationContext, 0, resultIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT);
            NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(AVOSCloud.applicationContext)
                    .setSmallIcon(R.drawable.notification)
                    .setContentTitle("简单门铃")
                    .setContentText(message)
                    .setTicker(message);
            mBuilder.setContentIntent(pendingIntent);
            mBuilder.setAutoCancel(true);

            int mNotificationId = 10086;
            NotificationManager mNotifyMgr =
                (NotificationManager) AVOSCloud.applicationContext
                    .getSystemService(
                        Context.NOTIFICATION_SERVICE);
            mNotifyMgr.notify(mNotificationId, mBuilder.build());

            //启动播放铃声的服务
            Intent i=new Intent(context,RingService.class);
            context.startService(i);
        }
    } catch (Exception e) {
        Log.i("push",e.getMessage());
    }
  }
}
