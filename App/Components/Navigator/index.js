import React, {
	Component
} from 'react'

import {
	Navigator,
	View,
	Alert
} from 'react-native'

import ChatView from '../../Views/Chat'
import WelcomeView from '../../Views/Welcome'
import LoginView from '../../Views/User/login'
import RegView from '../../Views/User/register'
import HomeView from '../../Views/Home'
import QRCodeView from '../../Views/QRCode'
import Record from '../../Views/Record'

export default class NavigatorComp extends Component {
	constructor(props) {
		super(props);
		//设置第一页
		this.firstViewId = 'welcome'
	} 

	render() {
		return (
			<View style={styles.container}>
                <Navigator
                    initialRoute={{id: this.firstViewId}}
                    renderScene={this._renderScene}
        			configureScene={this._configureScene}
                />
            </View>
		);
	}

	_configureScene(route, routeStack) {
		let configure = Navigator.SceneConfigs.PushFromRight;  
	    if (route.type == 'bottom') {
	    	configure = Navigator.SceneConfigs.FloatFromBottom; // 底部弹出
	    }else if (route.type == 'top') {
	    	configure = Navigator.SceneConfigs.PushFromTop; // 顶部弹出
	    }else if (route.type == 'left') {
	    	configure = Navigator.SceneConfigs.PushFromLeft; // 左侧弹出
	    }

	    return {
	    	...configure,
	    	gestures:{}
	    }
	 }

	_renderScene(route, navigator) {
		switch(route.id){
			case 'chat': return(<ChatView  navigator={navigator} route={route}/>);
			case 'welcome': return(<WelcomeView  navigator={navigator} route={route}/>);
			case 'reg': return(<RegView  navigator={navigator} route={route}/>);
			case 'login': return(<LoginView  navigator={navigator} route={route}/>);
			case 'home': return(<HomeView  navigator={navigator} route={route}/>);
			case 'qrcode': return(<QRCodeView  navigator={navigator} route={route}/>);
			case 'record': return(<Record  navigator={navigator} route={route}/>);
		}
	}
}

const styles = {
    container: {
        flex: 1
    }
}
