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
			curId: 0,
			modalVisible: false,
			url: 'http://36kr.com/p/5055297.html'
		}
	}

	_renderRowView(rowData) {
	    return (
	    	<TouchableHighlight underlayColor='#c8c7cc' onPress={()=>{this._onNewsPress(rowData.id)}}>
		    	<View style={styles.newsBox}>
		    		<Text style={[styles.newsTitle]}>{rowData.title.substr(0,40)}</Text>
		    		<Text style={[styles.newsTime]}>{rowData.published_at}</Text>
		    	</View>
	    	</TouchableHighlight>
	    )
	} 

	async _onNewsPress(id) {
		this.setState({modalVisible:true,url:'http://36kr.com/p/'+id+'.html'});
	}

	async _onFetch(page = 1, callback, options) {
      	if (page === 1) {
      		try {
		      	let response = await fetch('http://36kr.com/api/info-flow/main_site/posts?column_id=&per_page=20&');
		      	let responseJson = await response.json();
		      	let rows = responseJson.data.items;
		      	await callback(rows);
		      	await this.setState({'curId':rows[19].id});
		    } catch(error) {
		      console.error(error);
		    }
      	}else {
      		try {
		      	let response = await fetch('http://36kr.com/api/info-flow/main_site/posts?column_id=&b_id='+this.state.curId+'&per_page=20&');
		      	let responseJson = await response.json();
		      	let rows = responseJson.data.items;
		      	await callback(rows);
		      	await this.setState({'curId':rows[19].id});
		    } catch(error) {
		      console.error(error);
		    }
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
			        		<Text style={{position:'absolute',right:30,top:4,color:'#fff'}}>新闻资讯</Text>
			        	</View>
			        </TouchableWithoutFeedback>
			    </View>
			    <ViewPagerAndroid style={styles.tabPageBox}
			     	onPageSelected={this._tabOnPress.bind(this)}
			    	ref='viewPage'>
			    	<View>
				        <View style={[styles.tabPage,{backgroundColor:'#ddd',marginBottom:20}]}>
			    			<TouchableOpacity style={{flex:1,backgroundColor:'#0cf'}}
			    			 	activeOpacity = {0.5}
			        			onPress={this._pageOnPress.bind(this)}>
					        	<View style={styles.textBox}>
					        		<Text style={{fontSize:20,color:'#fff'}}>
					        			对话访客
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
				        	<Text style={{fontSize:8,backgroundColor:'#ddd',alignSelf:'center',marginTop:10}}>用户反馈邮箱：anyanhu@outlook.com</Text>
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
		this.props.navigator.push({
	  		id: 'chat'
		});
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
    	height:100,
    	justifyContent:'center',
    	paddingHorizontal: 20,
    	borderBottomWidth: 1,
    	borderColor: '#aaa'
    },
    newsTitle:{
    	fontSize:14,
		color:'#333'
    }
}