import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { StackNavigator, SafeAreaView } from 'react-navigation';

import Colors from '../common/colors';
import Emojis from '../common/emojis';
import StyleSheet from '../helpers/F8StyleSheet';


import SubmitButton from './SubmitButton';

class ExchangeScreen extends React.Component {

  static navigationOptions = {
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: "#ffffff",
      borderBottomWidth: 0,
      shadowColor: 'transparent',
      shadowRadius: 0,
      shadowOffset: {
          height: 0,
      }
    },
    headerTintColor: Colors.DARK_GREEN
  };


  render() {
    const toExchange = this.props.stickers.reduce((acc, s) => acc + Math.max(s.count - 1, 0), 0);
    const toComplete = this.props.stickers.reduce((acc, s) => acc + (s.count === 0), 0);

    return (
      <SafeAreaView style={styles.safeContainer}>

        <View style={styles.container}>
          <View>
            <Text style={[styles.title, styles.strong, styles.green]}>Trocar figurinhas</Text>
            <Text style={styles.subtitle}>
              Troque suas figurinhas repetidas ou encontre as
              figurinhas que faltam para completar seu álbum
            </Text>
          </View>
          <View>
            <Text style={styles.title}>
              Você tem
              <Text style={styles.strong}> {toExchange} figurinhas repetidas para trocar </Text>
              {Emojis.huggingFace}
            </Text>
            <Text style={styles.subtitle}>
              Compartilhe seu QR Code com seus amigos, e veja quais figurinhas vocês podem trocar
            </Text>
            <SubmitButton
              text="COMPARTILHAR MINHAS FIGURINHAS"
              color={Colors.DARK_GREEN}
              onPress={() => this.props.navigation.navigate('StickerStatus')}
            />
          </View>
          <View>
            <Text style={styles.title}>
              Você precisa de
              <Text style={styles.strong}> {toComplete} figurinhas para completar seu álbum </Text>
              {Emojis.rocket}
            </Text>
            <Text style={styles.subtitle}>
              Leia um QR code para encontrar as figurinhas disponíveis dos seus amigos
            </Text>
            <SubmitButton
              text="ENCONTRAR FIGURINHAS"
              color={Colors.DARK_GREEN}
              onPress={() => this.props.navigation.navigate('StatusReader')}
            />
          </View>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.back}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
};

const mapStateToProps = ({ stickers }) => ({ stickers });

export default connect(mapStateToProps)(ExchangeScreen);

const styles = StyleSheet.create({
  back: {
    color: Colors.DARK_GREY,
    fontFamily: 'Rubik-Medium',
  },
  backContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 16,
    alignItems: 'center',
  },
  safeContainer: {
    flex: 1,
  },
  green: {
    color: Colors.DARK_GREEN,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    paddingBottom: 8,
    color: Colors.DARK_GREY,
  },
  subtitle: {
    color: Colors.LIGHT_GREY,
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    paddingBottom: 12,
  },
  strong: {
    fontFamily: 'Rubik-Medium',
  },
});
