import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';
import { BigNumber } from 'bignumber.js';

class StickerStatus extends React.Component {

  _encode(stickers) {
    return stickers
      .sort((s1, s2) => s1.stickerNumber  - s2.stickerNumber)
      .map(s => s.count > 1 ? 2 : s.count)
      .reduce((acc, n) => acc.times(3).plus(n), new BigNumber(0))
      .toString();

    console.log(int)

    return int.toString();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <QRCode value={this._encode(this.props.stickers)} size={350} />
      </View>
    );
  }
}

const mapStateToProps = ({ stickers }) => ({ stickers });

export default connect(mapStateToProps)(StickerStatus);
