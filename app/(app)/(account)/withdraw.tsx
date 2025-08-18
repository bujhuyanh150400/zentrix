import {useGetAccountActive, useMutationWithdraw, useWithdrawAccountForm} from "@/services/account/hook";
import {useHeaderHeight} from "@react-navigation/elements";
import {useGetTWPrice} from "@/services/trade/hook";
import {BALANCE_SYMBOL_FOR_ACCOUNT_WALLET} from "@/libs/constant_env";
import {useAppStore} from "@/services/app/store";
import {Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";
import {Button, Form, Label, Paragraph, XStack, YStack} from "tamagui";
import {Controller} from "react-hook-form";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import {useCallback, useEffect} from "react";
import {_AccountType, WithdrawAccountRequest} from "@/services/account/@types";
import {showMessage} from "react-native-flash-message";
import {router} from "expo-router";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {generateUniqueIdRecharge} from "@/libs/utils";


export default function WithdrawScreen() {

    const queryAccountActive = useGetAccountActive();

    const account = queryAccountActive.account;

    const headerHeight = useHeaderHeight();

    const twPrice = useGetTWPrice(BALANCE_SYMBOL_FOR_ACCOUNT_WALLET);


    const setLoading = useAppStore(state => state.setLoading);

    const {control, handleSubmit, setValue, formState: {errors}, watch} = useWithdrawAccountForm();

    const money = watch('money')

    const {mutate, isPending} = useMutationWithdraw({
        onSuccess: async () => {
            showMessage({
                message: "Chờ xác nhận",
                description: "Hệ thống đang duyệt tự động chờ xác nhận, bạn vui lòng chờ đợi",
                type: 'success',
                duration: 3000,
            });
            queryAccountActive.get();
            setLoading(false);
            router.back();
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error);
        }
    })
    const onSubmit = useCallback((data: WithdrawAccountRequest) => {
        mutate(data)
    }, []);

    useEffect(() => {
        setLoading(isPending || twPrice.loading);
    }, [isPending, twPrice.loading]);

    useEffect(() => {
        if (account){
            setValue('account_id', account.id);
            setValue('transaction_code', generateUniqueIdRecharge('DRAW'));
            if (twPrice.money && money){
                setValue('amount_vnd' , Number(twPrice.money) * money);
            }
        }
    }, [money, twPrice.money, account]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, backgroundColor: DefaultColor.white}}
            keyboardVerticalOffset={headerHeight}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1}}>
                    <Form
                        gap="$4"
                        height="100%"
                        paddingHorizontal="$6"
                        paddingVertical="$4"
                        justifyContent="space-between"
                        onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$3">
                            <Paragraph textAlign="center" fontWeight={500}>Nhập số tiền rút</Paragraph>
                            <Controller
                                control={control}
                                name="money"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <View style={{
                                        flexDirection: 'column',
                                        borderBottomWidth: 1,
                                        paddingBottom: 14,
                                        borderBottomColor: DefaultColor.slate[300],
                                    }}>
                                        <XStack gap={8} alignItems="center">
                                            <TextInput
                                                style={{
                                                    flex: 1,
                                                    fontSize: 24,
                                                    borderRightWidth: 1,
                                                    borderRightColor: DefaultColor.slate[300],
                                                }}
                                                placeholder="Nhập số tiền rút"
                                                placeholderTextColor={DefaultColor.slate[300]}
                                                value={`${value ?? ''}`}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                keyboardType="number-pad"
                                                maxLength={13}
                                            />
                                            <Text style={{
                                                fontSize: sizeDefault.lg,
                                                fontWeight: 'bold',
                                                marginLeft: 8,
                                            }}> USD</Text>
                                        </XStack>
                                    </View>
                                )}
                            />
                            {!!errors.money && (
                                <Label color="red" size="$2">
                                    {errors.money.message}
                                </Label>
                            )}
                            <Paragraph fontSize={sizeDefault["sm"]} color={DefaultColor.slate[500]}>
                                Số tiền rút tối đa trong ngày:
                                {Number(account?.account_type?.max_withdraw_amount_per_day || 0).toLocaleString("en-US")} VND
                            </Paragraph>
                            <Paragraph fontSize={sizeDefault["sm"]} color={DefaultColor.slate[500]}>
                                Số lần rút tối đa trong ngày:
                                {Number(account?.account_type?.max_withdraw_per_day || 0).toLocaleString("en-US")}
                            </Paragraph>
                            <Paragraph fontSize={sizeDefault["sm"]} color={DefaultColor.slate[500]}>
                                Tỉ giá chuyển đổi:
                                {Number(twPrice.money || 0).toLocaleString("en-US")}
                            </Paragraph>
                            <Paragraph fontSize={sizeDefault["sm"]} color={DefaultColor.slate[500]} fontWeight={700}>
                                Giá sau chuyển đổi chuyển đổi:
                                {((money && twPrice.money) ? money * Number(twPrice.money) : 0).toLocaleString("en-US")} VND
                            </Paragraph>
                        </YStack>
                        <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                                onPress={handleSubmit(onSubmit)}>
                            Rút tiền
                        </Button>
                    </Form>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}