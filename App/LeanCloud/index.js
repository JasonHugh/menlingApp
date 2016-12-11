import {Realtime,TextMessage} from 'leancloud-realtime'
import Conf from '../Utils/Conf'
import {Alert} from 'react-native'

const realtime = new Realtime({
  appId: Conf.leanCloudId,
  region: 'cn', 
});

export function sendMessage(username,message) {
	if (global.conversation) {
		global.conversation.send(new TextMessage(JSON.stringify({text:message,from:username})))
		.then(function(message) {

		}).catch(console.error);
	}else{
		if (global.visitor) {
			getConvByUser(username,global.visitor,message);
		}
	}
}

export function receiveMessage(username,chatView) {
	realtime.createIMClient(username).then(function(user) {
		user.on('message', function(message, conversation) {
			message = JSON.parse(message.text);
			let text = message.text;
			global.visitor = message.from;
			chatView.state.messages[chatView.state.messages.length] = [text,2];
			chatView.setState({dataSource:chatView.state.dataSource.cloneWithRows(chatView.state.messages)});
		});
	}).catch(console.error);

}


//根据ID获取对话
export function getConvById(username,conv_id,chatView){
	realtime.createIMClient(username).then(function(v) {
		v.getConversation(conv_id).then(function(conversation) {
		  	global.conversation = conversation
			getPastMessage(conversation,chatView)
		}).catch(console.error.bind(console));
	}).catch(console.error);
}

//根据用户获取对话,接着发消息
function getConvByUser(username,visitor,message){
	realtime.createIMClient(username).then(function(v) {
		v.getQuery().limit(1).containsMembers([visitor]).find().then(function(conversations) {
			// 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
			global.conversation = conversations[0];
			global.conversation.send(new TextMessage(JSON.stringify({text:message,from:username})))
			.then(function(message) {

			}).catch(console.error);
		}).catch(console.error.bind(console));
	}).catch(console.error);
}

//获取过去的消息
function getPastMessage(conversation,chatView){
	//收取之前的聊天记录
	conversation.queryMessages({
	  	limit: 10, // limit 取值范围 1~1000，默认 20
	}).then(function(messages) {
		for (let i = 0, max = messages.length; i < max; i++) {
			let message = JSON.parse(messages[i].text);
			if (message.from === global.visitor) {
				chatView.state.messages[chatView.state.messages.length] = [message.text,2];
			}else{
				chatView.state.messages[chatView.state.messages.length] = [message.text,1];
			}
			chatView.setState({dataSource:chatView.state.dataSource.cloneWithRows(chatView.state.messages)});
		}
	}).catch(console.error.bind(console));
}

//获取聊天记录
export function getConversationList(username, page , pageSize,callback) {
	realtime.createIMClient(username).then(function(v) {
		var offset = (page - 1) * pageSize
		var today = new Date(new Date(Date.now() - (offset-1) * 24 * 3600 * 1000).Format("yyyy-MM-dd"));
		var fromday = new Date(new Date(today.getTime() - (pageSize) * 24 * 3600 * 1000).Format("yyyy-MM-dd"));
		v.getQuery().greaterThan('createdAt', fromday).lessThan('createdAt', today).limit(20).containsMembers([username]).find().then(function(conversations) {
			// 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
			var data = {};
			for (var i = conversations.length - 1; i >= 0; i--) {
				var createAt = new Date(conversations[i].createdAt);
				var createDate = createAt.Format("yyyy年MM月dd日");
				var createTime = createAt.Format("hh:mm:ss");
				if (!data[createDate]) {
					data[createDate] = [{name:conversations[i].members[0],time:createTime},]
				}else {
					data[createDate].push({name:conversations[i].members[0],time:createTime})
				}
			}
			console.log('today',today)
			console.log('fromday',fromday)
			console.log('row',JSON.stringify(data));
			callback(data);
		}).catch(console.error.bind(console));
	}).catch(console.error);
}

export function createConversation(username,sendTo) {
	realtime.createIMClient(username).then(function(user) {
	  return user.createConversation({
	    members: [username, sendTo],
	  });
	}).then(function(conversation) {
	  var CONVERSATION_ID = conversation.id;
	  // now we have jerry, conversation and CONVERSATION_ID
	})
}

export async function install() {
	var time = new Date().getTime();
	console.info(time);
	try {
      	let response = await fetch('https://leancloud.cn/1.1/installations', {
		  	method: 'POST',
		  	headers: {
		  	  	'Accept': 'application/json',
		  	  	'Content-Type': 'application/json',
			    'X-LC-Id': Conf.leanCloudId,
			    'X-LC-Key': Conf.leanCloudKey
		  	},
		  	body: JSON.stringify({
		        "deviceType": "android",
		        "installationId": time+'abcd',
		        "channels": [
		          "public", "protected", "private"
		        ]
	      	})
	  	});
      	let responseJson = await response.json();
      	await alert(responseJson.objectId)
    } catch(error) {
      console.error(error);
    }
}

Date.prototype.Format = function(fmt)   
{
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  