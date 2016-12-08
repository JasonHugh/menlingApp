import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ToolbarAndroid,
  ListView,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Alert
} from 'react-native';
import NavBar from '../../Components/NavBar'
import {sendMessage,receiveMessage,getConvById} from '../../LeanCloud'
import PushAndroid from '../../PushAndroid'

export default class ChatView extends Component {
	constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
    if (loginState) {
      this.username = loginState.username;
    }
    this.state = {
      messages:[["和访客对话",0]],
      dataSource: ds.cloneWithRows([["和访客对话",0],]),
      message: "",
      loaded: true,
      inputTextMarginBottom: 0,   //键盘开启时marginBottom增大
      listHeight: 0,
      listFootY: 0,
    };
    //获取visitorID,customer
    PushAndroid.getVisitorId((msg) => {
        if (msg !== "" && msg !== null) {
          global.visitor = msg;
        }else{
          global.visitor = "";
        }
    });
    PushAndroid.getCustomer((msg) => {
        if (msg === "" || msg === null) {
          global.customer = "和访客对话";
        }else{
          global.customer = msg + ' 在敲门啦！';
        }
        this.setState({messages: [[global.customer,0]]})
        this.setState({dataSource: ds.cloneWithRows([[global.customer,0],])})
    });
    //获取convId,conversation
    PushAndroid.getConvId((msg) => {
      if (msg !== "" && msg !== null) {
        getConvById(this.username,msg,this);
      }
    });
    
    //从leancloud接收消息
    receiveMessage(this.username,this);
  }

  _renderRow(rowData: Array,sectionID: number, rowID: number) {
    if (rowData[1] == 0) {
      s = styles.alert
    } else if (rowData[1] == 1) {
      s = styles.send
    } else if (rowData[1] == 2) {
      s = styles.receive
    }
    return (<Text style={[styles.textBox,s]}>{rowData[0]}</Text>)
  } 

  _sendMessage() {
  	let message = this.state.message;
  	if (message) {
  		this._addMessage([message,1]);
      //发送到leancloud
      if (this.username && global.visitor) {
        sendMessage(this.username,message);
      }
      //恢复textinput初始状态
      this.setState({message:''});
  	}
  }

  _addMessage(message: Array) {
    this.state.messages[this.state.messages.length] = message;
    this.setState({dataSource:this.state.dataSource.cloneWithRows(this.state.messages)});
    //this._scrollListViewTo(this.state.listHeight);
  }

  render() {
  	if (!this.state.loaded) {
  		return this._renderLoadingView();
  	}
  	return this._renderChatView(); 
  }

  _renderChatView() {
  	return (
      <View style={styles.container}>
        <NavBar leftBtn={true} leftOnPress={() => {this.props.navigator.pop()}}/>
        <ListView
          ref='listView'
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          style={styles.listView}
          renderFooter={this._listRenderFooter.bind(this)}
          onLayout={(e)=>{this.setState({listHeight:e.nativeEvent.layout.height});}}
        />
        <View style={styles.footer,{alignItems: 'center',flexDirection:'row',marginBottom:this.state.inputTextMarginBottom}}>
          <TextInput
            style={styles.sendBox}
            placeholder="点击这里输入文字"
            onChangeText={(text) => this.setState({message:text})}
            value={this.state.message}
            onFocus={() => {this.setState({inputTextMarginBottom:280});}}
            onBlur={() => {this.setState({inputTextMarginBottom:0});}}
          />
          <TouchableOpacity style={styles.sendBtn} underlayColor={'#ff0000'} onPress={() => this._sendMessage()}>
              <Text style={styles.btnText}>
                  发送
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //每次渲染使listview显示最底部
  _listRenderFooter(){
    return <View onLayout={(e)=> {
      let footerY= e.nativeEvent.layout.y;
      this.setState({listFootY:footerY});
      let listHeight = this.state.listHeight;
      if (listHeight && footerY && footerY>listHeight) {
        let scrollDistance = listHeight - footerY;
        this._scrollListViewTo(-scrollDistance);
      }
    }}/>
  }

  _scrollListViewToBottom(){
    let footerY= this.state.listFootY;
    let listHeight = 50;
    if (listHeight && footerY && footerY>listHeight) {
      let scrollDistance = listHeight - footerY ;
      this._scrollListViewTo(-scrollDistance);
    }
  }

  _scrollListViewTo(num: int){
    this.refs.listView.scrollTo({y:num,animated:true});
  } 

  _renderLoadingView() {
  	return (
  		<View style={styles.loadingView}>
  			<Text style={styles.loading}>Loading</Text>
  		</View>
  	);
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },
  loadingView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
  },
  loading: {
    fontSize:16,
  },
  footer: {
    flex: 0,
    height: 60,
    backgroundColor:'#fff',
  },
  listView: {
    flex: 1,
    backgroundColor:'#ddd',
  },
  textBox: {
    fontSize: 16,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 5,
    padding:10,
    paddingLeft: 15,
    paddingRight: 15,
    color: '#00ff00',
    maxWidth: 300,
  },
  alert: {
    alignSelf: 'center',
    backgroundColor:'#0cf',
    color: '#444',
    padding:5,
    paddingHorizontal: 20,
    fontSize: 13,
    borderRadius: 15
  },
  send: {
    alignSelf: 'flex-end',
    marginLeft:50,
    backgroundColor:'#00ff00',
    color:'#000',
  },
  receive: {
    alignSelf: 'flex-start',
    marginRight:50,
    backgroundColor:'#fff',
    color: '#000',
  },
  title: {
    textAlign:'center',
    color:'#ff00ff',
    fontSize:20,
    fontWeight:'bold'
  },
  sendBox: {
    flex: 1,
    marginHorizontal: 10,
    height: 50,
  },
  sendBtn: {
    flex: 0,
    height:40,
    marginRight:10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#0f0',
  	justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
  }
});