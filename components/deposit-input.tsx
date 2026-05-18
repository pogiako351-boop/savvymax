import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { CustomSlider } from './custom-slider';

interface DepositInputProps {
  value: number;
  onValueChange: (value: number) => void;
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function DepositInput({ value, onValueChange }: DepositInputProps) {
  const [textValue, setTextValue] = useState(formatNumber(value));

  // Sync text when value changes externally (slider)
  useEffect(() => {
    setTextValue(formatNumber(value));
  }, [value]);

  const handleTextChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10) || 0;
    const clamped = Math.min(Math.max(num, 0), 500000);
    setTextValue(formatNumber(clamped));
    onValueChange(clamped);
  }, [onValueChange]);

  const handleSliderChange = useCallback((val: number) => {
    const rounded = Math.round(val / 100) * 100;
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
          <Text style={styles.sliderLabelCenter}>
            ${formatNumber(value)}
          </Text>
          <Text style={styles.sliderLabel}>$500,000</Text>
        </View>
      </View>
      <View style={styles.noteRow}>
        <View style={styles.liveIndicator} />
        <Text style={styles.realTimeNote}>Real-time earnings update</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 22,
    gap: 14,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  dollar: {
    fontFamily: Fonts.bold,
    fontSize: 40,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  input: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 40,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    padding: 0,
    margin: 0,
  },
  sliderContainer: {
    marginTop: 4,
    gap: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textDark,
    fontVariant: ['tabular-nums'],
  },
  sliderLabelCenter: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.accentGreen,
    fontVariant: ['tabular-nums'],
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentGreen,
  },
  realTimeNote: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textDark,
  },
});
