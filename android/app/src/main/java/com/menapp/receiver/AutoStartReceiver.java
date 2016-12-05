package com.menapp.receiver;

import com.menapp.receiver.CustomReceiver;
import android.content.BroadcastReceiver;  
import android.content.Context;  
import android.content.Intent;  
  
/** 
 * 实现开机启动 
 * @author Owner 
 */  
public class AutoStartReceiver extends BroadcastReceiver {  
  
    @Override  
    public void onReceive(Context context, Intent intent) {  
        Intent i = new Intent(context, CustomReceiver.class);  
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);  
        context.startActivity(i);  
    }  
}  