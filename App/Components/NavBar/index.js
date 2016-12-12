import React, {Component} from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StatusBar
} from 'react-native'

export default class NavBarComp extends Component {
	constructor(props) {
		super(props);
		if (this.props.title) {
			this.title = this.props.title
		}else{
			this.title = "简单门铃"
		}
	}

	_leftBtn() {
		if (this.props.leftBtn) {
			return (
				<Text style={styles.leftButtonText}>&#xe697;</Text>
			)
		}
	}

	_rightBtn() {
		if (this.props.rightBtn) {
			return (
				<Text style={styles.rightButtonText}>&#xe6bf;</Text>
			)
		}
	}

	_leftOnPress() {
		if (this.props.leftOnPress) {
			return this.props.leftOnPress
		}else{
			return
		}
	}

	_rightOnPress() {
		if (this.props.rightOnPress) {
			return this.props.rightOnPress
		}else{
			return
		}
	}

	render() {
		return (
			<View style={styles.navBar}>
	          	<TouchableOpacity style={styles.navButton}
	          		onPress={this._leftOnPress()}>
	            	{this._leftBtn()}
	          	</TouchableOpacity>
	            	<Text style={styles.title}>{this.title}</Text>
	          	<TouchableOpacity style={styles.navButton}
	          	  	onPress={this._rightOnPress()}>
	          	  	{this._rightBtn()}
	          	</TouchableOpacity>
	        </View>
		)
	}
}

const styles = {
  	navBar: {
  	  flex: 0,
  	  height:50,
  	  justifyContent:'center',
  	  alignItems: 'center',
  	  backgroundColor: '#E46D65',
  	  flexDirection: 'row',
  	},
  	navButton: {
  	  flex: 0,
  	  width: 50,
  	  margin: 10
  	},
  	leftButtonText: {
  	  fontSize: 30,
  	  fontFamily: 'iconfont',
  	  color:'#666666'
  	},
  	title: {
  	  flex: 1,
  	  textAlign:'center',
  	  color:'#fff',
  	  fontSize:16,
  	  fontWeight:'bold'
  	},
  	rightButtonText: {
  	  fontSize: 26,
  	  fontFamily: 'iconfont',
  	  color:'#666666'
  	},
}