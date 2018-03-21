
import React from 'react';
import { View, Text, TouchableOpacity, SectionList } from 'react-native';
import { connect } from 'react-redux';

import { addSticker }  from '../actions';
import { _ } from 'lodash';


class StickerListItem extends React.Component {

  render() {
    console.log("------------ this.sticker", this.props);
    return (
      <View>
        <Text>{this.props.index} - {this.props.sticker} </Text>
      </View>
    )
  }

}




class Home extends React.Component {

  render() {
    console.log("this.props.stickers", this.props.stickers);
    let stickersSections = _.chain(this.props.stickers)
      .groupBy('section')
      .map((data, title) => ({title, data}))
      .value();

    console.log("=== SECTIONS", stickersSections);

    return (

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <SectionList
          renderItem={({sticker}) => {
            console.log("TESRDSAFDSA sticker", sticker);
            return (<StickerListItem keyExtractor={(sticker) => {sticker.name}} sticker={sticker} />)

          }}
          renderSectionHeader={({section}) => <Text title={section.title} />}
          sections={stickersSections}
        />

      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  stickers: state.stickers,
});

export default connect(mapStateToProps, { addSticker })(Home);
