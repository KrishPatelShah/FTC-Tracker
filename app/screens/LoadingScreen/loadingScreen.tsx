import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '@/app/navigation/types';

export default function LoadingScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return(
        <View style = {styles.container}>
            <Image
                source={require("@/assets/images/UpdatedFTCTrackerLogo.png")}
                style={styles.logo}
            />
        </View>
    )

}


const styles = StyleSheet.create({
container:{
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
},
logo: {
    width: 360,
    height: 360,
  },
})