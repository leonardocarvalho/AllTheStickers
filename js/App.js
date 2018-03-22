import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StackNavigator } from 'react-navigation';

import configureStore from './store';
import Home from './components/Home';
import ExchangeScreen from './components/ExchangeScreen';
import StickerStatus from './components/StickerStatus';
import StatusReader from './components/StatusReader';

const RootStack = StackNavigator(
  {
    Home: { screen: Home },
    Exchange: { screen: ExchangeScreen },
    StickerStatus: { screen: StickerStatus },
    StatusReader: { screen: StatusReader },
  },
  {
    initialRouteName: 'Home',
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
          <RootStack />
        </PersistGate>
      </Provider>
    );
  }
}
