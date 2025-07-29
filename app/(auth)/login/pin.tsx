import {Alert, KeyboardAvoidingView, Platform, View, Text, TextInput as RNTextInput} from "react-native";
import {pinStyles} from "@/components/ui/DefaultStyle";
import DefaultColor from "@/components/ui/DefaultColor";
import useDisableBackGesture from "@/hooks/useDisableBackGesture";
import {RefObject, useCallback, useEffect, useState} from "react";
import useCheckBiometrics from "@/hooks/useCheckBiometrics";
import {CodeField, useBlurOnFulfill, useClearByFocusCell, Cursor} from "react-native-confirmation-code-field";
import {CELL_PIN_INPUT} from "@/libs/constant_env";
import {useAuthStore} from "@/services/auth/store";
import * as LocalAuthentication from "expo-local-authentication";
import {router} from "expo-router";
import {showMessage} from "react-native-flash-message";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Circle, H6, YStack} from "tamagui";
import {AntDesign} from "@expo/vector-icons";
import {useHeaderHeight} from "@react-navigation/elements";


export default function EnterPinScreen() {
    // chặn hành vi vuốt về
    useDisableBackGesture();

    const login = useAuthStore(s => s.login);


    const [pin, setPin] = useState<string>('');
    const [acceptPin, setAcceptPin] = useState<boolean>(false);

    const hasBiometrics = useCheckBiometrics();

    const ref = useBlurOnFulfill({value: pin, cellCount: CELL_PIN_INPUT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: pin,
        setValue: setPin,
    });

    useEffect(() => {
        setAcceptPin(pin.length === CELL_PIN_INPUT);
    }, [pin]);

    const handleAcceptPin = useCallback(async () => {
        Alert.alert(
            "Xác nhận",
            "Nếu bạn đồng ý, mã PIN sẽ được lưu trữ trên thiết bị của bạn và sẽ được sử dụng để xác thực",
            [
                {text: "Huỷ", style: "cancel"},
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        let checkAuthBiometric = true;
                        try {
                            if (hasBiometrics) {
                                const auth = await LocalAuthentication.authenticateAsync({
                                    promptMessage:
                                        hasBiometrics
                                            ? "Dùng vân tay hoặc nhận diện khuôn mặt để xác thực"
                                            : "Nhập mã PIN của bạn",
                                    fallbackLabel: "Dùng mật khẩu PIN",
                                    cancelLabel: "Hủy bỏ",
                                    disableDeviceFallback: false,
                                });
                                checkAuthBiometric = auth.success;
                            }

                            if (checkAuthBiometric) {
                                await login(pin);
                                router.replace('/(app)/(tab)');
                            } else {
                                showMessage({
                                    message: "Hệ thống xác thực không thành công, vui lòng thử lại",
                                    type: 'danger',
                                    duration: 3000,
                                });
                            }
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (_) {
                            showMessage({
                                message: "Có lỗi xảy ra, vui lòng thử lại.",
                                type: 'danger',
                                duration: 3000,
                            });
                        }
                    }
                }
            ],
            {cancelable: true}
        );
    }, [hasBiometrics, login, pin])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: DefaultColor.white}} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={useHeaderHeight()}
            >
                <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <YStack gap="$4" padding="$8" alignItems="center" justifyContent="center">
                        <Circle size={100} backgroundColor="#ededed" alignItems="center" justifyContent="center">
                            <Circle size={80} backgroundColor="#e8e8e8" alignItems="center" justifyContent="center">
                                <AntDesign name="lock" size={40} color="#b5b5b5"/>
                            </Circle>
                        </Circle>
                        <H6 style={{
                            fontWeight: 'bold',
                        }}>Xin hãy nhập mã PIN</H6>
                        <CodeField
                            ref={ref as RefObject<RNTextInput>}
                            {...props}
                            autoFocus={true}
                            InputComponent={RNTextInput}
                            caretHidden={true}
                            value={pin}
                            onChangeText={setPin}
                            cellCount={CELL_PIN_INPUT}
                            rootStyle={pinStyles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            autoComplete="one-time-code"
                            renderCell={({index, symbol, isFocused}) => (
                                <Text
                                    key={index}
                                    style={[pinStyles.cell, isFocused && pinStyles.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol ? symbol : isFocused ? <Cursor/> : null}
                                </Text>
                            )}
                        />
                    </YStack>
                    <Button
                        disabled={!acceptPin}
                        size="$4" theme="active"
                        onPress={handleAcceptPin}
                        icon={!acceptPin ? <AntDesign name="lock"/> : <AntDesign name="check"/>}
                    >
                        {acceptPin ? "Xác thực mã PIN" : "Vui lòng nhập mã PIN trước"}
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}
