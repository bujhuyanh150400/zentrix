import useDisableBackGesture from "@/hooks/useDisableBackGesture";
import {useCallback, useEffect, useState} from "react";
import {useAuthStore} from "@/services/auth/store";
import useCheckBiometrics from "@/hooks/useCheckBiometrics";
import {CodeField, useBlurOnFulfill, useClearByFocusCell, Cursor} from "react-native-confirmation-code-field";
import {CELL_PIN_INPUT, MAXIMUM_ERROR_ENTER_PIN} from "@/libs/constant_env";
import {router, useFocusEffect} from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import {useQueryGetUserProfile} from "@/services/auth/hook";
import {showMessage} from "react-native-flash-message";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAvoidingView, Platform, View, TextInput as RNTextInput, Text} from "react-native";
import {Circle, H6, Spinner, YStack} from "tamagui";
import {AntDesign} from "@expo/vector-icons";
import {pinStyles} from "@/components/ui/DefaultStyle";
import {useHeaderHeight} from "@react-navigation/elements";


export default function VerifyScreen() {
    // chặn hành vi vuốt về
    useDisableBackGesture();

    const [pin, setPin] = useState<string>('');

    const [pinError, setPinError] = useState(0);

    const {verify, pin_code, logout} = useAuthStore();

    const hasBiometrics = useCheckBiometrics();

    const ref = useBlurOnFulfill({value: pin, cellCount: CELL_PIN_INPUT});

    const logoutError = useCallback((message: string = "Có lỗi không mong muốn xảy ra, vui lòng đăng nhập lại") => {
        logout();
        router.replace('/(auth)');
        showMessage({
            message,
            type: "danger",
            icon: "danger",
            duration: 2000,
        });
    }, [logout])

    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: pin,
        setValue: setPin,
    });

    const {refetch, isLoading, isSuccess, isError, data} = useQueryGetUserProfile();

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const authenticate = async () => {
                try {
                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: hasBiometrics
                            ? "Dùng vân tay hoặc nhận diện khuôn mặt để xác thực"
                            : "Nhập mã PIN của bạn",
                        fallbackLabel: "Dùng mật khẩu PIN",
                        cancelLabel: "Hủy bỏ",
                        disableDeviceFallback: false,
                    });
                    if (result.success && isActive) {
                        refetch();
                    }
                } catch (err) {
                    console.warn("Biometric error", err);
                }
            };
            authenticate().then();
            return () => {
                isActive = false;
            };
        }, [hasBiometrics, refetch])
    );

    useEffect(() => {
        if (pin.length === CELL_PIN_INPUT) {
            if (pin === pin_code) {
                refetch()
            } else if (pinError === MAXIMUM_ERROR_ENTER_PIN) {
                logoutError("Bạn đã nhập mã pin sai quá 5 lần, vui lòng đăng nhập lại")
            } else {
                setPinError(pinError + 1);
                showMessage({
                    message: `Mã PIN không chính xác, số lần còn lại ${MAXIMUM_ERROR_ENTER_PIN - pinError}`,
                    type: "danger",
                    icon: "danger",
                    duration: 2000,
                });
            }
        }
    }, [pin, pin_code]);

    useEffect(() => {
        if (isSuccess && data) {
            verify(data).then((status) => {
                if (status) {
                    router.replace('/(app)/(tab)')
                } else {
                    logoutError()
                }
            }).catch(() => {
                logoutError()
            });
        } else if (isError) {
            logoutError('Thông tin xác thực của bạn hiện không đúng, vui lòng đăng nhập lại');
        }
    }, [isSuccess, isError, data, verify, logoutError]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
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
                        <H6 style={{fontWeight: 'bold'}}>Xin hãy nhập mã PIN</H6>
                        {isLoading
                            ? <Spinner size="large" color="$blue10"/>
                            : <CodeField
                                ref={ref as React.RefObject<RNTextInput>}
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
                                        {symbol ? "." : isFocused ? <Cursor/> : null}
                                    </Text>
                                )}
                            />
                        }
                    </YStack>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}