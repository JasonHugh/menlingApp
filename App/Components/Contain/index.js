import React,{Component} from 'react';
import {
	View,
	Text,
    BackAndroid
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import HomeView from '../../Views/Home' 
import RecordView from '../../Views/Record' 
import ChatView from '../../Views/Chat' 
import { login } from '../../LeanCloud'
import MyView from '../../Views/My'

export default class ContainComp extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	selectedTab: "home"
        }
        //lencloud 登陆
        login(global.loginState.username);
    }


    //重写后退键
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress',() => {
            let routers = this.props.navigator.getCurrentRoutes();
            let top = routers[routers.length - 1];
            if (top.id != 'contain') {
                this.props.navigator.pop();
                
                return true;
            }
            return false
        });
    }

	render() {

		return (
			<View style={styles.footer}>
				<TabNavigator tabBarStyle={{backgroundColor:'#E46D65'}}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'home'}
                        title="门铃"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Text style={styles.navIcon}>&#xe501;</Text>}
                        renderSelectedIcon={() => <Text style={[styles.navIcon,{color:'#0af'}]}>&#xe501;</Text>}
                        onPress={() => this.setState({ selectedTab: 'home' })}>
                        <HomeView navigator={this.props.navigator} route={this.props.route}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'record'}
                        title="记录"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Text style={styles.navIcon}>&#xe6bf;</Text>}
                        renderSelectedIcon={() => <Text style={[styles.navIcon,{color:'#0af'}]}>&#xe6bf;</Text>}
                        onPress={() => this.setState({ selectedTab: 'record' })}>
                        <RecordView navigator={this.props.navigator} route={this.props.route}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'my'}
                        title="我的"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Text style={styles.navIcon}>&#xe6b8;</Text>}
                        renderSelectedIcon={() => <Text style={[styles.navIcon,{color:'#0af'}]}>&#xe6b8;</Text>}
                        onPress={() => this.setState({ selectedTab: 'my' })}>
                        <MyView navigator={this.props.navigator} route={this.props.route}/>
                    </TabNavigator.Item>
                </TabNavigator>
			</View>
		)
	}

	_OnPress1() {

	}
}

var styles = {
	footer: {
		flexDirection:'row',
		bottom:0, 
		left:0,  
		flex:1,
		borderTop: '1px solid #aaa',
	},
	navIcon: {
		flex: 1, 
		textAlign:'center',
		fontSize: 20,
		fontFamily: 'iconfont',
		color:'#fff'
	},
	tabText: {
        color:'#fff'
	},
	selectedTabText: {

	}
}