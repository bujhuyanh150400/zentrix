import {useFormLogin, useMutationLogin} from "@/services/auth/hook";
import {useCallback, useState} from "react";
import {useAuthStore} from "@/services/auth/store";
import {useApiErrorHandler} from "@/hooks/useHandleError";
import {LoginRequest} from "@/services/auth/@type";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Keyboard, KeyboardAvoidingView, Platform} from "react-native";
import {TouchableWithoutFeedback} from "@gorhom/bottom-sheet";
import {Button, Form, H6, Input, Label, Spinner, XStack, YStack} from "tamagui";
import {Controller} from "react-hook-form";
import {AntDesign} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


export default function LoginScreen() {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const {control, handleSubmit, formState: {errors, isSubmitting}, setError, reset} = useFormLogin();


    const setAuthData = useAuthStore(s =>s.setAuthData)

    const handleErrorApi = useApiErrorHandler<LoginRequest>();

    const { mutate, isPending } = useMutationLogin({
        onSuccess: async (data) => {
            setAuthData(data);
            reset();
            router.replace('/(auth)/login/pin')
        },
        onError: (error) => {
            handleErrorApi({error, setError});
        }
    });

    const onSubmit = useCallback((data: LoginRequest) => {
        mutate(data);
    },[mutate])

    return (
        <SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form gap="$4" paddingHorizontal="$6" paddingBottom="$6" onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$2">
                            <H6 fontWeight="bold">Vui lòng điền địa chỉ email và mật khẩu</H6>
                            <Label htmlFor="email">Email của bạn</Label>
                            <Controller
                                control={control}
                                name="email"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <Input
                                        id="email"
                                        placeholder="example@email.com"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        borderColor={!!errors.email ? 'red' : '$borderColor'}
                                    />
                                )}
                            />
                            {!!errors.email && (
                                <Label color="red" size="$2">
                                    {errors.email.message}
                                </Label>
                            )}

                            <Label htmlFor="password">Mật khẩu</Label>
                            <Controller
                                control={control}
                                name="password"
                                render={({field: {onChange, onBlur, value}}) => (
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
                                )}
                            />
                            {!!errors.password && (
                                <Label color="red" size="$2">
                                    {errors.password.message}
                                </Label>
                            )}
                        </YStack>
                        <YStack gap="$2">
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting || isPending}
                                theme="active"
                                size="$4"
                                icon={isSubmitting || isPending ? <Spinner/> : undefined}
                            >
                                {isSubmitting || isPending ? 'Đang gửi...' : 'Đăng nhập'}
                            </Button>
                            <Button
                                onPress={() => router.push('/(auth)/forgot_pass')}
                                disabled={isSubmitting || isPending}
                                size="$4"
                                variant="outlined"
                            >
                                {isSubmitting || isPending ? <Spinner/> : 'Quên mật khẩu'}
                            </Button>
                        </YStack>
                    </Form>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </SafeAreaView>

    )
}