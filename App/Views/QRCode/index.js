import React,{Component} from 'react'
import {
	View,
	Text,
	StatusBar,
	BackAndroid
} from 'react-native'
import QRCode from 'react-native-qrcode'
import PushAndroid from '../../PushAndroid'
import NavBar from '../../Components/NavBar'

export default class QRCodeView extends Component {
	constructor(props){
		super(props);
		//获取installationId
		this.state = {
			url : 'http://www.hayson.top/menweb/index.php?id=',
			loading : true
		};
		PushAndroid.getInstallationId((msg) => {
			this.setState({url:'http://www.hayson.top/menweb/index.php?id=' + msg,loading:false});
		})
	}

	render(){
		if (this.state.loading) {
			return(
				<View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
					<Text>加载中...</Text>
				</View>
			)
		}else{
			return(
				<View style={{flex:1,backgroundColor:'#fff'}}>
					<NavBar leftBtn={true} leftOnPress={() => {this.props.navigator.pop()}}/>
					<Text style={{margin:20}}>屏幕截图，然后打印出二维码，贴于门上，访客扫一扫你就能接收到通知啦！</Text>
					<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
						<QRCode
			                value={this.state.url}
			                size={300}
			                bgColor='purple'
			                fgColor='white'/>
			        </View>
		        </View>
			)
		}
	}
}