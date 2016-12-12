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
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'#fff'}}>
				<NavBar leftBtn={true} leftOnPress={() => {this.props.navigator.pop()}} title='敲门记录'/>
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
		if (page === 11) {
			var rows = {}
			callback(rows, {
		  		allLoaded: true,
			});
		} else {
			getConversationList(global.loginState.username, page , 1, (data) => {
				
				callback(data);
			});
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
