import React, { Component } from 'react'
import {
	View,
	Text
} from 'react-native'
import NavBar from '../../Components/NavBar'

export default class MyView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#fff'}}>
				<NavBar title="个人中心" />
			</View>
		)
	}
}