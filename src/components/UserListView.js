import React from 'react';
import {
  ListView,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  InteractionManager,
  RefreshControl
} from 'react-native';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import actions from '../actions';
import ListItem from './ListItem';
import { clearUserListCache } from '../utils/core';

const ds = new ListView.DataSource({
  rowHasChanged(r1, r2) {
    return !Immutable.is(r1, r2);
  }
});

const UserListView = React.createClass({
  getInitialState() {
    return {
      'data': ds.cloneWithRows([]),
      'isLoading': true,
      'isRefreshing': false,
      'renderPlaceholderOnly': true,
      'styles': this.props.theme === 'LIGHT' ? lightStyles : darkStyles
    };
  },

  componentWillMount() {

    GoogleAnalytics.trackScreenView('User Lists');

    this.isMounted = true;
    this.props.actions.fetchUserLists({
      'userId': this.props.userId,
      'cookie': this.props.cookie
    });
    this.setupListData(this.props);
  },

  componentWillUnmount() {
    this.isMounted = false;
  },

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (this.isMounted) {
        this.setState({
          renderPlaceholderOnly: false
        });
      }
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setupListData(nextProps);
  },

  setupListData(props) {
    const data = props.UserList.get('records');
    const isLoading = props.UserList.get('isFetching');
    const isRefreshing = props.UserList.get('isRefreshing');
    const isLoggedOut = props.UserList.get('isLoggedOut');
    if (isLoggedOut) {
      return this.props.doLogout();
    }
    this.setState({
      'data': ds.cloneWithRows(data.toArray()),
      'isLoading': isLoading,
      'isRefreshing': isRefreshing
    });
  },

  openListView(listItem) {
    GoogleAnalytics.trackEvent('Click', 'Show List Timeline');
    this.props.navigator.push({
      'name': 'TweetListView',
      listItem
    });
  },

  renderRefreshControl() {
    return (
      <RefreshControl
        style={this.state.styles.refreshControl}
        refreshing={this.state.isRefreshing}
        onRefresh={this.onUserListRefresh}
        title="Updating your lists..."
        titleColor="#8899A6"
      />
    );
  },

  renderListItem(listItem) {
    return (
      <ListItem data={listItem}
        openListView={this.openListView}
        theme={this.props.theme}
      />
    );
  },

  onUserListRefresh() {
    GoogleAnalytics.trackEvent('Refresh', 'Refresh User Lists');

    this.setState({
      'isRefreshing': true
    });

    clearUserListCache(() => {
      this.props.actions.fetchUserLists({
        'userId': this.props.userId,
        'cookie': this.props.cookie,
        'noCache': true
      });
    });
  },

  render() {
    if (this.state.isLoading || this.state.renderPlaceholderOnly) {
      return (
        <View style={this.state.styles.loading}>
          <ActivityIndicatorIOS
            animating={true}
            size="small"
          />
        </View>
      );
    } else {
      return (
        <View style={this.state.styles.listView}>
          <ListView
            dataSource={this.state.data}
            refreshControl={this.renderRefreshControl()}
            renderRow={this.renderListItem}
            enableEmptySections={true}
          />
        </View>
      );
    }
  },
});

const darkStyles = StyleSheet.create({
  listView: {
    paddingTop: 64,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#192633'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#192633'
  },
  refreshControl: {
    backgroundColor: '#24374A'
  }
});

const lightStyles = StyleSheet.create({
  listView: {
    paddingTop: 64,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  refreshControl: {
    backgroundColor: '#F5F8FA'
  }
});

function mapStateToProps(state) {
  return {
    'UserList': state.UserList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    'actions': bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
