import React from  'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';

import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';

const DevOperations = (props) => {
  _button = (text, action) => (
    <TouchableOpacity
      onPress={() => props.dispatch(action)}
      style={styles.actionButton}
    >
      <Text style={styles.actionLabel}>{text}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dev Operations</Text>
      <View style={styles.actionsContainer}>
        {this._button('Reset Intro State', { type: 'INTRO_RESET' })}
        {this._button('Clear stickers', { type: 'CLEAR_STICKERS' })}
      </View>
    </View>
  )
};


export default connect()(DevOperations);

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Rubik-Bold',
    color: Colors.DARK_GREY,
  },
  actionButton: {
    backgroundColor: Colors.DARK_GREEN,
    flexGrow: 0,
    margin: 2,
    padding: 3,
    borderRadius: 3,
  },
  actionLabel: {
    color: Colors.WHITE,
    fontFamily: 'Rubik-Medium',
  },
});
