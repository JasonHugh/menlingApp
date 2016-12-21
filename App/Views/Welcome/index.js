import React, {Component} from 'react'
import {
	View,
	StyleSheet,
	Image,
	Text,
	TouchableHighlight,
	Alert
} from 'react-native'

export default class WelcomeView extends Component {
	constructor(props) {
		super(props);
		setTimeout(()=>{
			//判断用户是否登陆
			let firstViewId = 'login'
			if (global.loginState) {
				firstViewId = 'contain';
			}
			this._jump(firstViewId);
		},500);
	}

	render() {
		return(
			<View style={styles.container}>
				<Text style={styles.title}>简单门铃</Text>
				<Image style={styles.logo} source={require('../../assets/logo.png')} />
			</View>
		);
	}

	_jump(firstViewId) {
		this.props.navigator.push({
		  id: firstViewId
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#008F6E',
		justifyContent: 'center',
		alignItems: 'center'
	},
	logo: {
		height: 100,
		width:100,
	},
	title: {
		color: '#fff',
		fontSize: 20,
		marginBottom: 50
	},
	sendBtn: {
	    height:60,
	    paddingHorizontal: 60,
	    borderRadius: 10,
	    backgroundColor: '#008263',
	  	justifyContent: 'center',
    	marginTop: 50,
    	borderWidth: 1,
    	borderColor: '#fff',
    	opacity: 0.8
  	},
  	btnText: {
    	color: '#fff',
    	fontSize: 16,
  	}
})