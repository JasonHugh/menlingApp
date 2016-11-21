import React, {
	Component
} from 'react'

import {
	Navigator,
	View,
	Alert
} from 'react-native'

import ChatView from '../../Views/Chat'
import HelloView from '../../Views/Hello'
import WelcomeView from '../../Views/Welcome'
import LoginView from '../../Views/User/login'
import RegView from '../../Views/User/register'
import HomeView from '../../Views/Home'
import QRCodeView from '../../Views/QRCode'

export default class NavigatorComp extends Component {
	constructor(props) {
		super(props);
		//判断用户是否登陆
		if (loginState) {
			this.firstViewId = 'home';
		}else{
			this.firstViewId = 'welcome'
		}
	} 

	render() {
		return (
			<View style={styles.container}>
                <Navigator
                    initialRoute={{index: 0, id: this.firstViewId}}
                    renderScene={this._renderScene}
        			configureScene={this._configureScene}
                />
            </View>
		);
	}

	_configureScene(route, routeStack) {
	    if (route.type == 'bottom') {
	    	return Navigator.SceneConfigs.FloatFromBottom; // 底部弹出
	    }else if (route.type == 'top') {
	    	return Navigator.SceneConfigs.PushFromTop; // 顶部弹出
	    }else if (route.type == 'left') {
	    	return Navigator.SceneConfigs.PushFromLeft; // 左侧弹出
	    }else{
	    	return Navigator.SceneConfigs.PushFromRight; // 右侧弹出
	    }
	 }

	_renderScene(route, navigator) {
		switch(route.id){
			case 'chat': return(<ChatView  navigator={navigator} route={route}/>);
			case 'hello': return(<HelloView  navigator={navigator} route={route}/>);
			case 'welcome': return(<WelcomeView  navigator={navigator} route={route}/>);
			case 'reg': return(<RegView  navigator={navigator} route={route}/>);
			case 'login': return(<LoginView  navigator={navigator} route={route}/>);
			case 'home': return(<HomeView  navigator={navigator} route={route}/>);
			case 'qrcode': return(<QRCodeView  navigator={navigator} route={route}/>);
		}
	}
}

const styles = {
    container: {
        flex: 1
    }
}
