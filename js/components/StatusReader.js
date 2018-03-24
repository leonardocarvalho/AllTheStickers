import React from 'react';
import { connect } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { peerStatusReceived } from '../actions';
import { decodeStickers } from '../helpers';

class StatusReader extends React.Component {
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

  render() {
    return (
      <QRCodeScanner
        onRead={event => this._dataScanned(event.data)}
        onClose={() => this.props.navigation.goBack()}
      />
    );
  }
}

const mapStateToProps = ({ stickers }) => ({ stickers });

export default connect(mapStateToProps, { peerStatusReceived })(StatusReader);
