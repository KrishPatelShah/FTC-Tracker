import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Title, Paragraph } from 'react-native-paper';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.heading}>FTC Tracker Privacy Policy</Title>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        {'\n'}
        Welcome to FTC Tracker. We value your privacy and are committed to protecting your personal information.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        {'\n'}
        - Personal Information: When you use FTC Tracker, we may collect personal information such as your name, email address, and other contact details.
        {'\n'}
        - Usage Data: We may collect data on how the app is accessed and used. This may include information such as your device's Internet Protocol (IP) address, browser type, browser version, the pages of our app that you visit, and other diagnostic data.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        {'\n'}
        We use the collected data for various purposes:
        {'\n'}
        - To provide and maintain our service
        {'\n'}
        - To notify you about changes to our service
        {'\n'}
        - To allow you to participate in interactive features of our service when you choose to do so
        {'\n'}
        - To provide customer support
        {'\n'}
        - To monitor the usage of our service
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>4. Security</Text>
        {'\n'}
        The security of your data is important to us. We strive to use commercially acceptable means to protect your personal information.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>5. Changes to This Privacy Policy</Text>
        {'\n'}
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>6. Contact Us</Text>
        {'\n'}
        If you have any questions about this Privacy Policy, please contact us at krish.patelshah@gmail.com.
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

