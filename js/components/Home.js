
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  FlatList
} from 'react-native';

import { connect } from 'react-redux';

import { addSticker }  from '../actions';
import _  from 'lodash';


class StickerSectionList extends React.Component {

  _renderItem({item}) {
      console.log("RENDER ITEM", item);
      return (
        <View>
          <Text>{item.stickerNumber}</Text>
        </View>
      );
  }

  render() {
    const stickers = this.props.stickers;

    console.log("stickers from section", stickers.data);

    if (stickers.data) {
      // console.log("stickers from section inside");
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            numColumns={5}
            data={stickers.data.data}
            // getItemLayout={(layoutData, index) => {
            //   return {
            //     length: 100,
            //     offset: 100 * index,
            //     index,
            //   }
            // }}
            renderItem={this._renderItem}
          />
        </View>
      )

    }
    return undefined;
  }

}


class Home extends React.Component {


  renderStickerSection(row) {

    console.log("ROW", row);
    return (
        <StickerSectionList stickers={row.item} />
    )

  }

  renderSectionTitle(row) {
    return (
      <Text>
        {row.section.title}
      </Text>
    )
  }

  genListSection = (index, data) => {
    console.log("INDEX", index);
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


    console.log("stickersSections", stickersSections);


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
