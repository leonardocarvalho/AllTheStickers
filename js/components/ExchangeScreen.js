import React from  'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';

import { increaseStickerCount, decreaseStickerCount } from '../actions';

class ExchangeScreen extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      willReceive: [],
      willProvide: [],
    };
  }

  _performExchange() {
    this.state.willReceive.forEach(this.props.increaseStickerCount);
    this.state.willProvide.forEach(this.props.decreaseStickerCount);
    this.props.navigation.popToTop();
  }

  render() {
    const { stickers, peerStatus } = this.props;
    const { desired, available } = peerStatus;
    const desiredIHave = desired.filter(
      d => stickers.find(s => s.stickerNumber === d).count > 1
    );
    const availableINeed = available.filter(
      a => stickers.find(s => s.stickerNumber === a).count === 0
    );

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{JSON.stringify({ desiredIHave, availableINeed })}</Text>
        <TouchableOpacity onPress={() => this.props.navigation.popToTop()}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  ({ peerStatus, stickers }) => ({ peerStatus, stickers }),
  { increaseStickerCount, decreaseStickerCount },
)(ExchangeScreen);
