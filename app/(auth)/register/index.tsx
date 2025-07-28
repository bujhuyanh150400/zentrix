import {useCallback, useState} from "react";
import {useFormRegister, useMutationRegister} from "@/services/auth/hook";
import {useApiErrorHandler} from "@/hooks/useHandleError";
import {FormRegisterType, RegisterRequest} from "@/services/auth/@type";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Keyboard, KeyboardAvoidingView, Platform} from "react-native";
import {TouchableWithoutFeedback} from "@gorhom/bottom-sheet";
import {Button, H6, Input, Label, Spinner, XStack, YStack} from "tamagui";
import {Controller} from "react-hook-form";
import {AntDesign} from "@expo/vector-icons";


export default function RegisterScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleErrorApi = useApiErrorHandler<RegisterRequest>();

    const {control, handleSubmit, formState: {errors, isSubmitting}, setError, reset} = useFormRegister()

    const {mutate, isPending} = useMutationRegister({
        onSuccess: async () => {
            reset();
            router.replace('/(auth)/register/success')
        },
        onError: (error) => handleErrorApi({error, setError})
    });

    const onSubmit = useCallback((data: FormRegisterType) => {
        const request = {
            name: data.name,
            email: data.email,
            password: data.password,
        }
        mutate(request);
    }, [mutate]);

    return (
        <SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={24}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <YStack gap="$4">
                        <H6 fontWeight="bold">Vui lòng điền thông tin đăng ký tài khoản</H6>
                        <Controller
                            control={control}
                            name="name"
                            render={({field: {onChange, onBlur, value}}) => (
                                <YStack gap="$2">
                                    <Input
                                        id="name"
                                        placeholder="Tên của bạn"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                        borderColor={!!errors.name ? 'red' : '$borderColor'}
                                    />
                                    {!!errors.name && (
                                        <Label color="red" size="$2">
                                            {errors.name.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({field: {onChange, onBlur, value}}) => (
                                <YStack gap="$2">
                                    <Input
                                        id="email_register"
                                        placeholder="Email của bạn"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        borderColor={!!errors.email ? 'red' : '$borderColor'}
                                    />
                                    {!!errors.email && (
                                        <Label color="red" size="$2">
                                            {errors.email.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({field: {onChange, onBlur, value}}) => (
                                <YStack gap="$2">
                                    <XStack
                                        alignItems="center"
                                        borderRadius="$4"
                                        borderWidth={1}
                                        borderColor={!!errors.password ? 'red' : '$borderColor'}
                                    >
                                        <Input
                                            id="password"
                                            flex={1}
                                            placeholder="Mật khẩu"
                                            value={value}
                                            borderWidth={0}
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
                            name="confirm_password"
                            render={({field: {onChange, onBlur, value}}) => (
                                <YStack gap="$2">
                                    <XStack
                                        alignItems="center"
                                        borderRadius="$4"
                                        borderWidth={1}
                                        borderColor={!!errors.confirm_password ? 'red' : '$borderColor'}
                                    >
                                        <Input
                                            id="password_register"
                                            flex={1}
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
                                    {!!errors.confirm_password && (
                                        <Label color="red" size="$2">
                                            {errors.confirm_password.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        <Button
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            theme="yellow"
                            size="$4"
                            marginTop="$4"
                            icon={isSubmitting || isPending ? <Spinner/> : undefined}
                        >
                            {isSubmitting || isPending ? 'Đang gửi...' : 'Đăng ký'}
                        </Button>
                    </YStack>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}