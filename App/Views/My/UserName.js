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

export default class UserNameView extends Component {
	constructor(props) {
		super(props);
		this.username = global.loginState.username;
		this.state = {
			newUsername: ''
		}
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#eee'}} >
				<NavBar leftBtn={true} leftOnPress={() => {this.props.navigator.pop()}} title="修改用户名"/>
				<View style={styles.inputBox} >
					<Text style={styles.inputText}>当前用户名：{this.username}</Text>
				</View>
				<View style={styles.inputBox} >
					<Text style={styles.inputText}>新用户名：</Text>
					<TextInput placeholder="请输入新用户名" style={{flex:1,marginRight:20}} 
					onChangeText={(text) => this.setState({newUsername: text})} />
				</View>
				<View style={[styles.inputBox,{justifyContent:'center',flexDirection:'column'}]} >
					<Text style={{fontSize:12,color:'#f00'}}>注意：用户名修改后需要重新生成门铃二维码</Text>
					<Text style={{fontSize:12,color:'#f00'}}>而且已有的敲门记录会丢失</Text>
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
		let newUsername = this.state.newUsername;
		if (newUsername.trim() == "") {
			ToastAndroid.show("用户名不能为空",Conf.toastTime);
			return;
		}
		var res = await editUser({'username':newUsername});
		if (res.updatedAt) {
			ToastAndroid.show("用户名修改成功,请重新登陆",Conf.toastTime);
			//重新登陆
			deleteStorage('loginState');
	    	this.props.navigator.resetTo({id:'login'})
		}else{
			if (res.code == 202) {
				ToastAndroid.show('用户名已存在！',Conf.toastTime);
			}else {
				ToastAndroid.show(res.error,Conf.toastTime);
			}
			
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