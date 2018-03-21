import PropTypes from 'prop-types';
import React from 'react';
import { Animated, Easing } from 'react-native';

import GModal from '../components/GModal';
import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';

const StyleSheetPropType = require('StyleSheetPropType');
const ViewStylePropTypes = require('ViewStylePropTypes');

class BottomModal extends React.PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    containerStyles: StyleSheetPropType(ViewStylePropTypes),
    onDismissRequest: PropTypes.func.isRequired,
    testID: PropTypes.string,
    visible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    backgroundColor: Colors.WHITE,
    testID: 'bottom-modal',
    useFlexEnd: true,
  };

  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      animationController: new Animated.Value(0),
    };

    this._onShow = this._onShow.bind(this);
    this._onHide = this._onHide.bind(this);
  }

  componentDidMount() {
    if (this.props.visible) this._onShow();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible && !nextProps.visible) {
      this._onHide();
    }
    if (!this.props.visible && nextProps.visible) {
      this._onShow();
    }
  }

  _onShow() {
    Animated.timing(this.state.animationController, {
      toValue: 1,
      duration: 500,
      delay: 200,
      easing: Easing.out(Easing.cubic),
    }).start();
  }

  _onHide() {
    Animated.timing(this.state.animationController, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      this.props.onDismissRequest();
    });
  }

  render() {
    const buttonBottomStyle = {
      transform: [
        {
          translateY: this.state.animationController.interpolate({
            inputRange: [0, 1],
            outputRange: [375, 0],
          }),
        },
      ],
      backgroundColor: this.props.backgroundColor,
    };

    const buttonBottomChromebookStyle = {
      paddingBottom: 25,
    };

    return (
      <GModal
        containerStyles={[styles.container, this.props.containerStyles]}
        modalStyles={styles.modal}
        visible={this.props.visible}
        testID={this.props.testID}
        onOverlayPress={this.props.onDismissRequest}
      >
        <Animated.View style={buttonBottomStyle}>
          {this.props.children}
        </Animated.View>
      </GModal>
    );
  }
}

export { BottomModal };

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.TRANSPARENT,
  },
  container: {
    justifyContent: 'flex-end',
  },
});
