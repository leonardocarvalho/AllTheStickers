import React from 'react';
import { connect } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { BigNumber } from 'bignumber.js'
import { SafeAreaView } from 'react-navigation';
import { Alert, View, Text, TouchableOpacity } from 'react-native';

import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';
import { peerStatusReceived } from '../actions';
import { decodeStickers } from '../helpers';
import SubmitButton from './SubmitButton';

import QRdecoder from 'react-native-qrimage-decoder';
import ImagePicker from 'react-native-image-picker';

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

  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      imageSrc: null
    };
    this._pickImage = this._pickImage.bind(this)
  }

  _dataScanned(data) {
    const values = decodeStickers(data, this.props.stickers.length);
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


  _pickImage() {

    ImagePicker.showImagePicker({}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // let source = { uri: response.uri };

        // You can also display the image using data:
        let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imageSrc: source.uri
        });
      }
    });
  }

  onSuccess = (data) => {
    this._dataScanned(data);
    this.setState({imageSrc: ''})
  }

  onError = (data) => {
    Alert.alert('Erro', "Erro ao ler o código :(");
  }

  render() {

    let bottomContent = (
      <View style={styles.bottomContent}>
        <TouchableOpacity onPress={() => this._pickImage()}>
          <Text style={styles.back}>USAR IMAGEM</Text>
        </TouchableOpacity>
      </View>
    )
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
          <QRdecoder src={this.state.imageSrc} onSuccess={this.onSuccess} onError={this.onError} />
          <QRCodeScanner
            reactivate = {true}
            reactivateTimeout = {5000}
            bottomContent={bottomContent}
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
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
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
  floatBottom: {
    left: 16,
    right: 16,
    bottom: 16,
    position: 'absolute',
  },
  bottomContent: {
    marginTop: 30,
  },
  back: {
    color: Colors.DARK_GREY,
    fontFamily: 'Rubik-Medium',
  },
});
