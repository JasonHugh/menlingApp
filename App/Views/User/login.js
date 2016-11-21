import React, {Component} from 'react'
import {
	Text,
	View,
	TouchableHighlight,
	StyleSheet,
	TextInput,
	Alert
} from 'react-native'
import Conf from '../../Utils/Conf'
import NavBar from '../../Components/NavBar'

export default class LoginView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
		}
	}
	render() {
		return (
			<View style={{flex:1}}>
				<NavBar title="登陆门铃"/>
				<View style={styles.container}>
					<View style={styles.form}>
						<TextInput style={styles.inputBox}
							onChangeText={(text) => this.setState({username: text})}
							placeholder="请输入门铃号"
							underlineColorAndroid='#fff'
							ref='inputUser'
						/>
						<TextInput style={styles.inputBox}
							onChangeText={(text) => this.setState({password: text})}
							placeholder="请输入密码"
							secureTextEntry={true}
							underlineColorAndroid='#fff'
							ref='inputPwd'
						/>
						<TouchableHighlight style={styles.sendBtn} underlayColor='#71D54A' onPress={this._onPress.bind(this)}>
			            	<Text style={styles.btnText}>
			                	确认登陆
			              	</Text>
		          		</TouchableHighlight>
						<TouchableHighlight style={[styles.sendBtn,{marginTop:5,backgroundColor:'#339933'}]} underlayColor='#71D54A' onPress={this._onPress1.bind(this)}>
			            	<Text style={styles.btnText}>
			                	创建门铃
			              	</Text>
		          		</TouchableHighlight>
					</View>
				</View>
			</View>
		);
	}

	_onPress() {
		let username = this.state.username;
		let password = this.state.password;
		if (username.trim() == "" | password.trim() == "") {
			Alert.alert("用户名或密码不能为空");
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

	async _saveUserToStorage(data) {
		if (data.code) {
			if (data.code == 202) {
				Alert.alert("用户名已存在！");
			}else{
				Alert.alert(data.error);
			}
		}else if (data.sessionToken && data.username) {
			sessionToken = data.sessionToken;
			username = data.username;
			storage.save({
			    key: 'loginState',
			    rawData: { 
			      sessionToken: sessionToken,
			      username: username
				}
			});
			//记录登陆状态
			global.loginState = {sessionToken:sessionToken,username: username};
			//页面跳转
			this.props.navigator.push({
		  		id: 'home'
			});
		}else {
			Alert.alert("获取数据错误");
		}
	}

	_onPress1() {
		this.props.navigator.push({
	  		id: 'reg'
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#99CCFF',
		justifyContent: 'center',
		alignItems: 'center'
	},
	inputBox: {
		textDecorationLine: "none",
		width:250,
		height:50,
		fontSize: 14,
		marginTop:10,
	},
	sendBtn: {
	    height:60,
	    backgroundColor: '#008263',
	  	justifyContent: 'center',
	  	alignItems: 'center',
    	marginTop: 30,
    	borderWidth: 1,
    	borderColor: '#fff',
    	opacity: 0.8
  	},
  	btnText: {
    	color: '#fff',
    	fontSize: 16,
  	}
})