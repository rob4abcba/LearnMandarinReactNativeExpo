import * as _ from "lodash";
import React from "react";
import {
  StyleSheet, View, Dimensions,
} from "react-native";
import { DangerZone, Constants } from "expo";

import Emojis from "./components/Emojis";
import { EMOJI_WIDTH, EMOJIS_OFFSET } from "./components/Model";
import Translations from "./components/Translations";
import { onScroll, lookup } from "./components/AnimationHelpers";
import Translation from "./components/Translation";

const { Animated } = DangerZone;
const {
  Value, block, call, divide, round, debug, cond, neq, diff, set, onChange,
} = Animated;
const emojis = require("./assets/emoji-db.json");

const emojiList = Object.keys(emojis);

const { height, width } = Dimensions.get("window");
const horizontalPanHeight = EMOJI_WIDTH;
const verticalPanHeight = height / 2 - horizontalPanHeight / 2;
const numberOfEmojis = emojiList.length;
const numberOfLanguages = Object.keys(emojis[emojiList[0]]).length;

export default () => {
  const slider = new Value(0);
  const x = new Value(0);
  const y = new Value(0); // Vertical Pan
  const index = round(divide(x, EMOJI_WIDTH)); // As swipe left and right on middle portion, calculate index based on x-coordinate div by width of each emoji-symbol.
  return (
    <View style={styles.container}>
      {/* The debug code below should allow me to view index values in a node window */}
      <Animated.Code>
        {
          () => debug("index = ", index)
        }
      </Animated.Code>
      <View style={styles.container}>
        <Translations
          max={(verticalPanHeight - 150) * -1}
          x={slider}
          {...{ emojis, y, index }}
        />
      </View>
      {/* x = animation values */}
      <Emojis {...{ emojis, x }} />
      <View style={styles.container}>
        {/* Use RL created Translation.tsx component to handle language XX = english */}
        <Translation style={styles.english} lang="en" {...{ index }} />
      </View>
      <Animated.ScrollView
        style={styles.verticalPan}
        // verticalPanContent slightly bigger so there is something to pan
        contentContainerStyle={styles.verticalPanContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll({ y })}
        scrollEventThrottle={1}
        snapToInterval={verticalPanHeight}
        decelerationRate="fast"
        vertical
      >
        {/* snapToInterval so when scroll it locks to perfect interval between languages */}
        <Animated.ScrollView
          style={StyleSheet.absoluteFillObject}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: width * (numberOfLanguages - 1) }}
          onScroll={onScroll({ x: slider })}
          scrollEventThrottle={1}
          snapToInterval={width}
          decelerationRate="fast"
          horizontal
        />
      </Animated.ScrollView>
      <Animated.ScrollView
        style={styles.horizontalPan}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalPanContent}
        onScroll={onScroll({ x })}
        scrollEventThrottle={1}
        snapToInterval={EMOJI_WIDTH}
        decelerationRate="fast"
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  verticalPan: {
    position: "absolute",
    top: 0, // Very top of screen
    left: 0,
    right: 0,
    height: verticalPanHeight, // Height of top portion
    // backgroundColor: "rgba(100,200,300,0.5)"
  },
  verticalPanContent: {
    height: verticalPanHeight * 2,
  },
  horizontalPan: {
    position: "absolute",
    top: verticalPanHeight, // Down from top by verticalPanHeight.
    left: 0,
    height: horizontalPanHeight, // Height of main symbols you swipe across middle of screen.
    // backgroundColor: "rgba(300,300,0,0.5)"
  },
  horizontalPanContent: {
    width: EMOJI_WIDTH * numberOfEmojis,
  },
  sliderContent: {
    width: width * (numberOfLanguages - 1),
  }, // Subtract 1 bec language XX is below.
  english: {
    margin: 48,
    textAlign: "center",
    fontSize: 48,
    color: "black",
    fontWeight: "bold",
  },
});