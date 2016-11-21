import React, { 
    Component,
    PropTypes         
} from 'react'

import {
    AppRegistry,
    StyleSheet,
    View,
    AsyncStorage,
} from 'react-native'

import NavigatorComp from './App/Components/Navigator'

//storage
import Storage from 'react-native-storage'

var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync同步方法，无缝返回最新数据。
  sync: {
    // 同步方法的具体说明会在后文提到
  }
});
global.loginState = null;
//获取登录信息
storage.load({
    key: 'loginState',
    autoSync: false,
    syncInBackground: false
  }).then(ret => {
  	global.loginState = ret;
  }).catch(err => {
    //console.warn(err.message);
    switch (err.name) {
        case 'NotFoundError':
            // TODO;
            break;
        case 'ExpiredError':
            // TODO
            break;
    }
})
global.storage = storage;

AppRegistry.registerComponent('menApp', () => NavigatorComp);
