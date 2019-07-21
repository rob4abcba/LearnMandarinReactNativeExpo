import * as React from "react";
import {
  View, StyleSheet, Dimensions, Text, SafeAreaView,
} from "react-native";
import { DangerZone } from "expo";
import { Emojis } from "./Model";
import Translation from "./Translation";

const { Animated } = DangerZone;
const {
  Value, debug, multiply, max,
} = Animated;
const { width } = Dimensions.get("window");

const colors = {
  zhSimp: "#3e3a3f",
  py: "#448d5d",
  en1: "#638fcf",
  en2: "#803758",
  en3: "#e75556",
  zhTrad: "#e72226"
};

const flags = {
  zhSimp: "Chinese Simplified (swipe left)",
  py: "Pinyin (swipe left or right)",
  en1: "English1 (swipe left or right)",
  en2: "English2 (swipe left or right)",
  en3: "English3 (swipe left or right)",
  zhTrad: "Chinese Traditional (swipe right)"
};

interface TranslationsProps {
  y: typeof Value;
  emojis: Emojis;
  max: number;
  index: typeof Value;
}

export default class Translations extends React.PureComponent<TranslationsProps> {
  render() {
    const {
      y, x, max: maxVal, index,
    } = this.props;
    const translateY = max(multiply(y, -1), maxVal);
    const translateX = multiply(x, -1);
    return (
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          flexDirection: "row",
          transform: [{ translateY }, { translateX }],
        }}
        horizontal
        snapPoint={width}
      >
        {
          Object.keys(colors).map(lang => (
            <SafeAreaView key={lang} style={{ width, height: "100%", backgroundColor: colors[lang] }}>
              <Text style={styles.flag}>{flags[lang]}</Text>
              <Translation style={styles.translation} {...{lang, index}} />
            </SafeAreaView>
          ))
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "pink",
  },
  flag: {
    textAlign: "center",
    fontSize: 24,
  },
  translation: {
    margin: 48,
    textAlign: "center",
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
});