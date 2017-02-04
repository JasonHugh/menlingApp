import React, {Component} from 'react'
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	Animated,
	Dimensions,
	TextInput,
	ToastAndroid
} from 'react-native'
import NavBar from '../../Components/NavBar'
import { editUser } from '../../LeanCloud'
import Conf from '../../Utils/Conf'
import { deleteStorage } from '../../LocalStorage'

export default class PasswordView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newPassword:"",
			oldPassword:""
		}
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#eee'}} >
				<NavBar leftBtn={true} leftOnPress={() => {this.props.navigator.pop()}} title="修改密码"/>
				{/*<View style={styles.inputBox} >
					<Text style={styles.inputText}>旧密码：</Text>
					<TextInput placeholder="请输入旧密码" style={{flex:1,marginRight:20}} 
						onChangeText={(text) => this.setState({oldPassword: text})}
						secureTextEntry={true}/>
				</View>*/}
				<View style={styles.inputBox} >
					<Text style={styles.inputText}>新密码：</Text>
					<TextInput placeholder="请输入新密码" style={{flex:1,marginRight:20}}
						onChangeText={(text) => this.setState({newPassword: text})}
						secureTextEntry={true} />
				</View>
				<View style={{alignItems:'center'}}>
					<TouchableHighlight style={styles.sendBtn} underlayColor='#495a80' onPress={this._onPress.bind(this)}>
		            	<Text style={styles.btnText}>
		                	确认修改
		              	</Text>
	          		</TouchableHighlight>
          		</View>
			</View>
		)
	}

	async _onPress() {
		let newPassword = this.state.newPassword;
		if (newPassword.trim() == "") {
			ToastAndroid.show("密码不能为空",Conf.toastTime);
			return;
		}
		var res = await editUser({"password":newPassword});
		if (res.updatedAt) {
			ToastAndroid.show("密码修改成功,请重新登陆",Conf.toastTime);
			//重新登陆
			deleteStorage('loginState');
	    	this.props.navigator.resetTo({id:'login'})
		}else{
			ToastAndroid.show(res.error,Conf.toastTime);
		}
	}
}

var styles = {
	inputBox: {
		marginTop:20,
		backgroundColor: '#fff',
		height: 50,
		flexDirection:'row',
		alignItems: 'center'
	},
	inputText: {
		marginLeft:20,
		marginRight:10
	},
	sendBtn: {
	    height:50,
	    backgroundColor: '#51B2F9',
	  	justifyContent: 'center',
	  	alignItems: 'center',
    	marginTop: 30,
    	borderWidth: 1,
    	borderColor: '#51B2F9',
    	borderRadius:25,
    	opacity: 0.8,
    	width:200
  	},
  	btnText: {
    	color: '#fff',
    	fontSize: 16,
  	}
}