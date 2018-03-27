import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';

import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';
import { SafeAreaView } from 'react-navigation';
import { encodeStickers } from '../helpers';

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

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, styles.strong, styles.green]}>
            Compartilhe suas figurinhas
          </Text>
          <Text style={styles.subtitle}>
            Mostre o código abaixo para quem também tem o app para
            trocar as figurinhas  que você tem disponível
          </Text>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={encodeStickers(this.props.stickers)}
              size={Math.min(300, (Dimensions.get('window').width - 60))} />
          </View>
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
  cardContainer: {
    margin: 16,
    padding: 16,
    borderWidth: 1,
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
    fontSize: 15,
    paddingBottom: 12,
  },
  strong: {
    fontFamily: 'Rubik-Medium',
  },
  green: {
    color: Colors.DARK_GREEN
  },
});
