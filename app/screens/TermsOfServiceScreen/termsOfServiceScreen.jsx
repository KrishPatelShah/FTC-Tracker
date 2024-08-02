import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

export default function TermsOfServiceScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>FTC Tracker Terms of Service</Text>
      <Text style={styles.paragraph}>Effective Date: [Insert Date]</Text>
      <Text style={styles.paragraph}>
        1. Acceptance of Terms
        By using FTC Tracker, you agree to be bound by these Terms of Service.
      </Text>
      <Text style={styles.paragraph}>
        2. Use of the Service
        You agree to use FTC Tracker in compliance with all applicable laws and regulations.
      </Text>
      <Text style={styles.paragraph}>
        3. User Accounts
        You may need to create an account to use certain features of FTC Tracker. You are responsible for maintaining the confidentiality of your account information.
      </Text>
      <Text style={styles.paragraph}>
        4. Termination
        We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach these Terms.
      </Text>
      <Text style={styles.paragraph}>
        5. Limitation of Liability
        FTC Tracker is provided on an "as is" and "as available" basis. We do not warrant that the service will be uninterrupted or error-free.
      </Text>
      <Text style={styles.paragraph}>
        6. Changes to Terms
        We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
      </Text>
      <Text style={styles.paragraph}>
        7. Contact Us
        If you have any questions about these Terms, please contact us at [your contact email].
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#101010',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
});
