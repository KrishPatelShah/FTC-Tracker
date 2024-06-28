import { StyleSheet, Image } from 'react-native';

// Just a component used in 'App.js'
export default function ImageViewer({ placeholderImageSource, selectedImage  }) {
  const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;
  return <Image source={imageSource} style={styles.image} />;
  
  // The <Image> component uses a conditional operator to load the source of the image. 
  // This is because the image picked from the image picker is a uri string, not a local asset like the placeholder image.
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff'
  },
});
