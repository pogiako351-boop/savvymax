import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import type { BankCategory } from '@/constants/BankData';

interface CategoryBadgeProps {
  category: BankCategory;
}

const categoryColors: Record<BankCategory, string> = {
  Fintech: Colors.accentPurple,
  'High-Yield': Colors.accentGreen,
  Traditional: Colors.textDark,
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const color = categoryColors[category];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
      <Text style={[styles.text, { color }]}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderCurve: 'continuous',
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: Fonts.semiBold,
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
