import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Title, Paragraph } from 'react-native-paper';

export default function TermsOfServiceScreen() {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.heading}>FTC Tracker Terms of Service</Title>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        {'\n'}
        By using FTC Tracker, you agree to be bound by these Terms of Service.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>2. Use of the Service</Text>
        {'\n'}
        You agree to use FTC Tracker in compliance with all applicable laws and regulations.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        {'\n'}
        You may need to create an account to use certain features of FTC Tracker. You are responsible for maintaining the confidentiality of your account information.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>4. Termination</Text>
        {'\n'}
        We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach these Terms.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        {'\n'}
        FTC Tracker is provided on an "as is" and "as available" basis. We do not warrant that the service will be uninterrupted or error-free.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
        {'\n'}
        We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        {'\n'}
        If you have any questions about these Terms, please contact us at [your contact email].
      </Paragraph>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#101010',
    paddingTop: 100,
    paddingLeft: '5%',
    paddingRight: '5%',
    flex: 1,
  },
  heading: {
    color: '#1E90FF', 
    marginBottom: 20,
  },
  paragraph: {
    color: '#E0E0E0',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1E90FF',
  },
});

