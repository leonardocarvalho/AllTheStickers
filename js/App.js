import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StackNavigator, SafeAreaView } from 'react-navigation';
import firebase from 'react-native-firebase';

import StyleSheet from './helpers/F8StyleSheet';
import Colors from './common/colors';
import configureStore from './store';
import Intro from './components/Intro';
import Home from './components/Home';
import ExchangeOptionsScreen from './components/ExchangeOptionsScreen';
import ExchangeScreen from './components/ExchangeScreen';
import StickerStatus from './components/StickerStatus';
import StatusReader from './components/StatusReader';

import screenLogger from './helpers/screenLogger';


const RootStack = StackNavigator(
  {
    // Can't be smart here because keys can be minified in production
    Intro: { screen: screenLogger(Intro, 'Intro') },
    Home: { screen: screenLogger(Home, 'Home') },
    ExchangeOptions: { screen: screenLogger(ExchangeOptionsScreen, 'ExchangeOptionsScreen') },
    StickerStatus: { screen: screenLogger(StickerStatus, 'StickerStatus') },
    StatusReader: { screen: screenLogger(StatusReader, 'StatusReader') },
    Exchange:  { screen: screenLogger(ExchangeScreen, 'ExchangeScreen') },
  },
  {
    initialRouteName: 'Intro',
    cardStyle: {
      shadowColor: Colors.TRANSPARENT,
    },
    navigationOptions: {
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
      }
    },
  },
);


export default class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      store: null,
      persistor: null,
    };
  }

  async componentDidMount() {
    const { store, persistor } = await configureStore();
    this.setState({ store, persistor });

    const setupUser = (userId) => {
      const analytics = firebase.analytics();
      analytics.setAnalyticsCollectionEnabled(true);
      analytics.setUserId(userId);
    }

    let userId = store.userId;
    if (userId) {
      setupUser(userId);
    }
    store.subscribe(() => {
      const newUserId = store.getState().userId;
      if (newUserId !== userId) {
        setupUser(newUserId);
      }
    });
  }

  render() {
    if (!this.state.store) return null;

    return (
      <Provider store={this.state.store}>
        <PersistGate loading={null} persistor={this.state.persistor}>
            <RootStack />
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
