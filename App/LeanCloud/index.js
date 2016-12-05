import {Realtime,TextMessage} from 'leancloud-realtime'
import Conf from '../Utils/Conf'
import {Alert} from 'react-native'

const realtime = new Realtime({
  appId: 'nfxWSOjzkw6t3KMkBVsc5LMJ-gzGzoHsz',
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