import {ReactNode, useCallback} from "react";
import {View, StyleSheet} from "react-native";
import {Button, Circle, H5, Paragraph, YStack} from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useFocusEffect, useNavigation} from "expo-router";
import DefaultColor from "@/components/ui/DefaultColor";

type SuccessScreenPropsType = {
    title: string;
    messages: string[];
    buttonText: string;
    onButtonPress: () => void;
    icon?: ReactNode;
};

export default function SuccessView(
    {
        title,
        messages,
        buttonText,
        onButtonPress,
        icon,
    }: SuccessScreenPropsType) {
    // chặn hành vi vuốt về
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({gestureEnabled: false});
            return () => {
                navigation.setOptions({gestureEnabled: true});
            };
        }, [navigation])
    );
    return (
        <View style={styles.container}>
            <YStack gap="$4" padding="$4" alignItems="center" justifyContent="center">
                <Circle size={150} backgroundColor="$green4" alignItems="center" justifyContent="center">
                    <Circle size={100} backgroundColor="$green5" alignItems="center" justifyContent="center">
                        {icon ?? <AntDesign name="check" size={60} color="#3ecf65"/>}
                    </Circle>
                </Circle>

                <H5 style={styles.title}>{title}</H5>

                <YStack gap="$2" alignItems="center" justifyContent="center">
                    {messages.map((msg, idx) => (
                        <Paragraph style={styles.message} key={idx}>{msg}</Paragraph>
                    ))}
                </YStack>

                <Button
                    size="$4"
                    backgroundColor="$green8"
                    color="white"
                    borderColor="$green6"
                    theme="active"
                    onPress={onButtonPress}
                >
                    {buttonText}
                </Button>
            </YStack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: DefaultColor.white
    },
    title: {
        textAlign: 'center',
        alignSelf: 'stretch',
        fontWeight: 700
    },
    message: {
        textAlign: 'center',
        alignSelf: 'stretch'
    }
})