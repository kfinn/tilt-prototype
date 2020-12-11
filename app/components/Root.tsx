import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, GestureResponderEvent } from "react-native";
import TouchPositionContext, { TouchPosition } from '../contexts/TouchPositionContext';
import Participant from './Participant';

export default function Root() {
  const [touchPosition, setTouchPosition] = useState<TouchPosition>()

  const updateTouchPosition = ({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
    setTouchPosition({ pageX, pageY })
  }

  return <TouchPositionContext.Provider value={touchPosition}>
    <View style={styles.background} onTouchStart={updateTouchPosition} onTouchMove={updateTouchPosition} onTouchEnd={updateTouchPosition}>
      <SafeAreaView style={styles.container}>
        <View style={styles.currentGroup}>
          <Participant source={require('../assets/april.png')} />
          <Participant source={require('../assets/jean_ralphio.jpg')} />
          <Participant source={require('../assets/jerry.jpg')} />
          <Participant source={require('../assets/leslie.jpg')} />
          <Participant source={require('../assets/tom.png')} />
        </View>
      </SafeAreaView>
    </View>
  </TouchPositionContext.Provider>
}

const styles = StyleSheet.create({
  background: { 
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  currentGroup: {
    flexDirection: 'row',
    flexWrap:  'wrap',
    justifyContent: 'center'
  }
})
