import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  FlatList
} from 'react-native';

import { connect } from 'react-redux';

import StyleSheet from '../helpers/F8StyleSheet';
import { addSticker }  from '../actions';
import _  from 'lodash';


class StickerSectionList extends React.Component {

  _renderItem(item) {
      if (item.empty) {
        return (
          <View style={styles.stickerItemContainer}>

          </View>
        )
      }
      return (
        <View style={styles.stickerItemContainer}>
          <View style={styles.roundStyleContainer}>
            <Text style={styles.itemText}>
              {item.stickerNumber}
            </Text>
          </View>
        </View>
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


  renderStickerSection(row) {
    return (
        <StickerSectionList stickers={row.item} />
    )

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

    let stickersSections = _.chain(this.props.stickers)
      .groupBy('section')
      .map((data, title) => ({title, data, key: title}))
      .value();

    let stickersSectionLists = _.map(stickersSections, (section, sectionIndex) => {
      return this.genListSection(sectionIndex, section)
    });

    console.log("====", stickersSectionLists);

    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingTop: 40 }}>
        <SectionList
          keyExtractor={(item) => { return item.key }}
          renderItem={this.renderStickerSection}
          renderSectionHeader={this.renderSectionTitle}
          sections={stickersSectionLists} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  stickers: state.stickers,
});

export default connect(mapStateToProps, { addSticker })(Home);

const styles = StyleSheet.create({
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

});
