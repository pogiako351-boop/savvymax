import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface AdPlaceholderProps {
  variant: 'leaderboard' | 'in-feed' | 'anchor';
}

export function AdPlaceholder({ variant }: AdPlaceholderProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 728;

  if (variant === 'leaderboard') {
    return (
      <View style={[styles.leaderboard, isDesktop && styles.leaderboardDesktop]}>
        <Text style={styles.adLabel}>Advertisement</Text>
        <View style={[styles.adContent, isDesktop ? styles.adContentDesktop : styles.adContentMobile]}>
          <Text style={styles.adPlaceholder}>Ad Space — 728x90</Text>
        </View>
      </View>
    );
  }

  if (variant === 'in-feed') {
    return (
      <View style={styles.inFeed}>
        <View style={styles.sponsoredHeader}>
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>Sponsored</Text>
          </View>
        </View>
        <View style={styles.inFeedContent}>
          <Text style={styles.adPlaceholder}>In-Feed Ad Placement</Text>
        </View>
      </View>
    );
  }

  // anchor variant is handled in the parent (sticky bottom bar)
  return null;
}

export function AnchorAdBar({ onClose }: { onClose: () => void }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 728;

  return (
    <View style={styles.anchorBar}>
      <View style={styles.anchorInner}>
        <View style={[styles.anchorContent, isDesktop && styles.anchorContentDesktop]}>
          <Text style={styles.adPlaceholder}>
            {isDesktop ? '728x90 Anchor Ad' : '320x50 Anchor Ad'}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close advertisement"
          hitSlop={8}
        >
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leaderboard: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  leaderboardDesktop: {
    paddingVertical: 12,
  },
  adLabel: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: Colors.textDark,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  adContent: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adContentDesktop: {
    width: 728,
    height: 90,
  },
  adContentMobile: {
    width: '100%',
    height: 60,
  },
  adPlaceholder: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.textDark,
    letterSpacing: 0.3,
  },
  inFeed: {
    backgroundColor: Colors.cardSurfaceLight,
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sponsoredHeader: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  sponsoredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderCurve: 'continuous',
  },
  sponsoredText: {
    fontFamily: Fonts.semiBold,
    fontSize: 9,
    color: Colors.textDark,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inFeedContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    margin: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
  },
  anchorBar: {
    backgroundColor: '#0B1120',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  anchorInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  anchorContent: {
    width: 320,
    height: 50,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 6,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchorContentDesktop: {
    width: 728,
    height: 90,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.cardSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.textMuted,
  },
});
