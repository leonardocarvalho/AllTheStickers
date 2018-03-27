import React from 'react';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { SafeAreaView } from 'react-navigation';
import { View, Text, TouchableOpacity } from 'react-native';

import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';
import { peerStatusReceived } from '../actions';
import { decodeStickers } from '../helpers';

class StatusReader extends React.Component {

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

  _dataScanned(data) {
    try {
      const values = decodeStickers(data, this.props.stickers.length);
    } catch(error) {
      firebase.analytics().logEvent('read_qr_code_error', { encoded: error });
      return;
    }
    const status = this.props.stickers
      .sort((s1, s2) => s1.stickerNumber  - s2.stickerNumber)
      .map((s, index) => ({ ...s, count: values[index] || 0 }));

    const tradeStatus = { desired: [], available: [] };
    status.forEach(sticker => {
      if (sticker.count > 1) tradeStatus.available.push(sticker.stickerNumber);
      if (sticker.count === 0) tradeStatus.desired.push(sticker.stickerNumber);
    });

    this.props.peerStatusReceived(tradeStatus);
    this.props.navigation.navigate('Exchange');
  }

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.backgroundContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, styles.strong, styles.green]}>Leia um QR Code</Text>
            <Text style={styles.subtitle}>
              Leia o QR Code de outra pessoa, e encontre as figurinhas
              que vocês podem trocar
            </Text>
          </View>
          <QRCodeScanner
            reactivate={true}
            reactivateTimeout={5000}
            onRead={event => this._dataScanned(event.data)}
            onClose={() => this.props.navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ stickers }) => ({ stickers });

export default connect(mapStateToProps, { peerStatusReceived })(StatusReader);


const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  backgroundContainer: {
    backgroundColor: Colors.WHITE,
    flexGrow: 1,
  },
  headerContainer: {
      padding: 16,
  },
  title: {
    fontSize: 24,
    paddingBottom: 8,
    color: Colors.DARK_GREEN,
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
