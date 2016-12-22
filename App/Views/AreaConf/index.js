import React, {Component} from 'react'
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

export default class AreaConfView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#fff'}} >
				<NavBar leftBtn={true} leftOnPress={() => {this.props.navigator.pop()}} title="设置小区"/>
			</View>
		)
	}
}