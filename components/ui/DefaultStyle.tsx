import {StyleSheet} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";

export const sizeDefault = {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
}

export const pinStyles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: sizeDefault['4xl']
    },
    codeFieldRoot: {
        marginTop: 20
    },
    cell: {
        width: 45,
        height: 45,
        lineHeight: 45,
        fontSize: sizeDefault['lg'],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: DefaultColor.slate[200],
        textAlign: 'center',
        margin: 5
    },
    focusCell: {
        borderColor: DefaultColor.black,
    },
});

export const appTabStyle = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: DefaultColor.white,
        borderTopWidth: 0,
    }
});


const DefaultStyle = StyleSheet.create({
    circleButton: {
        width: 45,
        height: 45,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleButtonSmall: {
        width: 35,
        height: 35,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeCircle: {
        width: 24,
        height: 24,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: DefaultColor.slate[300],
    }
})

export default DefaultStyle;
