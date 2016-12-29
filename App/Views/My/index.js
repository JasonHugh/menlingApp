import React, { Component } from 'react'
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	Animated,
	Dimensions
} from 'react-native'
import NavBar from '../../Components/NavBar'
import { deleteStorage,loadStorage } from '../../LocalStorage'
import { getConversationList } from '../../LeanCloud'

export default class MyView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bounceValue: new Animated.Value(0),
			allTime: 0,
			nowTime: 0
	    };
	    this.username = global.loginState.username;
	    if (global.loginState.nickname) {
	    	this.name = global.loginState.nickname;
	    }else {
	    	this.name = global.loginState.username;
	    }
	    if (global.loginState.headimg) {
	    	this.headimg = {uri: global.loginState.headimg};
	    }else {
	    	this.headimg = require("../../assets/userhead.png");
	    }

	    //获取敲门记录数
	    if (!global.recordData) {
			getConversationList(global.loginState.username,1,200,(data) => {
                global.recordData = data;
            }) 
		}
	    var i = 1;
	    	my = this;
	    var t = setInterval(() => {
	    	var record = global.recordData;
	    	if (record) {
	    		var day = new Date().Format("yyyy年MM月dd日"),
	    			sum = 0;
		    	if (record[day]) {
		    		my.setState({nowTime:record[day].length});
		    	}
	    		for (var json in record) {
	    			sum += record[json].length;
	    		}
	    		my.setState({allTime:sum});
	    		clearInterval(t);
	    	}
	    },100)
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#eee'}}>
				<NavBar title="个人中心" />
				<Image source={require("../../assets/my_top_bg.png")} style={styles.top}
					resizeMode='cover' >
					<Image source={this.headimg} style={styles.userhead} resizeMode='cover'/>
					<Text style={styles.username}>{this.name}</Text>
				</Image>
				<View style={styles.infoBox}>
					<View style={styles.infoSubBox} >
						<Text style={styles.infoText}>{this.state.allTime}</Text>
						<Text style={styles.infoText}>访客人次</Text>
					</View>
					<View style={[styles.infoSubBox,{borderRightWidth: 0}]} >
						<Text style={styles.infoText}>{this.state.nowTime}</Text>
						<Text style={styles.infoText}>今日次数</Text>
					</View>
				</View>
				<TouchableOpacity style={styles.rowBox} activeOpacity={0.5} onPress={this._onPress4.bind(this)} > 
					<View style={styles.rowSubBox}>
						<Text style={styles.rowBoxIcon}>&#xe6b8;</Text>
						<Text style={styles.rowBoxText}>修改用户名</Text>
						<Text style={styles.rowBoxArrow}>&#xe6a7;</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.rowBox} activeOpacity={0.5} onPress={this._onPress1.bind(this)} > 
					<View style={styles.rowSubBox}>
						<Text style={[styles.rowBoxIcon,{color:'#726dd1'}]}>&#xe69e;</Text>
						<Text style={styles.rowBoxText}>修改密码</Text>
						<Text style={styles.rowBoxArrow}>&#xe6a7;</Text>
					</View>
				</TouchableOpacity>
				{/*<TouchableOpacity style={styles.rowBox} activeOpacity={0.5} onPress={this._onPress2.bind(this)} > 
					<View style={styles.rowSubBox}>
						<Text style={[styles.rowBoxIcon,{color:'#abb1f3'}]}>&#xe6ae;</Text>
						<Text style={styles.rowBoxText}>设置你的小区</Text>
						<Text style={styles.rowBoxArrow}>&#xe6a7;</Text>
					</View>
				</TouchableOpacity>*/}
				<TouchableOpacity style={styles.rowBox} activeOpacity={0.5} onPress={this._onPress3.bind(this)} > 
					<View style={styles.rowSubBox}>
						<Text style={[styles.rowBoxIcon,{color:'#F4A5DE',fontSize:25}]}>&#xe62f;</Text>
						<Text style={styles.rowBoxText}>退出登录</Text>
						<Text style={styles.rowBoxArrow}>&#xe6a7;</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	_isShadowAnimate(){
		if (this.state.shadow) {
			return (
				<View style={styles.shadow} >
					<Animated.View style={[styles.openBoxAn,{transform: [                      
	        				{scale: this.state.bounceValue},
	      				]}]} />
      			</View>
			)
		}
	}

	_animateRun() {
		this.setState({shadow:true})
	    Animated.spring(
			this.state.bounceValue,
			{
				toValue: 1,
				tension: 0.2
			}
	    ).start(); 
	    setTimeout(()=>{
	    	this.state.bounceValue.setValue(0)
			this.setState({shadow:false})
	    },500)
	}

	_onPress1() {
		
	    this.props.navigator.push({id:'password'})
	}

	_onPress2() {
	    this.props.navigator.push({id:'areaConf'})
	}

	_onPress3() {
		deleteStorage('loginState');
	    this.props.navigator.resetTo({id:'login'})
	}
	
	_onPress4() {
	    this.props.navigator.push({id:'username'})
	}
}

var { width, height } = Dimensions.get('window');
var styles = {
	top: {
		height: 170,
		overflow: 'hidden',
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center'
	},
	userhead: {
		height: 90,
		width: 90,
		borderRadius: 45,
		borderWidth: 5,
		borderColor: '#E9E6E4',
		overflow: 'hidden',
	},
	username: {
		color: '#eee',
		marginTop: 10,
		fontSize: 15
	},
	infoBox: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		height: 60,
		paddingHorizontal: 10
	},
	infoSubBox: {
		flex: 1,
		marginVertical: 10,
		borderRightWidth: 1,
		borderColor: '#ddd',
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoText: {
		fontSize: 12
	},
	rowBox: {
		marginTop:10,
		backgroundColor: '#fff',
		height: 50,
		
	},
	rowSubBox: {
		flex: 1,
		flexDirection:'row',
		alignItems: 'center'
	},
	rowBoxIcon: {
		fontFamily: 'iconfont',
		color: '#0af',
		fontSize: 20,
		marginLeft: 30,
		marginRight: 20
	},
	rowBoxText: {
		flex: 1,
		color: '#999'
	},
	rowBoxArrow: {
		fontFamily: 'iconfont',
		color: '#999',
		fontSize: 20,
		marginRight: 15
	},
	shadow: {
		position: 'absolute',
		backgroundColor: '#fff',
		width: width,
		height: height,
		left: 0,
		top: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	openBoxAn: {
		width: 800,
		height: 800,
		backgroundColor: '#0af',
		borderRadius: 400,
		opacity: 0.5
	}
}

