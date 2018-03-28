import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';

import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';
import Emojis from '../common/emojis';
import { SafeAreaView } from 'react-navigation';
import { encodeStickers } from '../helpers';

import SubmitButton from './SubmitButton';

import { captureRef } from "react-native-view-shot";
import Share, {ShareSheet, Button} from 'react-native-share';

class StickerStatus extends React.Component {

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


  _saveImage() {
    captureRef(this.refs.QRCodeCardShare, {
      format: "png",
      quality: 1,
      result: "data-uri"
    })
    .then(
      uri => {
        // console.log("Image saved to", uri)

        Share.open({
          url: uri
        }).catch((err) => { err && console.log(err); })
      },
      error => console.error("Oops, snapshot failed", error)
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, styles.strong, styles.green]}>
              Compartilhe suas figurinhas
            </Text>
            <Text style={styles.subtitle}>
              Mostre o código abaixo para quem também tem o app ou compartilhe
              pelo Whatsapp para trocar as figurinhas que você tem repetidas.
            </Text>
          </View>
          <View style={styles.cardContainer} ref="QRCodeCardShare">
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={encodeStickers(this.props.stickers)}
                size={Math.min((Dimensions.get("window").width - 2 * 30), 300)} />
            </View>
            <View style={styles.cardHeaderContainer}>
              <Text style={styles.cardHeaderTitle}>
                MINHAS FIGURINHAS DO ÁLBUM RÚSSIA 2018
              </Text>
              <Text style={styles.cardSubtitle}>
                Essas são minhas figurinhas repetidas do álbum da Copa da Rússia
                2018.
              </Text>
              <Text style={styles.cardSubtitle}>
                Use o app <Text style={styles.strong}>682</Text> para descobrir quais figurinhas você pode trocar
                comigo {Emojis.wink} {Emojis.sunglasses}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.floatBottom}>
          <SubmitButton
            text="COMPARTILHAR"
            color={Colors.DARK_GREEN}
            onPress={() => this._saveImage()} />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ stickers }) => ({ stickers });

export default connect(mapStateToProps)(StickerStatus);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardHeaderContainer: {
    marginTop: 16,
  },
  cardHeaderTitle: {
    fontSize: 16,
    color: Colors.DARK_GREEN,
    fontFamily: 'Rubik-Medium',
  },
  cardSubtitle: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.LIGHT_GREY,
    fontFamily: 'Rubik-Regular',
  },
  cardContainer: {
    margin: 16,
    padding: 16,
    // borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.ALMOST_WHITE,
    shadowColor: Colors.ALMOST_BLACK,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: Colors.WHITE,
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    padding: 16,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 24,
    paddingBottom: 8,
    color: Colors.DARK_GREY,
  },
  subtitle: {
    color: Colors.LIGHT_GREY,
    fontFamily: 'Rubik-Regular',
    fontSize: 13,
    // paddingBottom: 12,
  },
  strong: {
    fontFamily: 'Rubik-Medium',
  },
  green: {
    color: Colors.DARK_GREEN
  },
  scrollViewContent: {
    paddingBottom: 60,
  },
  floatBottom: {
    left: 16,
    right: 16,
    bottom: 16,
    position: 'absolute',
  },
});
