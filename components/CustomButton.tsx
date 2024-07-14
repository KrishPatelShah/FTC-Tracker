import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type ButtonProps = {
    widthPercent : number
    heightPercent : number
    color : string
    text : string
    borderRadius : number
    fontSize: number
    onPress: () => void;
};

//  <Text style={[styles.buttonText, {left: 250}]} 
//  const formattedWidth = `'${widthPercent}%'`;
const CustomButton: React.FC<ButtonProps> = ({widthPercent, heightPercent, color, text, fontSize, borderRadius, onPress}) => {
    return( 
        <TouchableOpacity onPress={onPress} style={[
            styles.container, 
                {
                    height : `${heightPercent}%`,
                    width : `${widthPercent}%`,
                    backgroundColor : color,
                    borderRadius : borderRadius
                },
            ]}
        >
            <Text style={[styles.buttonText, {fontSize: fontSize}]}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',  
        alignItems: 'center',     
    },

    buttonText:{
        color: '#fff',
    },
});

export default CustomButton; // has to be the same as the file name