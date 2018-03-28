import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  FlatList,
  Dimensions,
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

const STICKER_SECTION_PADDING = 16;
const ROUND_CONTAINER_DIAMETER = 60;

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
    var {height, width} = Dimensions.get('window');
    let rowStickersCount = Math.floor((width - 2 * STICKER_SECTION_PADDING)/ROUND_CONTAINER_DIAMETER);

    if (stickers && stickers.length > 0) {
      const emptyItemsCount = (rowStickersCount - (stickers.length % rowStickersCount)) % rowStickersCount;

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
      filterBy: "all",
    };
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
  }

  componentDidMount() {
    if (!this.props.userId) {
      this.props.dispatch({ type: 'NEW_USER' });
    }
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
      this.props.dispatch(increaseStickerCount(selectedStickerNumber));
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
          <Text style={styles.strongText}>{section.title}</Text>
          {
            this.state.filterBy == "all" ? (
              ` • ${minIndex} a ${maxIndex}`
            ) : ''
          }
        </Text>
        {
          this.state.filterBy == "all" ? (
            <Text style={[styles.headerText, styles.strongText]}>{obtained}/{sectionLen}</Text>
          ) : (
            <Text style={[styles.headerText, styles.strongText]}>{sectionLen}</Text>
          )
        }

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


  filterStickersBy(filterBy) {
    switch (filterBy) {
      case "repeated":
        return ((sticker) => sticker.count > 1);
      case "empty":
        return ((sticker) => sticker.count == 0);
      default:
        return ((sticker) => true);

    }
  }
  _renderDev = () => global.__DEV__ ? <DevOperations /> : null;

  render() {
    const { stickers } = this.props;

    const filteredStickers = _.filter(stickers, this.filterStickersBy(this.state.filterBy));

    let stickersSections = _.chain(filteredStickers)
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
              o álbum
            </Text>
          </View>

          <View style={styles.headerContainer, styles.filterContainer}>
              <TouchableOpacity onPress={() => this.setState({filterBy: "all"})}>
                <Text style={[
                  styles.filterButton,
                  (this.state.filterBy == "all" ? styles.filterButtonSelected : null)
                ]}>
                  TODAS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({filterBy: "repeated"})}>
                <Text style={[
                  styles.filterButton,
                  (this.state.filterBy == "repeated" ? styles.filterButtonSelected : null)
                ]}>
                  REPETIDAS { duplicates > 0 ? `(${duplicates})` : ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({filterBy: "empty"})}>
                <Text style={[
                  styles.filterButton,
                  (this.state.filterBy == "empty" ? styles.filterButtonSelected : null)
                ]}>
                  FALTANDO { duplicates > 0 ? `(${toComplete})` : ''}
                </Text>
              </TouchableOpacity>
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

const mapStateToProps = ({ stickers, userId }) => ({ stickers, userId });
export default connect(mapStateToProps)(Home);

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
    width: ROUND_CONTAINER_DIAMETER,
    height: ROUND_CONTAINER_DIAMETER,
    marginBottom: 16
  },
  obtainedStickerContainer: {
    borderColor: Colors.DARK_GREEN,
    backgroundColor: Colors.DARK_GREEN,
    borderWidth: 2,
  },
  roundStyleContainer: {
    width: ROUND_CONTAINER_DIAMETER,
    height: ROUND_CONTAINER_DIAMETER,
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
    color: Colors.ALMOST_BLACK,
  },
  headerStatus: {
    fontFamily: 'Rubik-Regular',
    fontSize: 18,
    color: Colors.DARK_GREY,
  },
  headerInstructions: {
    marginTop: 10,
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: Colors.DARK_GREY,
    opacity: 0.85,
  },
  filterButton: {
    color: Colors.LIGHT_GREY,
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    marginRight: 16,
  },
  filterButtonSelected: {
    color: Colors.DARK_GREEN,
    fontFamily: 'Rubik-Medium',
  },
  filterContainer: {
    padding: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderBottomColor: Colors.ALMOST_WHITE,
    borderBottomWidth: 1,
  }
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
