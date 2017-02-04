import React,{Component} from 'react';
import {
	View,
	Text,
    BackAndroid
} from 'react-native';
import NavBar from '../../Components/NavBar'

export default class VillageView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#fff'}} >
				<NavBar title='小区动态' />
			</View>
		)
	}
}