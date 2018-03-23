import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StackNavigator, SafeAreaView } from 'react-navigation';

import StyleSheet from './helpers/F8StyleSheet';
import Colors from './common/colors';
import configureStore from './store';
import Intro from './components/Intro';
import Home from './components/Home';
import ExchangeScreen from './components/ExchangeScreen';
import StickerStatus from './components/StickerStatus';
import StatusReader from './components/StatusReader';


const RootStack = StackNavigator(
  {
    Intro: { screen: Intro },
    Home: { screen: Home },
    Exchange: { screen: ExchangeScreen },
    StickerStatus: { screen: StickerStatus },
    StatusReader: { screen: StatusReader },
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
  }

  render() {
    if (!this.state.store) return null;

    return (
      <Provider store={this.state.store}>
        <PersistGate loading={null} persistor={this.state.persistor}>
          <SafeAreaView style={styles.container}>
            <RootStack />
          </SafeAreaView>
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
