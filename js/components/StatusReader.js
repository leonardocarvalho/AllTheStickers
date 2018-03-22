import React from 'react';
import { connect } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { BigNumber } from 'bignumber.js'

import { peerStatusReceived } from '../actions';

class StatusReader extends React.Component {
  _dataScanned(data) {
    const status = this.props.stickers.map(s => ({ ...s, count: 0 }));

    let index = status.length;
    let number = new BigNumber(data);
    while (number.isGreaterThan(0)) {
      index--;
      const next = number.modulo(3).toNumber();
      status[index].count = next;
      number = number.dividedToIntegerBy(3);
    }

    const tradeStatus = { desired: [], available: [] };
    status.forEach(sticker => {
      if (sticker.count > 1) tradeStatus.available.push(sticker.stickerNumber);
      if (sticker.count === 0) tradeStatus.desired.push(sticker.stickerNumber);
    });

    this.props.peerStatusReceived(tradeStatus);
    this.props.navigation.goBack();
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
