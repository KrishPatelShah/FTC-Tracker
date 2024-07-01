import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Text, Button} from 'react-native';
import ImageViewer from './ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // I think this is only for javascript?
import { StackNavigationProp } from '@react-navigation/stack';

/*\
In TypeScript (.tsx) files, you create an object type mapping route names to their parameters to 
leverage TypeScript’s type-checking and type inference capabilities. This practice is not required in JavaScript (.js) 
files because JavaScript does not have built-in support for static type checking. 
\*/
const Stack = createNativeStackNavigator<RootStackParamList>();

type RootStackParamList = {
  Home: {name: string}, // undefined because you aren't passing any params to the home screen
  Profile: {name: string}; // I think it has to be the screen name, not the screen's component name
};

export default function App() {
    return(
      <NavigationContainer>
        <Stack.Navigator> 
          <Stack.Screen name = "Home" component={HomeScreen} options={{title:'Welcome ┬┴┬┴┤(･_├┬┴┬┴'}}/>
          <Stack.Screen name = "Profile" component={ProfileScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
 
  // you can also write 'function HomeScreen({ navigation }) {...}'
  type ProfileScreenNavigationProp = StackNavigationProp<
      RootStackParamList,
      'Home'
    >;

    type Props = {
      navigation: ProfileScreenNavigationProp;
    };

  const HomeScreen = ({navigation}: Props) => {
    type ProfileScreenNavigationProp = StackNavigationProp< RootStackParamList,'Home'>;
    return (
      <ScrollView>  
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', {name: 'Profile'})} style={styles.button}>
          <Text style={[styles.buttonText]}>Click here to see who the GOAT of JJK is</Text>
        </TouchableOpacity>
        <Image source = {{uri: 'https://pbs.twimg.com/media/FDRb2yjWYAQY8A4.jpg'}}
          style={styles.wojackImage}
        />
      </View>
      </ScrollView>  
    );
  };
  
  // In React Native, the Button component provided by the core library does not accept children elements, such as a <Text> 
  const ProfileScreen = ({navigation}: Props) => {
    const PlaceholderImage = require('./assets/images/Toji.jpg');
    const [selectedImage, setSelectedImage] = useState(''); // represents a selected image
  
    const pickImageAsync = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({ // returns an object containing information about the selected image.
        allowsEditing: true, // allows cropping 
        quality: 1,
      });
  
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri); // sets image to the "uri" element of the array that is returned by the "result" object
      }
      else {
        alert('You did not select any image.');
      }
    }
  
    return (
    <ScrollView>  
    <View style={styles.container}>
      <Text style={{fontSize: 200, color: '#fff', fontWeight: 'bold',  marginTop: 200, marginBottom: 1000}}>. . .</Text>
  
      <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage}/> 
  
      <Text style={{fontSize: 60, color: '#fff', fontWeight: 'bold',  marginTop: 20}}>It's Toji!</Text>
        <View style={styles.footerContainer}>
            <Button title="Choose a photo" onPress={pickImageAsync}></Button>
        </View>
      <TouchableOpacity onPress={() => navigation.navigate('Home', {name: 'Home'})} style={styles.button}>
          <Text style={[styles.buttonText]}>Go back</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#47494a'
    },
    button: {
      backgroundColor: '#00BAD4',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 5,
      marginBottom: 40,
      marginTop: 40
    },
    buttonText: {
      fontSize: 18,
      color: '#fff', // Default text color if not specified
      textDecorationLine: 'underline'
    },
    wojackImage:{
      width: 200,
      height: 200,
      marginBottom: 1000,
      marginTop: 40
    },
    footerContainer: {
      flex: 1 / 3,
      alignItems: 'center',
    },
  })

  // Each time you call .push() we add a new route to the navigation stack. 
  // When you call .navigate('name') it first tries to find an existing route with that name, and only pushes a new route if there isn't yet one on the stack.