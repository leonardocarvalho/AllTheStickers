import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';

const SubmitButton = (props) => {
  let disabled = props.disabled || false;
  let opacity = disabled ? (props.disabledOpacity || 1) : 1;
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={disabled}
      activeOpacity={props.activeOpacity}>
      <View style={[styles.container, { backgroundColor: props.color, opacity: opacity }]}>
        <Text style={[styles.text, { color: props.textColor }]}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};
SubmitButton.propTypes = {
  activeOpacity: PropTypes.number,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  textColor: PropTypes.string,
};
SubmitButton.defaultProps = {
  textColor: Colors.WHITE,
  activeOpacity: 0.8,
};

export default SubmitButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
  },
});
