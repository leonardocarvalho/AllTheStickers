import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { addCard }  from '../actions';

class Home extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{JSON.stringify(this.props.cards)}</Text>
        <TouchableOpacity onPress={this.props.addCard} style={{ backgroundColor: 'red' }}>
          <Text>Adicionar Neymar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  cards: state.cards,
});

export default connect(mapStateToProps, { addCard })(Home);
