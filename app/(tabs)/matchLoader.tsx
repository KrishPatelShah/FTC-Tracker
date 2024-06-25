import { Image, View, Text } from 'react-native';
import { global_styles } from '@/styles';

export default function HomeScreen() {




  return (
    <View style = {global_styles.background}>
        <Image 
            source = {require("@/assets/images/logo.png")} 
            style = {global_styles.image}
        />
        <Text style = {global_styles.text}>
            Match Loader
        </Text>
    </View>
  );
}


