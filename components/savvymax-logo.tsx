import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Text as SvgText,
  Circle,
} from 'react-native-svg';

interface SavvymaxLogoProps {
  size?: 'small' | 'default';
}

export function SavvymaxLogo({ size = 'default' }: SavvymaxLogoProps) {
  const iconSize = size === 'small' ? 20 : 24;
  const fontSize = size === 'small' ? 22 : 28;
  const textWidth = size === 'small' ? 130 : 168;

  return (
    <View style={styles.container}>
      {/* Growth/Yield Icon */}
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="iconGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#22C55E" />
            <Stop offset="100%" stopColor="#14B8A6" />
          </LinearGradient>
          <LinearGradient id="iconGradLight" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#14B8A6" stopOpacity="0.3" />
          </LinearGradient>
        </Defs>
        {/* Rising bar chart with arrow */}
        <Path
          d="M3 20 L3 14 L6 14 L6 20 Z"
          fill="url(#iconGradLight)"
        />
        <Path
          d="M8 20 L8 10 L11 10 L11 20 Z"
          fill="url(#iconGradLight)"
        />
        <Path
          d="M13 20 L13 7 L16 7 L16 20 Z"
          fill="url(#iconGrad)"
        />
        <Path
          d="M18 20 L18 3 L21 3 L21 20 Z"
          fill="url(#iconGrad)"
        />
        {/* Upward trend arrow */}
        <Path
          d="M2 16 L8 11 L12 13 L20 5"
          stroke="url(#iconGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M16 4 L21 4 L21 9"
          stroke="url(#iconGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Small dollar accent dot */}
        <Circle cx="19.5" cy="4" r="0" fill="#22C55E" />
      </Svg>

      {/* Gradient Text "Savvymax" */}
      <Svg width={textWidth} height={fontSize + 6} viewBox={`0 0 ${textWidth} ${fontSize + 6}`}>
        <Defs>
          <LinearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F1F5F9" />
            <Stop offset="45%" stopColor="#E2E8F0" />
            <Stop offset="100%" stopColor="#22C55E" />
          </LinearGradient>
        </Defs>
        <SvgText
          x="0"
          y={fontSize - 2}
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="Inter_700Bold"
          fill="url(#textGrad)"
          letterSpacing={-0.8}
        >
          Savvymax
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
