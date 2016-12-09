import React, {Component} from 'react'
import {
	Text,
	View,
	TouchableHighlight,
	StyleSheet,
	TextInput,
	Alert,
	Dimensions,
	Image,
	ToastAndroid
} from 'react-native'
import Conf from '../../Utils/Conf'
import NavBar from '../../Components/NavBar'
import { saveStorage } from '../../LocalStorage'

export default class RegView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
		}
	}
	render() {
		return (
			<Image source={require('../../assets/login_bg.jpg')} style={styles.container}
				resizeMode='cover'>
				<View style={styles.form}>
					<Text style={styles.title}>创建门铃</Text>
					<TextInput style={styles.inputBox}
						onChangeText={(text) => this.setState({username: text})}
						placeholder="请输入你要创建的门铃号"
						placeholderTextColor='#fff'
						underlineColorAndroid='transparent'
						ref='inputUser'
					/>
					<TextInput style={styles.inputBox}
						onChangeText={(text) => this.setState({password: text})}
						placeholder="请输入密码"
						placeholderTextColor='#fff'
						secureTextEntry={true}
						underlineColorAndroid='transparent'
						ref='inputPwd'
					/>
					<TouchableHighlight style={styles.sendBtn} underlayColor='#495a80' onPress={this._onPress.bind(this)}>
		            	<Text style={styles.btnText}>
		                	确认创建
		              	</Text>
	          		</TouchableHighlight>
	          		<TouchableHighlight style={[styles.sendBtn,{marginTop:20,backgroundColor:'#339933',borderColor:'#339933'}]} underlayColor='#71D54A' onPress={this._onPress1.bind(this)}>
		            	<Text style={styles.btnText}>
		                	登陆门铃
		              	</Text>
	          		</TouchableHighlight>
				</View>
			</Image>
		);
	}

	_onPress() {
		let username = this.state.username;
		let password = this.state.password;
		if (username.trim() == "" | password.trim() == "") {
			ToastAndroid.show("用户名或密码不能为空",Conf.toastTime);
			return;
		}
		let response = this._addUserToApi(username,password);
	}

	async _addUserToApi(username: string,password: string) {
		try {
			let response = await fetch('https://api.leancloud.cn/1.1/users', {
			  method: 'POST',
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json',
			    'X-LC-Id': Conf.leanCloudId,
			    'X-LC-Key': Conf.leanCloudKey
			  },
			  body: JSON.stringify({
			    username: username,
			    password: password,
			  })
			});
			let responseJson = await response.json();
			await this._saveUserToStorage(responseJson)
		} catch(error) {
			console.error(error);
		}
	}

	async _saveUserToStorage(data) {
		if (data.code) {
			if (data.code == 202) {
				ToastAndroid.show("用户名已存在！",Conf.toastTime);
			}else{
				ToastAndroid.show(data.error,Conf.toastTime);
			}
		}else if (data.sessionToken && data.username) {
			sessionToken = data.sessionToken;
			username = data.username;
			saveStorage('loginState',{ 
		      	sessionToken: sessionToken,
		      	username: username
			});
			//记录登陆状态
			global.loginState = {sessionToken:sessionToken,username: username};
			//页面跳转
			this.props.navigator.push({
		  		id: 'home'
			});
		}else {
			ToastAndroid.show("获取数据错误",Conf.toastTime);
		}
	}
	_onPress1() {
		this.props.navigator.pop();
	}
}

var { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#99CCFF',
		justifyContent: 'center',
		alignItems: 'center',
		width:width, 
    	height:498*width/750
	},
	title:{
		fontSize:20,
		alignItems:'center',
		color:'#fff',
		textAlign:'center',
		marginBottom: 20
	},
	inputBox: {
		width:280,
		height:50,
		fontSize: 14,
		marginTop:20,
		paddingHorizontal:30,
		borderWidth:1,
		borderColor:'#fff',
		borderRadius: 25,
		color:'#fff'
	},
	sendBtn: {
	    height:50,
	    backgroundColor: '#51B2F9',
	  	justifyContent: 'center',
	  	alignItems: 'center',
    	marginTop: 20,
    	borderWidth: 1,
    	borderColor: '#51B2F9',
    	borderRadius:25,
    	opacity: 0.8
  	},
  	btnText: {
    	color: '#fff',
    	fontSize: 16,
  	}
})