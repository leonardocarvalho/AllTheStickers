import React from  'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import _ from 'lodash';
import firebase from 'react-native-firebase';

import Colors from '../common/colors';
import Emojis from '../common/emojis';
import StyleSheet from '../helpers/F8StyleSheet';
import { increaseStickerCount, decreaseStickerCount } from '../actions';
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

  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      willReceive: [],
      willProvide: [],
    };
    this._toggleToProvide = this._toggleToProvide.bind(this)
    this._toggleToReceive = this._toggleToReceive.bind(this)
  }

  _performExchange() {
    const { willReceive, willProvide } = this.state;
    firebase.analytics().logEvent(
      'sticker_exchange',
      { given: willProvide.length, received: willReceive.length }
    );
    willReceive.forEach((stickerNumber) => this.props.increaseStickerCount(stickerNumber, 1));
    willProvide.forEach((stickerNumber) => this.props.decreaseStickerCount(stickerNumber, 1));
    this.props.navigation.popToTop();
  }

  _toggleToReceive(stickerNumber) {
    this.setState({
      willReceive: _.xor(this.state.willReceive, [stickerNumber])
    })
  }

  _toggleToProvide(stickerNumber) {
    this.setState({
      willProvide: _.xor(this.state.willProvide, [stickerNumber])
    })
  }

  _renderStickerItem(stickerNumber, selected, onStickerPress) {
    if (stickerNumber < 0) {
      return (
        <View style={styles.stickerItemContainer} />
      );
    }
    return (
      <TouchableOpacity
        key={stickerNumber}
        onPress={() => {
          onStickerPress(stickerNumber)
        }}
      >
        <View style={styles.stickerItemContainer}>
          <View style={[styles.roundStyleContainer, selected && styles.selectedStickerContainer ]}>
            <Text style={[styles.itemText, selected && styles.selectedStickerText]}>
              {stickerNumber}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _renderStickerList(stickerList, selectionList, onStickerPress) {
    if (!stickerList || stickerList.length == 0) {
      return null;
    }

    const emptyItemsCount = (5 - (stickerList.length % 5)) % 5;
    let stickerListWithEmptyItems = stickerList.concat(Array(emptyItemsCount).fill(-1))

    return (
      <View style={styles.stickerSectionContainer}>
        {
          stickerListWithEmptyItems.map(
            (stickerNumber, index) => (
              <View key={index}>
                {this._renderStickerItem(
                  stickerNumber,
                  _.includes(selectionList, stickerNumber),
                  onStickerPress
                )}
              </View>
            )
          )
        }
      </View>
    );
  }

  _renderFoundStickersToExchange(availableINeed, desiredIHave) {

    return (
      <View>
        <View style={styles.headerContainer}>

          <Text style={styles.title}>Encontramos <Text style={[styles.green, styles.strong]}>
              {availableINeed.length} figurinhas que você precisa
            </Text> e <Text
              style={[styles.green, styles.strong]}>
              {desiredIHave.length} repetidas que você tem pra trocar
            </Text>
          </Text>
          <Text style={styles.subtitle}>Clique nas figurinhas para selecionar
          as que você trocar, e atualize o seu controle {Emojis.wink}</Text>
        </View>


        {
          availableINeed.length > 0 ?
            (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    FIGURINHAS QUE VOCÊ PRECISA • {availableINeed.length}
                  </Text>

                  <Text style={styles.sectionSubtitle}>
                    Você está selecionando {this.state.willReceive.length} figurinhas para receber
                  </Text>
                </View>
                {
                  this._renderStickerList(
                    availableINeed,
                    this.state.willReceive,
                    this._toggleToReceive
                  )
                }
              </View>
            ) : null

        }

        {
          desiredIHave.length > 0 ?
            (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    FIGURINHAS QUE VOCÊ TEM PARA TROCAR • {desiredIHave.length}
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    Você está selecionando {this.state.willProvide.length} figurinhas para dar
                  </Text>
                </View>
                {
                  this._renderStickerList(
                    desiredIHave,
                    this.state.willProvide,
                    this._toggleToProvide
                  )
                }
              </View>
            ) : null

        }
      </View>
    );
  }

  _renderFoundNoStickersToExchange() {
    return (
      <View>
        <Text>Não encontramos figurinhas para trocar :(</Text>
      </View>
    )
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

    let buttonDisabled = (
      this.state.willProvide.length == 0 && this.state.willReceive.length == 0
    );

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, styles.strong, styles.green]}>Troque suas figurinhas</Text>
            <Text style={styles.largeEmoji}>
              {Emojis.rocket}
            </Text>
          </View>
          {
            (desiredIHave.length > 0 ||  availableINeed.length > 0) ?
            this._renderFoundStickersToExchange(availableINeed, desiredIHave) :
            this._renderFoundNoStickersToExchange()
          }
        </ScrollView>
        <View style={styles.floatBottom}>
          <SubmitButton
            text="ATUALIZAR MINHAS FIGURINHAS"
            color={Colors.DARK_GREEN}
            disabled={buttonDisabled}
            disabledOpacity={0.9}
            onPress={() => this._performExchange()} />
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  ({ peerStatus, stickers }) => ({ peerStatus, stickers }),
  { increaseStickerCount, decreaseStickerCount },
)(ExchangeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  headerContainer: {
      padding: 16,
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
  green: {
    color: Colors.DARK_GREEN,
  },
  largeEmoji: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 70,
  },
  sectionHeader: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: Colors.ALMOST_BLACK,
  },
  sectionSubtitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    color: Colors.YELLOW,
  },
  stickerItemContainer: {
    width: 60,
    height: 60,
    marginBottom: 16
  },
  selectedStickerContainer: {
    borderColor: Colors.DARK_GREEN,
    backgroundColor: Colors.DARK_GREEN,
    borderWidth: 2,
  },
  roundStyleContainer: {
    width: 60,
    height: 60,
    borderWidth: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 35,
    borderColor: "#E0E0E0",
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedStickerText: {
    color: Colors.WHITE,
    fontFamily: 'Rubik-Medium',
  },
  itemText: {
    fontFamily: "Rubik-Regular",
    fontSize: 20,
  },
  stickerSectionContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  floatBottom: {
    left: 16,
    right: 16,
    bottom: 16,
    position: 'absolute',
  },
});
