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

import StyleSheet from '../helpers/F8StyleSheet';
import Colors from '../common/colors';

import StickerDetailsModal from './StickerDetailsModal';


class StickerSectionList extends React.Component {

  _renderItem = (item, index) => {
    if (item.empty) {
      return (
        <View key={index} style={styles.stickerItemContainer} />
      );
    }
    return (
      <TouchableOpacity
        key={item.name}
        onPress={() => this.props.onStickerPress(item.stickerNumber)}
      >
        <View style={styles.stickerItemContainer}>
          <View style={styles.roundStyleContainer}>
            <Text style={styles.itemText}>
              {item.stickerNumber}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const stickers = this.props.stickers;

    if (stickers.data.data) {
      let emptyItemsCount = (5 - (_.size(stickers.data.data) % 5)) % 5;
      console.log("EMPTY", stickers.data.data.title, emptyItemsCount);
      emptyItem = {
        empty: true,
        title: "empty",
        name: "empty",
      }

      let stickersDataWithEmptyItems = stickers.data.data.concat(Array(emptyItemsCount).fill(emptyItem));
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
  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      modalVisible: false,
      selectedStickerNumber: null,
    };
  }

  renderStickerSection = (row) => {
    return (
      <StickerSectionList stickers={row.item} onStickerPress={this._stickerSelected} />
    )
  }

  _stickerSelected = (selectedStickerNumber) => {
    this.setState({ selectedStickerNumber, modalVisible: true });
  }

  renderSectionTitle(row) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.headerText}>
          {row.section.title}
        </Text>
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
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Minhas Figurinhas</Text>
          <Text style={styles.headerStatus}>
            Faltam
            <Text style={styles.strongText}> {toComplete} figurinhas </Text>
            para você completar o álbum
          </Text>
          <Text style={styles.headerStatus}>
            e tem <Text style={styles.strongText}>{duplicates} para trocar</Text>
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
        <StickerDetailsModal
          visible={this.state.modalVisible}
          onDismissRequest={() => this.setState({ modalVisible: false })}
          stickerNumber={this.state.selectedStickerNumber}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  stickers: state.stickers,
});

export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  headerText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: "#333333"
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD"
  },
  stickerItemContainer: {
    width: 60,
    height: 60,
    marginBottom: 16
  },
  roundStyleContainer: {
    width: 60,
    height: 60,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    borderColor: "#E0E0E0",
    alignItems: 'center',
    justifyContent: 'center'
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
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 25,
    color: Colors.DARK_GREEN,
    marginBottom: 12,
  },
  strongText: {
    fontFamily: 'Rubik-Medium',
  },
  headerStatus: {
    fontFamily: 'Rubik-Regular',
    fontSize: 13,
    color: Colors.DARK_GREY,
  },
  headerInstructions: {
    fontFamily: 'Rubik-Regular',
    fontSize: 11,
    color: Colors.DARK_GREY,
    opacity: 0.85,
  },
});
