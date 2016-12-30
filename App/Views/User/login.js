import React, {Component} from 'react'
import {
	Text,
	View,
	TouchableHighlight,
	StyleSheet,
	TextInput,
	Alert,
	Image,
	Dimensions,
	ToastAndroid,
	TouchableOpacity,
	DeviceEventEmitter
} from 'react-native'
import Conf from '../../Utils/Conf'
import NavBar from '../../Components/NavBar'
import { saveStorage } from '../../LocalStorage'
import QQConnect from '../../NativeModule/QQConnect'
import { qqLoginApi } from '../../LeanCloud'

export default class LoginView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
		}
	}

	async componentDidMount() {
		this.qqLoginEvent = DeviceEventEmitter.addListener('QQLoginSuccess',(data) => {
	        //登陆到leancloud
	        qqLoginApi({
	        	'authData':{
	        		'qq':{
	        			'openid':data.openId,
		        		'access_token':data.token,
		        		'expires_in':data.expires
	        		}
	        	},
	        	'nickname':data.nickname,
	        	'headimg':data.headimg,
	        	'gender':data.gender,
	        	'province':data.province,
	        	'city':data.city
        	},(responseJson) => {
        		//保存登陆状态
        		this._saveUserToStorage(responseJson,data.nickname,data.headimg,data.gender);
        	})
        	
	    })
	}

	componentWillUnmount() {
	    this.qqLoginEvent.remove();
	}

	render() {
		return (
			<Image source={require('../../assets/login_bg.jpg')} style={styles.container}
				resizeMode='cover'>
				<View style={styles.form}>
					<Text style={styles.title}>登陆门铃</Text>
					<TextInput style={styles.inputBox}
						onChangeText={(text) => this.setState({username: text})}
						placeholder="请输入用户名"
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
					<View style={styles.otherLogin}>
						<TouchableOpacity activeOpacity={0.5} onPress={this._qqLogin.bind(this)}>
	          				<Text style={styles.iconQQ}>&#xe616;</Text>
	          			</TouchableOpacity>
					</View>
					<TouchableHighlight style={styles.sendBtn} underlayColor='#495a80' onPress={this._onPress.bind(this)}>
		            	<Text style={styles.btnText}>
		                	确认登陆
		              	</Text>
	          		</TouchableHighlight>
					<TouchableHighlight style={[styles.sendBtn,{marginTop:20,backgroundColor:'#339933',borderColor:'#339933'}]} underlayColor='#71D54A' onPress={this._onPress1.bind(this)}>
		            	<Text style={styles.btnText}>
		                	创建门铃
		              	</Text>
	          		</TouchableHighlight>
				</View>
			</Image>
		);
	}

	_qqLogin() {
		QQConnect.login();
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
			let response = await fetch('https://api.leancloud.cn/1.1/login', {
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

	async _saveUserToStorage(data,nickname,headimg,gender) {
		if (data.code) {
			if (data.code == 202) {
				ToastAndroid.show("用户名已存在！",Conf.toastTime);
			}else{
				ToastAndroid.show(data.error,Conf.toastTime);
			}
		}else if (data.sessionToken && data.username) {
			var saveData = { 
			      	sessionToken: data.sessionToken,
			      	username: data.username,
			      	objectId: data.objectId,
			      	nickname: data.nickname,
			      	headimg: data.headimg,
			      	gender: data.gender
				}
			if (nickname && headimg && gender) {
				saveData.nickname = nickname;
				saveData.headimg = headimg;
				saveData.gender = gender;
			}

			//记录登陆状态
			saveStorage('loginState',saveData);
			//console.log(JSON.stringify(data))
			global.loginState = saveData;
			//页面跳转
			this.props.navigator.push({
		  		id: 'contain'
			});
		}else {
			ToastAndroid.show("获取数据错误",Conf.toastTime);
		}
	}

	_onPress1() {
		this.props.navigator.push({
	  		id: 'reg'
		});
	}
}
var { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
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
		marginBottom: 30
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
    	marginTop: 10,
    	borderWidth: 1,
    	borderColor: '#51B2F9',
    	borderRadius:25,
    	opacity: 0.8
  	},
  	btnText: {
    	color: '#fff',
    	fontSize: 16,
  	},
  	otherLogin: {
  		marginTop: 10,
  		justifyContent:'center',
  		alignItems: 'center',
  		height: 55,
  		flexDirection: 'row',
  	},
  	iconQQ: {
  		fontFamily: 'iconfont',
  		fontSize: 40,
  		color: '#eee'
  	}
})