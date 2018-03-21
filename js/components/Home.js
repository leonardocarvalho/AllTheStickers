import React from 'react';
import { View, Text, TouchableOpacity, SectionList } from 'react-native';
import { connect } from 'react-redux';

import StyleSheet from '../helpers/F8StyleSheet';
import { addSticker }  from '../actions';
import { _ } from 'lodash';


class StickerListItem extends React.Component {

  render() {
    console.log("------------ this.sticker", this.props);
    return (
      <View>
        <Text style={styles.text}>{this.props.sticker.name}</Text>
      </View>
    )
  }

}


class Home extends React.Component {


  renderStickerSection(row) {
    console.log("ROW", row);
    return (
        <StickerListItem  key={row.item.name} sticker={row.item} />
    )

  }

  renderSectionTitle(row) {
    return (
      <Text>
        {row.section.title}
      </Text>
    )
  }

  render() {

    let stickersSections = _.chain(this.props.stickers)
      .groupBy('section')
      .map((data, title) => ({title, data}))
      .value();

    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingTop: 40 }}>

        <SectionList
          renderItem={this.renderStickerSection}
          renderSectionHeader={this.renderSectionTitle}
          sections={stickersSections} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  stickers: state.stickers,
});

export default connect(mapStateToProps, { addSticker })(Home);

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Rubik-Bold',
  }
});
