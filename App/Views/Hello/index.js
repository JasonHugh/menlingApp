import React, {Component} from 'react'
import {
	View,
	StyleSheet,
	Image,
	Text,
	TouchableHighlight,
	Alert
} from 'react-native'

export default class HelloView extends Component {
	render() {
		return(
			<View style={styles.container}>
				<Text style={styles.title}>门铃</Text>
				<Image style={styles.logo} source={require('../../assets/logo.png')} />
				<TouchableHighlight style={styles.sendBtn} underlayColor='#71D54A' onPress={this._onPress.bind(this)}>
	            	<Text style={styles.btnText}>
	                	创建我的门铃
	              	</Text>
	          	</TouchableHighlight>
			</View>
		);
	}

	_onPress() {
		this.props.navigator.push({
		  id: 'login',
		  index: 1,
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