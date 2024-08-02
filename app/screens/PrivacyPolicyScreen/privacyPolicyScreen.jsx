import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>FTC Tracker Privacy Policy</Text>
      <Text style={styles.paragraph}>
        1. Introduction
        Welcome to FTC Tracker. We value your privacy and are committed to protecting your personal information.
      </Text>
      <Text style={styles.paragraph}>
        2. Information We Collect
        - Personal Information: When you use FTC Tracker, we may collect personal information such as your name, email address, and other contact details.
        - Usage Data: We may collect data on how the app is accessed and used. This may include information such as your device's Internet Protocol (IP) address, browser type, browser version, the pages of our app that you visit, and other diagnostic data.
      </Text>
      <Text style={styles.paragraph}>
        3. How We Use Your Information
        We use the collected data for various purposes:
        - To provide and maintain our service
        - To notify you about changes to our service
        - To allow you to participate in interactive features of our service when you choose to do so
        - To provide customer support
        - To monitor the usage of our service
      </Text>
      <Text style={styles.paragraph}>
        4. Security
        The security of your data is important to us. We strive to use commercially acceptable means to protect your personal information.
      </Text>
      <Text style={styles.paragraph}>
        5. Changes to This Privacy Policy
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </Text>
      <Text style={styles.paragraph}>
        6. Contact Us
        If you have any questions about this Privacy Policy, please contact us at [your contact email].
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#101010',
        paddingTop: 100,
        flex: 1,
        paddingLeft: '5%',
        paddingRight: '5%',
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
