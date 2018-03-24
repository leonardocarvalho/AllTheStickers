import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';
import { BigNumber } from 'bignumber.js';

import { encodeStickers } from '../helpers';

const StickerStatus = (props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <QRCode value={encodeStickers(props.stickers)} size={350} />
    </View>
  );
}

const mapStateToProps = ({ stickers }) => ({ stickers });

export default connect(mapStateToProps)(StickerStatus);
