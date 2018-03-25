import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { SafeAreaView } from 'react-navigation';

import DevOperations from '../components/DevOperations';
import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';
import { increaseStickerCount } from '../actions';

import StickerDetailsModal from './StickerDetailsModal';
import SubmitButton from './SubmitButton';


class StickerSectionList extends React.Component {

  _renderItem = (sticker, index) => {
    if (sticker.empty) {
      return (
        <View key={index} style={styles.stickerItemContainer} />
      );
    }
    const obtained = sticker.count > 0;
    let badge = null;
    if (sticker.count > 1) {
      badge = (
        <View style={badgeStyles.container}>
          <Text style={badgeStyles.text}>+{sticker.count - 1}</Text>
        </View>
      )
    }
    return (
      <TouchableOpacity
        key={sticker.name}
        onLongPress={() => this.props.onStickerLongPress(sticker.stickerNumber)}
        onPress={() => this.props.onStickerPress(sticker.stickerNumber)}
      >
        <View style={styles.stickerItemContainer}>
          <View style={[styles.roundStyleContainer, obtained && styles.obtainedStickerContainer ]}>
            <Text style={[styles.itemText, obtained && styles.obtainedStickerText]}>
              {sticker.stickerNumber}
            </Text>
          </View>
        </View>
        {badge}
      </TouchableOpacity>
    );
  }

  render() {
    const { stickers } = this.props;

    if (stickers && stickers.length > 0) {
      const emptyItemsCount = (5 - (stickers.length % 5)) % 5;
      emptyItem = {
        empty: true,
        title: "empty",
        name: "empty",
      }

      const stickersDataWithEmptyItems = stickers.concat(Array(emptyItemsCount).fill(emptyItem));
      return (
        <View style={styles.stickerSectionContainer}>
          {stickersDataWithEmptyItems.map(this._renderItem)}
        </View>

      )

    }
    return undefined;
  }

}

class Home extends React.Component {
  static navigationOptions = {
    header: null,
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0
    }
  };

  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      modalVisible: false,
      selectedStickerNumber: null,
    };
  }

  renderStickerSection = ({ item }) => {
    return (
      <StickerSectionList stickers={item.data.data}
        onStickerLongPress={this._stickerLongPressed}
        onStickerPress={this._stickerSelected} />
    )
  }

  _stickerLongPressed = (selectedStickerNumber) => {
    this.setState({ selectedStickerNumber, modalVisible: true });
  }

  _stickerSelected = (selectedStickerNumber) => {
    const sticker = this.props.stickers.find(s => s.stickerNumber === selectedStickerNumber);
    if (sticker.count === 0) {
      this.props.increaseStickerCount(selectedStickerNumber);
    } else {
      this.setState({ selectedStickerNumber, modalVisible: true });
    }
  }

  renderSectionTitle({ section }) {
    const sectionStickers = section.data[0].data.data; // WTF?!?!?!
    const minIndex = sectionStickers.reduce((acc, s) => Math.min(acc, s.stickerNumber), Infinity);
    const maxIndex = sectionStickers.reduce((acc, s) => Math.max(acc, s.stickerNumber), 0);
    const sectionLen = sectionStickers.length;
    const obtained = sectionStickers.reduce((acc, s) => acc + (s.count > 0), 0);
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.headerText}>
          <Text style={styles.strongText}>{section.title}</Text> • {minIndex} a {maxIndex}
        </Text>
        <Text style={[styles.headerText, styles.strongText]}>{obtained}/{sectionLen}</Text>
      </View>
    )
  }

  genListSection = (index, data) => {
    return {
      key: `${index}`,
      title: data.title,
      data: [{ key: '', data }],
    }
  };

  _renderDev = () => global.__DEV__ ? <DevOperations /> : null;

  render() {
    const { stickers } = this.props;

    let stickersSections = _.chain(stickers)
      .groupBy('section')
      .map((data, title) => ({title, data, key: title}))
      .value();

    let stickersSectionLists = stickersSections.map((section, sectionIndex) => {
      return this.genListSection(sectionIndex, section)
    });

    const toComplete = stickers.filter(sticker => sticker.count === 0).length;
    const duplicates = stickers.map(s => Math.max(s.count - 1, 0)).reduce((acc, v) => acc + v, 0);

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          {this._renderDev()}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Minhas Figurinhas • Rússia 2018</Text>
            <Text style={styles.headerStatus}>
              Faltam
              <Text style={styles.strongText}> {toComplete} figurinhas para completar </Text>
              o álbum e você tem
              <Text style={styles.strongText}> {duplicates} figurinhas para trocar</Text>
            </Text>
            <Text style={styles.headerInstructions}>
              Clique nos números abaixo para atualizar sua contagem
            </Text>
          </View>
          <SectionList
            keyExtractor={(item) => { return item.key }}
            renderItem={this.renderStickerSection}
            renderSectionHeader={this.renderSectionTitle}
            sections={stickersSectionLists} />
          <View style={styles.floatBottom}>
            <SubmitButton
              text="TROCAR"
              color={Colors.DARK_GREEN}
              onPress={() => this.props.navigation.navigate('ExchangeOptions')} />
          </View>
          <StickerDetailsModal
            visible={this.state.modalVisible}
            onDismissRequest={() => this.setState({ modalVisible: false })}
            stickerNumber={this.state.selectedStickerNumber}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  stickers: state.stickers,
});

export default connect(mapStateToProps, { increaseStickerCount })(Home);

const styles = StyleSheet.create({
  floatBottom: {
    left: 16,
    right: 16,
    bottom: 16,
    position: 'absolute',
  },
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 50,
    backgroundColor: Colors.WHITE,
  },
  headerText: {
    fontFamily: 'Rubik-Regular',
    letterSpacing: -1,
    fontSize: 20,
    color: Colors.ALMOST_BLACK,
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: Colors.WHITE,
    // borderBottomWidth: 1,
    borderBottomColor: Colors.ALMOST_WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stickerItemContainer: {
    width: 60,
    height: 60,
    marginBottom: 16
  },
  obtainedStickerContainer: {
    borderColor: Colors.DARK_GREEN,
    backgroundColor: Colors.DARK_GREEN,
    borderWidth: 2,
  },
  roundStyleContainer: {
    width: 60,
    height: 60,
    borderWidth: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 35,
    borderColor: "#E0E0E0",
    alignItems: 'center',
    justifyContent: 'center'
  },
  obtainedStickerText: {
    color: Colors.WHITE,
    fontFamily: 'Rubik-Medium',
  },
  itemText: {
    fontFamily: "Rubik-Regular",
    fontSize: 20,
  },
  stickerSectionContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  headerContainer: {
    paddingTop: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 22,
    color: Colors.DARK_GREEN,
    marginBottom: 12,
  },
  strongText: {
    fontFamily: 'Rubik-Medium',
    color: Colors.DARK_GREEN,
  },
  headerStatus: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: Colors.DARK_GREY,
  },
  headerInstructions: {
    marginTop: 10,
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: Colors.DARK_GREY,
    opacity: 0.85,
  },
});

const badgeStyles = StyleSheet.create({
  container: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: Colors.YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 7,
  },
  text: {
    color: Colors.WHITE,
    textShadowColor: Colors.ALMOST_BLACK,
    textShadowRadius: 5,
    fontFamily: 'Rubik-Medium',
    fontSize: 10,
  },
});
