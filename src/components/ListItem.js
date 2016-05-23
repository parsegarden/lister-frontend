import React from 'react';
import {
  Text,
  TweetListView,
  View,
  TouchableHighlight,
  StyleSheet,
  Image
} from 'react-native';

const UserListView = React.createClass({
  openListView() {
    this.props.openListView(this.props.data);
  },
  render() {
    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={'#f5f8fa'}
        onPress={this.openListView}
      >
        <View style={styles.listItem}>
          <View style={styles.leftSection}> 
            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {this.props.data.get('list_name')}
              </Text>
              <Text style={styles.author}>
                by {this.props.data.get('list_owner_author')}
              </Text>
            </View>
            <Text style={styles.memberCount}>
              {this.props.data.get('list_member_count')}
              &nbsp;
              {this.props.data.get('list_member_count') > 1 ? 'members': 'member'}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Image 
              style={styles.authorImage}
              source={{uri: this.props.data.get('list_owner_profile_image_url')}}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E1E8ED',
    alignItems: 'center'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 5
  },
  author: {
    fontSize: 12,
    marginRight: 5,
    color: '#8899a6'
  },
  memberCount: {
    fontSize: 11,
    marginRight: 5,
    color: '#8899a6'
  },
  userInfo: {
    flexDirection: 'row'
  },
  authorImage: {
    width: 34,
    height: 34,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
  },
  leftSection: {
    flexDirection: 'column',
    flex: 1
  },
  rightSection: {
    alignItems: 'center'
  },
});

export default UserListView;