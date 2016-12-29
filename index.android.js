import React, { 
    Component        
} from 'react'

import {
    AppRegistry,
    StyleSheet,
    View,
    DeviceEventEmitter,
    ToastAndroid
} from 'react-native'

import NavigatorComp from './App/Components/Navigator'
import { loadStorage } from './App/LocalStorage'

//获取登录信息
global.loginState = null;
loadStorage('loginState',(ret) => { global.loginState = ret });

AppRegistry.registerComponent('menApp', () => NavigatorComp);
