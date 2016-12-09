package com.menapp.service;

import com.menapp.R;
import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.IBinder;
import android.util.Log;
 
public class RingService extends Service {
    private MediaPlayer mp;
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    @Override
    public void onCreate() {
        super.onCreate();
    }
    @Override  
    public void onStart(Intent intent, int startId) {
        super.onStart(intent, startId);
        mp=MediaPlayer.create(this,R.raw.ring);
        final int id = startId;
        mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
            private int count = 0;
            @Override
            public void onCompletion(MediaPlayer mp) {
                count++;
                if (count < 3) {
                    mp.start();
                }else {
                    mp.stop();
                    mp.release();
                    stopSelf(id);
                }
                Log.i("count",count+"");
            }
        });
        mp.start();
    } 
    
    @Override
    public void onDestroy() {
        super.onDestroy();
    }
 
}