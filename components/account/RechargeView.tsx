import {Dispatch, FC, SetStateAction, useCallback, useEffect, useState} from "react";
import {Keyboard, KeyboardAvoidingView, Platform, TextInput, View, Text} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";
import {useHeaderHeight} from "@react-navigation/elements";
import {_AccountType, Account, RechargeAccountRequest} from "@/services/account/@types";
import {TouchableWithoutFeedback} from "@gorhom/bottom-sheet";
import {useRechargeAccountForm} from "@/services/account/hook";
import {generateUniqueIdRecharge} from "@/libs/utils";
import {Button, Form, Label, Paragraph, XStack, YStack} from "tamagui";
import {Controller} from "react-hook-form";
import {sizeDefault} from "@/components/ui/DefaultStyle";

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    account: Account
}
enum _Step {
    STEP_1 = 1,
    STEP_2 = 2
}

const RechargeView:FC<Props> = ({open,setOpen,account}) => {

    const headerHeight = useHeaderHeight();

    const [step, setStep] = useState<_Step>(_Step.STEP_1)

    const {control, handleSubmit, setValue, formState: {errors}} = useRechargeAccountForm(account);

    useEffect(() => {
        setValue('account_id', account.id);
        if (account.type === _AccountType.REAL_ACCOUNT){
            const transactionCode = generateUniqueIdRecharge();
            setValue('transaction_code',transactionCode)
        }
    }, [account]);

    useEffect(() => {
        if (!open) setStep(_Step.STEP_1);
    }, [open]);

    const onSubmit = useCallback((data: RechargeAccountRequest) => {
        console.log(data)
    }, []);
    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1, backgroundColor: DefaultColor.white}}
                keyboardVerticalOffset={headerHeight}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form
                        gap="$4"
                        height="100%"
                        paddingHorizontal="$6"
                        paddingVertical="$4"
                        justifyContent="space-between"
                        onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$3">
                            <Paragraph textAlign="center" fontWeight={500}>Nhập số tiền nạp</Paragraph>
                            <Controller
                                control={control}
                                name="money"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <View style={{
                                        flexDirection: 'column',
                                        borderBottomWidth: 1,
                                        paddingBottom: 2,
                                        borderRightColor: DefaultColor.slate[300],
                                    }}>
                                        <XStack gap={8} alignItems="center" >
                                            <TextInput
                                                style={{
                                                    flex: 1,
                                                    fontSize: 24,
                                                    borderRightWidth: 1,
                                                    borderRightColor: DefaultColor.slate[300],
                                                }}
                                                placeholder="Nhập số tiền nạp"
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
                                        <Paragraph fontSize={12} color="#ccc">Max 10.000.000.000 USD</Paragraph>
                                    </View>
                                )}
                            />
                            {!!errors.money && (
                                <Label color="red" size="$2">
                                    {errors.money.message}
                                </Label>
                            )}
                        </YStack>
                        <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10" onPress={handleSubmit(onSubmit)}>
                            Nạp tiền
                        </Button>
                    </Form>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    )
}
export default RechargeView;