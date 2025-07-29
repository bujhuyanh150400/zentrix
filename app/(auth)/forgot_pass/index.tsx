import {ForgotPasswordRequest} from "@/services/auth/@type";
import {useApiErrorHandler} from "@/hooks/useHandleError";
import {useFormForgotPassword, useMutationForgotPassword} from "@/services/auth/hook";
import {useForgotPassStore} from "@/services/auth/store";
import {router} from "expo-router";
import {useCallback} from "react";
import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native";
import {Button, Form, H6, Input, Label, Spinner, YStack} from "tamagui";
import {Controller} from "react-hook-form";
import {useHeaderHeight} from "@react-navigation/elements";
import DefaultColor from "@/components/ui/DefaultColor";
import {SafeAreaView} from "react-native-safe-area-context";


export default function ForgotPasswordScreen() {

    const handleErrorApi = useApiErrorHandler<ForgotPasswordRequest>();

    const {control, handleSubmit, formState: {errors, isSubmitting}, setError, reset, getValues} = useFormForgotPassword();

    const setEmail = useForgotPassStore(s => s.setEmail)

    const { mutate, isPending } = useMutationForgotPassword({
        onSuccess: async () => {
            const form = getValues();
            setEmail(form.email)
            reset();
            router.replace('/(auth)/forgot_pass/verify')
        },
        onError: (error) => {
            handleErrorApi({error, setError});
        }
    })
    const onSubmit = useCallback((data: ForgotPasswordRequest) => {
        mutate(data);
    },[mutate])

    return (
        <SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={useHeaderHeight()}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form gap="$4" padding="$6" onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$4">
                            <H6 fontWeight="bold">Vui lòng điền email quên mật khẩu</H6>
                            <Controller
                                control={control}
                                name="email"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label htmlFor="email_forgot_password">Email của bạn</Label>
                                        <Input
                                            id="email_forgot_password"
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
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting || isPending}
                                theme="active"
                                size="$4"
                                icon={isSubmitting || isPending ? <Spinner/> : undefined}
                            >
                                {isSubmitting || isPending ? 'Đang gửi...' : 'Tiếp tục'}
                            </Button>
                        </YStack>
                    </Form>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}