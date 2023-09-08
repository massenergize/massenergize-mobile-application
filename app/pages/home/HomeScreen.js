import {View, Text} from 'react-native';
import React from 'react';
import TabNavigator from '../../components/tab/TabNavigator';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const Home = ({}) => {
  return (
    <View>
      {/* <Text>This is meant to be the home page</Text>  */}
      <TabNavigator />
    </View>
  );
};

const mapStateToProps = state => {
  return {test: state.test};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
