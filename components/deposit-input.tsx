import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { CustomSlider } from './custom-slider';

interface DepositInputProps {
  value: number;
  onValueChange: (value: number) => void;
}

export function DepositInput({ value, onValueChange }: DepositInputProps) {
  const [textValue, setTextValue] = useState(formatNumber(value));

  function formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }

  const handleTextChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10) || 0;
    const clamped = Math.min(Math.max(num, 0), 500000);
    setTextValue(formatNumber(clamped));
    onValueChange(clamped);
  }, [onValueChange]);

  const handleSliderChange = useCallback((val: number) => {
    const rounded = Math.round(val / 100) * 100;
    setTextValue(formatNumber(rounded));
    onValueChange(rounded);
  }, [onValueChange]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Deposit Amount</Text>
      <View style={styles.inputRow}>
        <Text style={styles.dollar}>$</Text>
        <TextInput
          style={styles.input}
          value={textValue}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          maxLength={7}
          selectTextOnFocus
          placeholderTextColor={Colors.textDark}
        />
      </View>
      <View style={styles.sliderContainer}>
        <CustomSlider
          minimumValue={500}
          maximumValue={500000}
          value={value}
          onValueChange={handleSliderChange}
          step={100}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>$500</Text>
          <Text style={styles.sliderLabel}>$500,000</Text>
        </View>
      </View>
      <Text style={styles.realTimeNote}>Real-time earnings update</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    gap: 12,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dollar: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: Colors.textPrimary,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    padding: 0,
    margin: 0,
  },
  sliderContainer: {
    marginTop: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  sliderLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textDark,
  },
  realTimeNote: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textDark,
    textAlign: 'center',
  },
});
