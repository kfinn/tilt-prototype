import React, { useContext, useMemo, useState } from 'react';
import { ImageBackground, ImageSourcePropType, LayoutChangeEvent, Pressable, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import TouchPositionContext from '../contexts/TouchPositionContext';

const MAX_ROTATION = Math.PI / 6

interface Vector3 {
  dx: number
  dy: number
  dz: number
}

const MAX_LIGHTING_OPACITY = 0.5

const LIGHT_DIRECTION = vector3ToUnit({
  dx: Math.PI / 2.5,
  dy: -Math.PI / 5,
  dz: 0
})

function vector3DotProduct(v1: Vector3, v2: Vector3): number {
  return v1.dx * v2.dx + v1.dy * v2.dy + v1.dz * v2.dz
}

function vector3Inverse({ dx, dy, dz}: Vector3): Vector3 {
  return {
    dx: -dx,
    dy: -dy,
    dz: -dz
  }
}

function vectory3ByRotatingAboutYAxis({ dx, dy, dz}: Vector3, theta: number): Vector3 {
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  
  return {
    dx: (dx * cosTheta) + (dz * sinTheta),
    dy,
    dz: (-dx * sinTheta) + (dz * cosTheta)
  }
}

function vector3ByRotatingAboutXAxis({ dx, dy, dz }: Vector3, theta: number): Vector3 {
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  
  return {
    dx,
    dy: (dy * cosTheta) - (dz * sinTheta),
    dz: (dy * sinTheta) + (dz * cosTheta)
  }
}

function vector3ToUnit(vector: Vector3): Vector3 {
  const magnitude = Math.sqrt(vector.dx * vector.dx + vector.dy * vector.dy + vector.dz * vector.dz)
  return {
    dx: vector.dx / magnitude,
    dy: vector.dy / magnitude,
    dz: vector.dz / magnitude
  }
}

interface Point {
  x: number
  y: number
}

export default function Participant({ source }: { source: ImageSourcePropType }) {
  const [selected, setSelected] = useState(false)
  const [center, setCenter] = useState<Point>()
  const touchPosition = useContext(TouchPositionContext)
  
  const onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }: LayoutChangeEvent) => {
    setCenter({
      x: x + width / 2,
      y: y + height / 2
    })
  }
  
  const rotateX = useMemo(() => {
    if (!selected || !center || !touchPosition) {
      return 0
    }
    
    
    const dy = touchPosition.pageY - center.y
    return (2 * Math.atan(dy / 150)) / Math.PI * MAX_ROTATION
  }, [selected, center?.y, touchPosition?.pageY])
  
  const rotateY = useMemo(() => {
    if (!selected || !center || !touchPosition) {
      return 0
    }
    
    const dx = center.x - touchPosition.pageX
    return (2 * Math.atan(dx / 150)) / Math.PI * MAX_ROTATION
  }, [selected, center?.x, touchPosition?.pageX])
  
  const diffuseLightColor = useMemo(() => {
    if (!selected) {
      return 'transparent'
    }
    
    const unrotatedNormal = { dx: 0, dy: 0, dz: 1 }
    const rotatedNormal = vectory3ByRotatingAboutYAxis(vector3ByRotatingAboutXAxis(unrotatedNormal, rotateX), rotateY)
    
    const diffuseAmount = vector3DotProduct(rotatedNormal, vector3Inverse(LIGHT_DIRECTION))
    

    if (diffuseAmount > 0) {
      return `rgba(255, 255, 255, ${MAX_LIGHTING_OPACITY * diffuseAmount})`
    } else {
      return `rgba(0, 0, 0, ${-MAX_LIGHTING_OPACITY * diffuseAmount})`
    }
  }, [rotateX, rotateY])

  return <Pressable onLayout={onLayout} onPress={() => setSelected((selected) => !selected)}>
      <ImageBackground
        source={source}
        resizeMode="cover"
        style={[
          styles.participant,
          {
            transform: [
              { rotateX: `${rotateX}rad` },
              { rotateY: `${rotateY}rad` }
            ]
          },
          selected && styles.selected
        ]}
      >
        <View style={[ styles.participantLayer, { backgroundColor: diffuseLightColor } ]} />
      </ImageBackground>
    </Pressable>
}

const styles = StyleSheet.create({
  participant: {
    backgroundColor: 'white',
    height: 150,
    width: 150,
    borderRadius: 10,
    margin: 10,
  },
  participantLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  selected: {
    borderWidth: 10,
    borderColor: 'green'
  }
})
