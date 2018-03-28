import React from 'react';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { SafeAreaView } from 'react-navigation';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import mime from 'mime-types';
import ImageTools from 'react-native-image-tool';
import jsQR from "jsqr";

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
    let values;
    try {
      values = decodeStickers(data, this.props.stickers.length);
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

  _notifyError = () => {
    Alert.alert(
      'Erro ao ler QR Code',
      'Ocorreu algum erro ao ler a image. Por favor tente novamente',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  }

  _selectImage = () => {
    ImagePicker.showImagePicker({
      title: 'Selecione o QR Code das figurinhas para trocar',
      mediaType: 'photo',
      maxHeight: 500,
      maxWidth: 500,
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Tirar uma foto',
      chooseFromLibraryButtonTitle: 'Escolher imagem da galeria',
    }, (response) => {
      if (response.didCancel) return;
      if (response.error) {
        this._notifyError();
        return;
      }

      const { data, type, width, height } = response;
      const photoType = type || mime.lookup(uri);
      const uri = `data:${photoType};base64,${data}`;

      const extractBits = (value, bitStart, bitEnd) => {
        let result = 0;
        let shift = bitEnd - bitStart;
        let curr = value >>> bitStart;
        while (shift > 0) {
          shift--;
          result = (result << 1) | ((curr >>> shift) & 1);
        }
        return result;
      };

      ImageTools
        .GetImageRGBAs(uri)
        .then(({ width, height, rgba: encodedRGBA }) => {
          const rgba = encodedRGBA.reduce((acc, curr) => {
            acc.push(extractBits(curr, 0, 7));
            acc.push(extractBits(curr, 8, 15));
            acc.push(extractBits(curr, 16, 23));
            acc.push(extractBits(curr, 24, 32));
            return acc;
          }, []);
          try {
            const { data } = jsQR(rgba, width, height);
            this._dataScanned(data);
          } catch (error) {
            firebase.analytics().logEvent('share_qr_code_read_error', { error });
            this._notifyError();
          }
        });
    });
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
          <View style={styles.importContainer}>
            <TouchableOpacity onPress={this._selectImage}>
              <Text style={styles.importText}>Importar código</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ stickers }) => ({ stickers });

export default connect(mapStateToProps, { peerStatusReceived })(StatusReader);


const styles = StyleSheet.create({
  importContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
  },
  importText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: Colors.DARK_GREY,
  },
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
