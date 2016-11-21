import {Realtime,TextMessage} from 'leancloud-realtime'
import Conf from '../Utils/Conf'
import {Alert} from 'react-native'

const realtime = new Realtime({
  appId: 'nfxWSOjzkw6t3KMkBVsc5LMJ-gzGzoHsz',
  region: 'cn', 
});

var conversation = null;
export function sendMessage(username,message,sendTo) {
	realtime.createIMClient(username).then(function(user) {
	  // 创建与Jerry之间的对话
	  return user.createConversation({
	    members: [sendTo],
	    name: username+' & '+sendTo,
	  });
	}).then(function(conversation) {
	  // 发送消息
	  conversation = conversation.send(new TextMessage(message));
	}).then(function(message) {
	  console.log(username+' & '+sendTo, message);
	}).catch(console.error);
}

export function getMessage(username) {
	let message = "";
	realtime.createIMClient(username).then(function(user) {
	  user.on('message', function(message, conversation) {
	  	console.log(username, message.text);
	  });
	}).catch(console.error);
	return message;
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