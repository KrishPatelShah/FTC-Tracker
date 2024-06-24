import { StyleSheet} from 'react-native';


export const global_styles = StyleSheet.create({
    text: {
        color : "white",
        fontSize : 26,
        bottom : 120,
        marginLeft : 50,
    },
    background: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding : 20,
        backgroundColor: '#101010',
    },
    button: {
        color : "#191919"
    },
    image: {
        bottom : 120,
        width : 100,
        height : 100,
        left : 30,
    }
})