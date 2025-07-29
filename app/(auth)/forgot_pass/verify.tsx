import useDisableBackGesture from "@/hooks/useDisableBackGesture";
import {useEffect, useState} from "react";
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from "react-native-confirmation-code-field";
import {useForgotPassStore} from "@/services/auth/store";
import {CELL_PIN_INPUT} from "@/libs/constant_env";
import {useMutationVerifyForgotPassword} from "@/services/auth/hook";
import {router} from "expo-router";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAvoidingView, Platform, View, Text, TextInput as RNTextInput} from "react-native";
import {H6, Paragraph, Spinner, YStack} from "tamagui";
import {pinStyles} from "@/components/ui/DefaultStyle";


export default function VerifyCodeForgotPassScreen() {

    // chặn hành vi vuốt về
    useDisableBackGesture();

    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState<string>('');

    const ref = useBlurOnFulfill({value: pin, cellCount: CELL_PIN_INPUT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: pin,
        setValue: setPin,
    });

    const {setCode, email} = useForgotPassStore();

    const {mutate, isPending} = useMutationVerifyForgotPassword({
        onSuccess: async () => {
            setCode(pin);
            router.replace('/(auth)/reset_pass')
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error)
        }
    })

    useEffect(() => {
        if (pin.length === CELL_PIN_INPUT) {
            if (email) {
                mutate({
                    email: email,
                    code: pin
                })
            } else {
                setError('Có lỗi xảy ra, vui lòng thử lại sau')
            }
        } else {
            setError("")
        }
    }, [email, mutate, pin]);


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={64}
            >
                <View
                      style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                    <YStack gap="$2" padding="$6" alignItems="center" justifyContent="center">
                        <H6 fontWeight="bold">Xin hãy nhập mã xác thực</H6>
                        <Paragraph style={{textAlign: 'justify', alignSelf: 'stretch'}}>Mã xác thực đổi mật khẩu đã được
                            gửi về mail của bạn, vui lòng check mail và nhập mã xác thực</Paragraph>
                        {isPending
                            ? <Spinner size="large" color="$blue10"/>
                            :
                            <CodeField
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
                                        {symbol ? symbol : isFocused ? <Cursor/> : null}
                                    </Text>
                                )}
                            />
                        }
                        <Paragraph size="$2" color="$red10">
                            {error}
                        </Paragraph>
                    </YStack>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}