import React from 'react';
import firebase from 'react-native-firebase';
import hoistStatics from 'hoist-non-react-statics';

export default (Component) => {

  class ScreenLogger extends React.Component {
    static displayName = Component.displayName;

    componentDidMount() {
      this._listener = this.props.navigation.addListener(
        'didFocus',
        () => firebase.analytics().setCurrentScreen(Component.displayName),
      );
    }

    componentWillUnmount() {
      this._listener.remove();
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return hoistStatics(ScreenLogger, Component);
};
