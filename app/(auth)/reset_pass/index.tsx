import useDisableBackGesture from "@/hooks/useDisableBackGesture";
import {ResetPasswordFormType, ResetPasswordRequest} from "@/services/auth/@type";
import {useApiErrorHandler} from "@/hooks/useHandleError";
import {useCallback, useState} from "react";
import {useFormResetPassword, useMutationResetPassword} from "@/services/auth/hook";
import {useForgotPassStore} from "@/services/auth/store";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import {Button, Form, H6, Input, Label, Spinner, XStack, YStack} from "tamagui";
import {Controller} from "react-hook-form";
import {AntDesign} from "@expo/vector-icons";
import {useHeaderHeight} from "@react-navigation/elements";


export default function ResetPasswordScreen() {

    // chặn hành vi vuốt về
    useDisableBackGesture();

    const handleErrorApi = useApiErrorHandler<ResetPasswordRequest>();

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,
        reset,
    } = useFormResetPassword();

    const {code, email, setEmpty} = useForgotPassStore()

    const {mutate, isPending} =useMutationResetPassword({
        onSuccess: async () => {
            reset();
            setEmpty();
            router.replace('/(auth)/reset_pass/success')
        },
        onError: (error) => {
            handleErrorApi({error, setError});
        }
    })

    const onSubmit = useCallback((data: ResetPasswordFormType) => {
        if (email && code) {
            const form = {...data, email, code}
            mutate(form);
        }
    }, [email, code, mutate]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={useHeaderHeight()}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form gap="$4" padding="$6" onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$4">
                            <H6 fontWeight="bold">Vui lòng điền mật khẩu mới</H6>
                            <Controller
                                control={control}
                                name="password"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label htmlFor="password">Mật khẩu mới</Label>
                                        <XStack
                                            backgroundColor="white"
                                            alignItems="center"
                                            borderRadius="$4"
                                            borderWidth={1}
                                            borderColor={!!errors.password ? 'red' : '$borderColor'}
                                        >
                                            <Input
                                                backgroundColor="white"
                                                borderWidth={0}
                                                id="password"
                                                flex={1}
                                                placeholder="Mật khẩu"
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry={!showPassword}
                                                paddingRight="$10"
                                            />
                                            <XStack
                                                paddingHorizontal="$3"
                                                onPress={() => setShowPassword((prev) => !prev)}
                                                cursor="pointer"
                                            >
                                                {showPassword ? (
                                                    <AntDesign name="unlock" size={18} color="black"/>
                                                ) : (
                                                    <AntDesign name="lock1" size={18} color="black"/>
                                                )}
                                            </XStack>
                                        </XStack>
                                        {!!errors.password && (
                                            <Label color="red" size="$2">
                                                {errors.password.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />

                            <Controller
                                control={control}
                                name="password_confirmation"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label htmlFor="password_confirmation">Xác nhận lại mật khẩu</Label>
                                        <XStack
                                            alignItems="center"
                                            borderRadius="$4"
                                            borderWidth={1}
                                            backgroundColor="white"
                                            borderColor={!!errors.password ? 'red' : '$borderColor'}
                                        >
                                            <Input
                                                id="password_confirmation"
                                                flex={1}
                                                backgroundColor="white"
                                                borderWidth={0}
                                                placeholder="Xác nhận mật khẩu"
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry={!showPasswordConfirm}
                                                paddingRight="$10"
                                            />
                                            <XStack
                                                paddingHorizontal="$3"
                                                onPress={() => setShowPasswordConfirm((prev) => !prev)}
                                                cursor="pointer"
                                            >
                                                {showPasswordConfirm ? (
                                                    <AntDesign name="unlock" size={18} color="black"/>
                                                ) : (
                                                    <AntDesign name="lock1" size={18} color="black"/>
                                                )}
                                            </XStack>
                                        </XStack>
                                        {!!errors.password_confirmation && (
                                            <Label color="red" size="$2">
                                                {errors.password_confirmation.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />

                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting || isPending}
                                theme="active"
                                size="$4"
                                marginTop={40}
                                icon={isSubmitting || isPending ? <Spinner/> : undefined}
                            >
                                {isSubmitting || isPending ? 'Đang gửi...' : 'Xác nhận'}
                            </Button>
                        </YStack>
                    </Form>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}