import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { increaseStickerCount, decreaseStickerCount }  from '../actions';
import StyleSheet from '../helpers/F8StyleSheet';
import { padDigits } from '../helpers';
import Colors from '../common/colors';

import SubmitButton from './SubmitButton';
import { BottomModal } from './BottomModal';

class StickerDetailsModal extends React.Component {
  static propTypes = {
    stickerNumber: PropTypes.number,
    sticker: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    onDismissRequest: PropTypes.func.isRequired,
  }

  render() {
    const { onDismissRequest, visible, sticker } = this.props;

    if (!sticker) return null;

    const stickerNumber = padDigits(sticker.stickerNumber, 3);
    return (
      <BottomModal onDismissRequest={onDismissRequest} visible={visible}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerMainText}>Figurinha {stickerNumber}</Text>
            <Text style={styles.headerDetailsText}>
              <Text style={styles.sectionNameText}>{sticker.section}</Text> • {sticker.name}
            </Text>
          </View>
          <View>
            <Text style={styles.replicaText}>CÓPIAS</Text>
            <Text style={styles.explanationText}>
              Controle a quantidade de repetidas que você tem
            </Text>
          </View>
          <View style={styles.counterContainer}>
            <Counter
              allowNegative={false}
              value={sticker.count}
              onIncrease={() => this.props.increaseStickerCount(sticker.stickerNumber)}
              onDecrese={() => this.props.decreaseStickerCount(sticker.stickerNumber)}
            />
            <Text style={styles.noStickerToExchangeText}>
              {sticker.count === 1 ? 'Você ainda não tem repetidas' : ''}
            </Text>
          </View>
          <SubmitButton text="SALVAR" onPress={onDismissRequest} color={Colors.DARK_GREEN} />
        </View>
      </BottomModal>
    );
  }
};

const mapStateToProps = (state) => (state, props) => {
  return {
    sticker: state.stickers.find(s => s.stickerNumber === props.stickerNumber),
  };
};

export default connect(
  mapStateToProps,
  { increaseStickerCount, decreaseStickerCount }
)(StickerDetailsModal);

const Counter = (props) => {
  const canDecrease = props.value > 0 || props.allowNegative;

  return (
    <View style={counterStyles.container}>
      <TouchableOpacity onPress={() => canDecrease && props.onDecrese()} activeOpacity={0.6}>
        <View style={[counterStyles.circle, !canDecrease && counterStyles.disabled]}>
          <Text style={counterStyles.signText}>—</Text>
        </View>
      </TouchableOpacity>
      <View style={counterStyles.valueContainer}>
        <Text style={[counterStyles.signText, counterStyles.valueText]}>{props.value}</Text>
      </View>
      <TouchableOpacity onPress={() => props.onIncrease()} activeOpacity={0.6}>
        <View style={counterStyles.circle}>
          <Text style={counterStyles.signText}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
Counter.propTypes = {
  allowNegative: PropTypes.bool,
  value: PropTypes.number.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrese: PropTypes.func.isRequired,
};
Counter.defaultProps = {
  allowNegative: false,
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 25,
  },
  headerMainText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 25,
    color: Colors.DARK_GREY,
  },
  headerDetailsText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: Colors.DARK_GREY,
  },
  sectionNameText: {
    fontFamily: 'Rubik-Medium',
  },
  replicaText: {
    color: Colors.DARK_GREY,
    fontSize: 18,
    fontFamily: 'Rubik-Medium',
  },
  explanationText: {
    color: Colors.DARK_GREY,
    fontFamily: 'Rubik-Regular',
    fontSize: 13,
  },
  headerContainer: {
    marginBottom: 30,
  },
  counterContainer: {
    marginVertical: 20,
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noStickerToExchangeText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 13,
    color: Colors.DARK_GREY,
  },
});

const radius = 20;

const counterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  circle: {
    height: 2 * radius,
    width: 2 * radius,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    borderRadius: radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    marginHorizontal: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  signText: {
    fontFamily: 'Rubik-Regular',
    fontSize: parseInt(1.5 * radius),
    color: Colors.LIGHT_GREY,
  },
  valueText: {
    fontSize: 2 * radius,
    fontFamily: 'Rubik-Regular',
    color: Colors.DARK_GREY,
  },
  disabled: {
    opacity: 0.3,
  },
});
