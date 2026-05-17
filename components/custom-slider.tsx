import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CustomSliderProps {
  minimumValue: number;
  maximumValue: number;
  value: number;
  onValueChange: (value: number) => void;
  step?: number;
}

export function CustomSlider({
  minimumValue,
  maximumValue,
  value,
  onValueChange,
  step = 1,
}: CustomSliderProps) {
  const trackRef = useRef<View>(null);
  const widthRef = useRef(0);

  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
  }, []);

  const handlePress = useCallback(
    (e: { nativeEvent: { locationX: number } }) => {
      const x = e.nativeEvent.locationX;
      const width = widthRef.current;
      if (width <= 0) return;

      const ratio = Math.max(0, Math.min(1, x / width));
      let newValue = minimumValue + ratio * (maximumValue - minimumValue);

      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }

      newValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
      onValueChange(newValue);
    },
    [minimumValue, maximumValue, step, onValueChange]
  );

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View ref={trackRef} style={styles.track} onLayout={handleLayout}>
        <View style={[styles.filledTrack, { width: `${percentage}%` }]} />
        <View style={[styles.thumb, { left: `${percentage}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  filledTrack: {
    height: 6,
    backgroundColor: Colors.accentGreen,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accentGreen,
    position: 'absolute',
    top: -7,
    marginLeft: -10,
    boxShadow: '0 2px 6px rgba(34, 197, 94, 0.4)',
  },
});
