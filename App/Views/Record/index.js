import React, { Component } from 'react'
import {
	Text,
	View,
	TouchableHighlight
} from 'react-native'
import NavBar from '../../Components/NavBar'
import GiftedListView from 'react-native-gifted-listview'
import { getConversationList } from '../../LeanCloud'

export default class Record extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		var record = this;
		//获取并缓存敲门记录
		getConversationList(global.loginState.username, 1, 20, (data) => {record.setState({data:data})});
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#fff'}}>
				<NavBar leftBtn={true} leftOnPress={() => {this.props.navigator.pop()}} title='近20天敲门记录'/>
				<GiftedListView
		          	enableEmptySections={true}
	                rowView={this._renderRowView.bind(this)}
	                onFetch={this._onFetch.bind(this)}
	                firstLoader={true}
	                pagination={true} 
	                refreshable={true} 
	                withSections={true}
		          	sectionHeaderView={this._renderSectionHeaderView.bind(this)}
		          	paginationWaitingView={this._renderPaginationWaitingView.bind(this)}
		        />
			</View>
		);
	}

	_onFetch(page = 1, callback, options) {
		if (page === 5) {
			var rows = {}
			callback(rows, {
		  		allLoaded: true,
			});
		} else {
			setTimeout(() => {
				if (this.state.data) {
					var pageSize = 5,
						day,
						offset = (page - 1) * pageSize,
						data = [];
					for (var i = 0; i < pageSize; i++) {
						day = new Date(Date.now() - (offset+i) * 24 * 3600 * 1000).Format("yyyy年MM月dd日")
						if (this.state.data[day]) {
							data[day] = this.state.data[day];
						}else {
							data[day] = [{name:"今天没有人敲门",time:""},]
						}
					}
					callback(data);
				}
			},500)
		}
		
	}

	_renderRowView(rowData) {
		return (
			<TouchableHighlight
				style={styles.row}
				underlayColor='#c8c7cc'
				onPress={() => this._onPress(rowData)}
			>
				<View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
					<Text style={{flex:1}}>{rowData.name}</Text>
					<Text style={{flex:1,textAlign:'right'}} >{rowData.time}</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_onPress(rowData) {

	}

	_renderSectionHeaderView(sectionData, sectionID) {
		return (
			<View style={styles.header}>
				<Text style={styles.headerTitle}>
				  	{sectionID}
				</Text>
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
			  		更早记录
				</Text>
			</TouchableHighlight>
	    );
	}
}

var styles = {
  refreshableView: {
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsLabel: {
    fontSize: 14,
    color: '#007aff',
  },
  paginationView: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  row: {
  	marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    paddingLeft: 20,
    paddingVertical: 5,
    marginTop: 10,
  },
  headerTitle: {
    color: '#aaa',
  },
};
