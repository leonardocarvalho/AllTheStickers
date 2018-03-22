import React from 'react';
import { View, Text } from 'react-native';

import Colors from '../common/colors';

import SubmitButton from './SubmitButton';

class ExchangeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <SubmitButton
          text="COMPARTILHAR MINHAS FIGURINHAS"
          color={Colors.DARK_GREEN}
          onPress={() => this.props.navigation.navigate('StickerStatus')}
        />
        <SubmitButton
          text="ENCONTRAR FIGURINHAS"
          color={Colors.DARK_GREEN}
          onPress={() => this.props.navigation.navigate('StatusReader')}
        />
      </View>
    );
  }
};


export default ExchangeScreen;
