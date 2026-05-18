import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Typography';

export function LegalFooter() {
  return (
    <View style={styles.container}>
      {/* Divider */}
      <View style={styles.divider} />

      {/* Financial Disclaimer */}
      <View style={styles.section}>
        <Text style={styles.heading} selectable>FINANCIAL DISCLAIMER</Text>
        <Text style={styles.body} selectable>
          This application is provided for educational and informational purposes only and does not
          constitute official financial advice, investment advice, tax advice, or any other form of
          professional financial guidance. APY (Annual Percentage Yield) rates displayed are subject
          to frequent change based on Federal Reserve monetary policy decisions, individual bank
          pricing strategies, and prevailing market conditions. Users should independently verify all
          rates directly with the respective financial institutions before making any deposit or
          investment decisions.
        </Text>
      </View>

      {/* FTC Affiliate Disclosure */}
      <View style={styles.section}>
        <Text style={styles.heading} selectable>FTC AFFILIATE DISCLOSURE</Text>
        <Text style={styles.body} selectable>
          This is an independent, advertising-supported comparison tool. The developer and/or
          publisher of this application may receive monetary compensation, referral fees, or
          affiliate commissions from one or more featured financial institutions when users click
          outbound links, open accounts, or complete qualifying actions through this application.
          This compensation may influence which products appear, the order in which they appear, and
          how they are presented. Editorial opinions expressed herein are the developer&#39;s own and
          have not been reviewed, approved, or endorsed by any featured institution.
        </Text>
      </View>

      {/* Trademark Notice */}
      <View style={styles.section}>
        <Text style={styles.heading} selectable>TRADEMARK NOTICE</Text>
        <Text style={styles.body} selectable>
          All product names, logos, brands, and registered trademarks — including but not limited to
          Chase, SoFi, Wealthfront, Marcus by Goldman Sachs, Capital One, Discover, American
          Express, Citi, Bank of America, Wells Fargo, and Robinhood — are the property of their
          respective trademark holders. Use of these names and marks does not imply endorsement,
          sponsorship, or affiliation with this application. These trademark holders do not sponsor,
          endorse, or affiliate with the developer or publisher of this application in any capacity.
        </Text>
      </View>

      {/* Copyright */}
      <View style={styles.copyrightRow}>
        <Text style={styles.copyright} selectable>
          © 2025 US Savings Rate Hacker. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
    gap: 6,
  },
  heading: {
    fontFamily: Fonts.semiBold,
    fontSize: 10,
    color: '#94A3B8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#475569',
    lineHeight: 16,
  },
  copyrightRow: {
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    alignItems: 'center',
  },
  copyright: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: '#475569',
    letterSpacing: 0.2,
  },
});
