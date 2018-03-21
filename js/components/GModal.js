import PropTypes from 'prop-types';
import React from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';

import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';

const StyleSheetPropType = require('StyleSheetPropType');
const ViewStylePropTypes = require('ViewStylePropTypes');

class GModal extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    containerStyles: StyleSheetPropType(ViewStylePropTypes),
    modalStyles: StyleSheetPropType(ViewStylePropTypes),
    onHide: PropTypes.func,
    onOverlayPress: PropTypes.func,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    visible: false,
    onHide: () => {},
    onOverlayPress: () => {},
  };

  constructor(props, ctx) {
    super(props, ctx);

    this._onShow = this._onShow.bind(this);
    this._onHide = this._onHide.bind(this);

    this.state = {
      animationController: new Animated.Value(props.visible ? 1 : 0),
      internalModalVisible: props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible && !nextProps.visible) {
      this._onHide();
    }
    if (!this.props.visible && nextProps.visible) {
      this.setState({ internalModalVisible: true });
    }
  }

  _onShow() {
    Animated.timing(this.state.animationController, {
      toValue: 1,
      duration: 400,
    }).start();
  }

  _onHide() {
    Animated.timing(this.state.animationController, {
      toValue: 0,
      duration: 400,
    }).start(() => {
      this.setState({ internalModalVisible: false });
      this.props.onHide();
    });
  }

  render() {
    const backgroundOpacity = this.state.animationController.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    });
    const modalOpacity = this.state.animationController.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Modal
        transparent
        onRequestClose={this._onHide}
        onShow={this._onShow}
        visible={this.state.internalModalVisible}
      >
        <View style={[styles.container, this.props.containerStyles]}>
          <TouchableWithoutFeedback onPress={this.props.onOverlayPress}>
            <Animated.View style={[styles.background, { opacity: backgroundOpacity }]} />
          </TouchableWithoutFeedback>
          <View style={this.props.containerStyles}>
            <Animated.View
              style={[styles.modal, this.props.modalStyles, { opacity: modalOpacity }]}
            >
              {this.props.children}
            </Animated.View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default GModal;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.BLACK,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 4,
    android: {
      elevation: 1,
    },
    ios: {
      shadowColor: Colors.BLACK,
      shadowRadius: 6,
      shadowOpacity: 0.3,
      shadowOffset: {
        height: 2,
        width: 0,
      },
    },
  },
});
