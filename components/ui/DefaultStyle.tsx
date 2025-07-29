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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        borderTopWidth: 0,
        // SHADOW cho iOS
        shadowColor: DefaultColor.black,
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // SHADOW cho Android
        elevation: 10,
    }
});


const DefaultStyle = StyleSheet.create({
    circleButton: {
        width: 45,
        height: 45,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
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
