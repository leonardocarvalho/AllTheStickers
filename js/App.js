import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from './store';
import Home from './components/Home';


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
          <Home />
        </PersistGate>
      </Provider>
    );
  }
}
