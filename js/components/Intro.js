import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../common/colors';
import Emojis from '../common/emojis';
import StyleSheet from '../helpers/F8StyleSheet';
import { introDone } from '../actions';

import SubmitButton from './SubmitButton';

class Intro extends React.Component {
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
      index: 0
    };
  }

  componentDidMount() {
    if (this.props.done) {
      this._introDone();
    }
  }

  _introDone = () => {
    this.props.introDone();
    this.props.navigation.replace('Home');
  }

  _renderItem = (props) => {
    const { last, backgroundColor, text, emoji, width, height, topSpacer, bottomSpacer } = props;
    const extraStyle = {
      backgroundColor,
      width,
      height,
      paddingBottom: bottomSpacer,
      paddingTop: topSpacer
    };
    return (
      <View style={[styles.slide, extraStyle]}>
        <Text style={styles.icon}>{emoji}</Text>
        {text}
      </View>
    );
  };

  _renderNextButton = () => {
    return (
      <View style={styles.circle}>
        {/* <Ionicons name="md-arrow-forward" size={30} color={Colors.WHITE} /> */}
      </View>
    );
  }

  _renderDoneButton = () => {
    return (
      <SubmitButton onPress={this._introDone} text="COMEÇAR" color={Colors.YELLOW} />
    );
  }

  render() {
    return (
      <AppIntroSlider
        ref={o => this.slider = o}
        slides={slides()}
        renderItem={this._renderItem}
        onDone={() => alert('done')}
        renderNextButton={this._renderNextButton}
        renderDoneButton={this._renderDoneButton}
        dotColor={Colors.TRANSPARENT}
        activeDotColor={Colors.TRANSPARENT}
        onSlideChange={(index) => this.setState({ index })}
        bottomButton={this.state.index === 2}
      />
    );
  }
}

export default connect(({ introDone }) => ({ done: introDone }), { introDone })(Intro);

const slides = () => [
  {
    key: 'first',
    emoji: Emojis.mobilePhone,
    backgroundColor: Colors.DARK_GREEN,
    text: (
      <View>
        <Text style={styles.text}>Organize suas</Text>
        <Text style={[styles.text, styles.strong]}> figurinhas</Text>
      </View>
    ),
  },
  {
    key: 'second',
    emoji: Emojis.megaphone,
    backgroundColor: Colors.YELLOW,
    text: (
      <View>
        <Text style={styles.text}>Compartilhe com</Text>
        <Text style={[styles.text, styles.strong]}> seus amigos</Text>
      </View>
    ),
  },
  {
    key: 'third',
    emoji: Emojis.sunglasses,
    backgroundColor: Colors.WHITE,
    last: true,
    text: (
      <View>
        <Text style={[styles.text, { color: Colors.BLACK }]}>Encontre as que você</Text>
        <Text style={[styles.text, styles.strong, { color: Colors.BLACK }]}>
          precisa rapidamente
        </Text>
      </View>
    ),
  },
]

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontFamily: 'Rubik-Regular',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  icon: {
    fontSize: 70,
    marginBottom: 40,
  },
  strong: {
    fontFamily: 'Rubik-Medium',
  },
  circle: {
    backgroundColor: Colors.FADED_BLACK,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
