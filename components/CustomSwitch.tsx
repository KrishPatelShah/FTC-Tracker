import { Image, StyleSheet, Platform, View, Text, TouchableWithoutFeedback, Pressable } from 'react-native';
import React, {useState, useEffect, } from 'react';
import Animated, {
    interpolateColor,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    useDerivedValue,
} from 'react-native-reanimated';

type SwitchProps = {
    activeColor : string,
    inactiveColor : string,
};
const CustomSwitch: React.FC<SwitchProps> = ({activeColor, inactiveColor}) =>{
    const [active, setActive] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const switchTranslate = useSharedValue(0);

    useEffect(()=>{
        if(active){
            switchTranslate.value = 200; 
            setDisplayText('<Events here>');
            
        }
        else{
            switchTranslate.value = 0;
            setDisplayText('<Teams here>');
        }
    }, [active, switchTranslate])

    // Animation for the actual switch knob
    const customSpringStyles = useAnimatedStyle(() => {
        return{
            transform: [{
                translateX: withSpring(switchTranslate.value, 
                {
                    mass:0.5,
                    damping:50,
                    stiffness: 150,
                    overshootClamping: true,
                    restSpeedThreshold: .001, 
                    restDisplacementThreshold: .001     
                })
            }]
        };   
    });

    // Styling for the background of the switch   
    const progress = useDerivedValue(() => {
        return withTiming(active ? 22 : 0);
    });
    const backgroundColorStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(progress.value, [0,1], [activeColor, inactiveColor])

        return {
            backgroundColor
        };
    });

    return( 
        <View>
            <Pressable onPress={() => {setActive(!active)}}>   
                <Animated.View style={[styles.container, backgroundColorStyle]}> 
                    <Animated.View style={[styles.circle, customSpringStyles]}/>
                </Animated.View>
                <Text style={[styles.buttonText]} onPress={() => {setActive(!active)}}>Teams</Text>
                <Text style={[styles.buttonText, {left: 250}]} onPress={() => {setActive(!active)}}>Events</Text> 
            </Pressable>
            <Text style={styles.text}>{displayText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        width: 400,
        height: 60,
        borderRadius: 10,
        borderColor: '#454444',
        borderWidth: 1,
        justifyContent: 'center',
    },
    circle:{
        width:200,
        height:60,
        backgroundColor: '#328aff',
        borderRadius: 10, 
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },  
    },
    buttonText:{
        fontSize: 35,
        color: 'white',
        position: 'absolute',
        left: 38,
        top: 5
    },
    text: {
        fontSize: 35,
        top: 35,
        color: 'white',
        position: 'relative',
        alignSelf: 'center',
      },
});

export default CustomSwitch; // has to be the same as the file name