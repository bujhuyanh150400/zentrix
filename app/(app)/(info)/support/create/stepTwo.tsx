import {Button, Form, Label, TextArea, YStack} from "tamagui";
import SelectFields from "@/components/SelectFields";
import {Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from "react-native";
import {useFormSupportStepTwo, useMutationCreateTicket} from "@/services/ticket/hook";
import {useAppStore} from "@/services/app/store";
import {showMessage} from "react-native-flash-message";
import {router} from "expo-router";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {formSupportStore} from "@/services/ticket/store";
import { useCallback} from "react";
import {_SupportTicketPriority, FormSupportStepTwo} from "@/services/ticket/@types";
import { Controller } from "react-hook-form";
import DefaultColor from "@/components/ui/DefaultColor";

export default function stepTwoScreen () {

    const {control, handleSubmit, formState: {errors}} = useFormSupportStepTwo();

    const setLoading = useAppStore(state => state.setLoading);

    const {form_step_1, clearStepOne} = formSupportStore()

    const {mutate, isPending} = useMutationCreateTicket({
        onSuccess: async () => {
            setLoading(false)
            clearStepOne()
            showMessage({
                message: "Gửi yêu cầu hỗ trợ thành công",
                description: "Chúng tôi sẽ phản hồi trong thời gian sớm nhất, cam ơn bạn đã quan tâm sử dụng dịch vụ của chúng tôi.",
                type: 'success',
                duration: 3000,
            });
            router.replace('/(app)/(tab)/info');
        },
        onError: (error) => {
            setLoading(false)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error);
        },
    })
    const onSubmit = useCallback((form: FormSupportStepTwo) => {
        if (form_step_1) {
            setLoading(true)
            mutate({...form_step_1,...form})
        }else{
            showMessage({
                message: "Có lỗi không mong muốn xảy ra, vui lòng thử lại sau.",
                type: 'warning',
                duration: 3000,
            });
        }
    }, [form_step_1]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, backgroundColor: "#fff"}}
            keyboardVerticalOffset={24}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Form
                    gap="$4"
                    height="100%"
                    flex={1}
                    paddingHorizontal="$6"
                    paddingVertical="$4"
                    justifyContent="space-between"
                    onSubmit={handleSubmit(onSubmit)}>
                    <YStack gap="$4" flex={1}>
                        <Controller
                            control={control}
                            name="priority"
                            render={({field: {onChange, value}}) => (
                                <YStack gap="$2">
                                    <Label size="$2">
                                        Độ ưu tiên
                                    </Label>
                                    <SelectFields
                                        backgroundColor={DefaultColor.white}
                                        options={[
                                            {label: "Thấp", value: _SupportTicketPriority.LOW},
                                            {label: "Trung bình", value: _SupportTicketPriority.MEDIUM},
                                            {label: "Cao", value: _SupportTicketPriority.HIGH},
                                        ]}
                                        value={`${value}`}
                                        onValueChange={onChange}
                                        placeholder="Chọn độ ưu tiên"
                                    />
                                    {!!errors.priority && (
                                        <Label color="red" size="$2">
                                            {errors.priority.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />
                        <Controller
                            control={control}
                            name="message"
                            render={({field: {onChange, onBlur, value}}) => (
                                <YStack gap="$2" flex={1}>
                                    <Label size="$2">
                                        Phản hồi
                                    </Label>
                                    <YStack flex={1} backgroundColor={DefaultColor.white} borderRadius={8}>
                                        <TextArea
                                            flex={1}
                                            id="message"
                                            value={value ?? ''}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder="Bạn hãy nhập phản hồi của mình tại đây, chúng tôi sẽ cố gắng phản hồi bạn sớm nhất"
                                            keyboardType="default"
                                            autoCapitalize="none"
                                            multiline
                                            borderColor={!!errors.message ? 'red' : '$borderColor'}
                                            backgroundColor={DefaultColor.white}
                                            style={{
                                                textAlignVertical: 'top',
                                                padding: 10,
                                            }}
                                        />
                                    </YStack>

                                    {!!errors.message && (
                                        <Label color="red" size="$2">
                                            {errors.message.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />
                    </YStack>
                    <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                            onPress={handleSubmit(onSubmit)}>
                        Gửi phản hồi
                    </Button>
                </Form>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}