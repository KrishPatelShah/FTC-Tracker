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
import {Dimensions} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const height = 48;
const width = windowWidth/1.15;
const switchTrackLength = width/2.014218009;
const borderRadius = 6;

type SwitchProps = {
    activeColor : string,
    inactiveColor : string,
    active : boolean,
    setActive : (item : boolean) => void,
};
const CustomSwitch: React.FC<SwitchProps> = ({activeColor, inactiveColor, active, setActive}) =>{
    const switchTranslate = useSharedValue(0);

    useEffect(()=>{
        if(active){
            switchTranslate.value = switchTrackLength;             
        }
        else{
            switchTranslate.value = 0;
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
            <Pressable style={styles.press} onPress={() => {setActive(!active)}}>   
                <Animated.View style={[styles.container, backgroundColorStyle]}> 
                    <Animated.View style={[styles.circle, customSpringStyles]}/>
                </Animated.View>

                <View style={styles.textPositioning}>
                    <Text style={[styles.buttonText]}>Teams</Text>
                    <Text style={[styles.buttonText, {}]}>Events</Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    press:{
        height: height,
        marginTop: '25%',
    },
    textPositioning:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        bottom: '12%', 
    },
    container:{
        width: width,
        height: height,
        borderRadius: borderRadius,
    },
    circle:{
        width:width/2,
        height: '100%',
        backgroundColor: '#328aff',
        borderRadius: borderRadius, 
        shadowOffset: {
            width: 0,
            height: 2
        },  
    },
    buttonText:{
        fontSize: 25,
        color: 'white',
    },

});

export default CustomSwitch; // has to be the same as the file name