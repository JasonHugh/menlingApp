import React, {Component} from 'react'
import {
	View,
	Text,
	Alert,
	TouchableOpacity,
	Animated,
	Easing,
	Image,
	TouchableWithoutFeedback,
	Dimensions,
	ViewPagerAndroid,
	ListView,
	TouchableHighlight,
	WebView,
	Modal,
	BackAndroid
} from 'react-native'
import NavBar from '../../Components/NavBar'
import GiftedListView from 'react-native-gifted-listview'


export default class HomeView extends Component {
	constructor(props) {
		super(props);
    	var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
		this.tabBtnNum = 125;
		this.state = {
			tabBtnLeft: new Animated.Value(0),
			tabBtnCurLeft: this.tabBtnNum,
			tabPage: 1,
			modalVisible: false,
			url: 'http://36kr.com/p/5055297.html'
		}
	}
	//重写后退键
	componentDidMount() {
		BackAndroid.addEventListener('hardwareBackPress',() => {
			let routers = this.props.navigator.getCurrentRoutes();
			let top = routers[routers.length - 1];
   			if (top.id != 'home') {
   				if (top.id == 'chat') {
   					this.props.navigator.jumpBack();
   				}else{
   					this.props.navigator.pop();
   				}
   				
   				return true;
   			}
   			return false
		});
	}

	_renderRowView(rowData) {
		Date.prototype.Format = function (fmt) {  
		    var o = {
		        "M+": this.getMonth() + 1, //月份 
		        "d+": this.getDate(), //日 
		        "h+": this.getHours(), //小时 
		        "m+": this.getMinutes(), //分 
		        "s+": this.getSeconds(), //秒 
		        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		        "S": this.getMilliseconds() //毫秒 
		    };
		    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		    for (var k in o)
		    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    return fmt;
		}
	    return (
	    	<TouchableHighlight underlayColor='#c8c7cc'>
		    	<View style={styles.newsBox}>
		    		<Text style={[styles.newsTitle]}>{rowData.content}</Text>
		    		<Text style={[styles.newsTime]}>{new Date(parseInt(rowData.published_at)*1000).Format("yyyy-MM-dd hh:mm:ss")}</Text>
		    	</View>
	    	</TouchableHighlight>
	    )
	} 

	async _onFetch(page = 1, callback, options) {
  		try {
	      	let response = await fetch('http://m2.qiushibaike.com/article/list/suggest?page='+page+'&type=refresh&count=30');
	      	let responseJson = await response.json();
	      	let rows = responseJson.items;
	      	await callback(rows);
	    } catch(error) {
	      console.error(error);
	    }
      	
    }

	render() {
		return (
			<View style={styles.container}>
				<NavBar/>
		        <View style={{flex: 0,backgroundColor: '#E46D65',}}>
			        <TouchableWithoutFeedback
			        	onPress={this._tabOnPress.bind(this)}>
			        	<View style={styles.tabBar}>
				        	<Animated.Text style={[styles.tabActive,{left: this.state.tabBtnLeft}]}
				        		onPress={() => {}}/>
		        			<Text style={{position:'absolute',right:30,top:2,color:'#fff'}}>糗事百科</Text>
			        	</View>
			        </TouchableWithoutFeedback>
			    </View>
			    <ViewPagerAndroid style={styles.tabPageBox}
			     	onPageSelected={this._tabOnPress.bind(this)}
			    	ref='viewPage'>
			    	<View>
				        <View style={[styles.tabPage]}>
			    			<TouchableOpacity style={{flex:1,backgroundColor:'#0cf'}}
			    			 	activeOpacity = {0.5}
			        			onPress={this._pageOnPress.bind(this)}>
					        	<View style={styles.textBox}>
					        		<Text style={{fontSize:20,color:'#fff'}}>
					        			对话来访者
					        		</Text>
					        	</View>
			        		</TouchableOpacity>
			    			<TouchableOpacity style={{flex:1,backgroundColor:'#FF6666'}}
			    			 	activeOpacity = {0.5}
			        			onPress={this._pageOnPress1.bind(this)}>
					        	<View style={styles.textBox}>
					        		<Text style={{fontSize:16,color:'#fff'}}>
					        			门铃号：{loginState.username}
					        		</Text>
					        		<Text style={{fontSize:20,color:'#fff'}}>
					        			门铃二维码
					        		</Text>
					        	</View>
			        		</TouchableOpacity>
				        </View>
				    </View>
			    	<View>
				        <View style={[styles.tabPage,{margin:0}]}>
				        	<GiftedListView
					          	enableEmptySections={true}
				                rowView={this._renderRowView.bind(this)}
				                onFetch={this._onFetch.bind(this)}
				                firstLoader={true}
				                pagination={true} 
				                refreshable={true} 
				                withSections={false}
					          	paginationWaitingView={this._renderPaginationWaitingView.bind(this)}
					        />
				        </View>
				        <Modal
		                    visible={this.state.modalVisible}
		                    animationType = {'fade'}
		                    transparent = {true}
		                    style={{zIndex:2}}
		                >
		                	<View style={{borderRadius: 23,zIndex:1,alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'#E46D65',opacity:0.6,width:46,height:46,bottom:30,right:30}}>
	                    		<Text style={{fontSize:14,color:'#fff'}} onPress={()=> this.setState({modalVisible: false})}>关闭</Text>
	                    	</View>
			                <View style={{flex:1, backgroundColor:'transparent'}}>
		                    	<WebView
							        source={{uri:this.state.url}}
							        startInLoadingState={true}
							        domStorageEnabled={true}
							        javaScriptEnabled={true}
							        >
						      	</WebView>
	                    	</View>
		                </Modal>
				    </View>
			    </ViewPagerAndroid>
			</View>
		);
	}

	_renderPaginationWaitingView(paginateCallback) {
	    return (
	      <TouchableHighlight 
	        underlayColor='#0cf'
	        onPress={paginateCallback}
	        style={styles.paginationView}
	      >
	        <Text style={styles.actionsLabel}>
	          加载更多
	        </Text>
	      </TouchableHighlight>
	    );
	}

	_pageOnPress() {
		let routers = this.props.navigator.getCurrentRoutes();
		if (routers[1]) {
			this.props.navigator.jumpForward();
		}else{
			this.props.navigator.push({
		  		id: 'chat'
			});
		}
		
		
	}

	_pageOnPress1() {
		this.props.navigator.push({
	  		id: 'qrcode'
		});
	}

	_tabOnPress() {
		this.setState({tabBtnCurLeft: this.state.tabBtnCurLeft==0?this.tabBtnNum:0,
						tabPage: this.state.tabPage==1?0:1});
		this.refs.viewPage.setPage(this.state.tabPage)
		Animated.parallel([
			Animated.timing(this.state.tabBtnLeft, {
	            toValue: this.state.tabBtnCurLeft, // 目标值
	            duration: 50, // 动画时间
	            easing: Easing.linear // 缓动函数
	        })
		]).start();
	}

}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    paginationView: {
	    height: 44,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#FFF',
	},
	actionsLabel: {
		fontSize: 13
	},
    tabBar: {
    	borderWidth: 1,
    	alignSelf: 'center',
    	borderColor: '#D5693B',
    	backgroundColor: '#D48564',
    	margin: 10,
    	width: 250,
    	height: 30,
    	borderRadius: 20,
    	opacity: 0.8,
    	shadowColor: '#000'
    },
    tabActive: {
    	backgroundColor: '#9B493D',
    	width: 125,
    	height: 30,
    	borderRadius: 20,
    	position: 'relative',
    	left: 0,
    	top: 0,
    },
    tabPageBox: {
    	flex: 1,
    	padding: 30
    },
    tabPage: {
    	backgroundColor: '#fff',
    	margin: 30,
    	flex: 1
    },
    imageBox: {
    	flex: 1,
    	alignItems:'flex-end',
    	justifyContent: 'flex-start'
    },
    pageImg: {
		resizeMode: 'contain'
    },
    textBox: {
    	flex:1,
    	alignItems:'center',
    	justifyContent: 'center'
    },
    newsBox: {
    	justifyContent:'center',
    	paddingHorizontal: 20,
    	paddingVertical: 10,
    	borderBottomWidth: 1,
    	borderColor: '#aaa'
    },
    newsTitle:{
    	fontSize:14,
		color:'#333'
    }
}