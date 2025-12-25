import DefaultColor from "@/components/ui/DefaultColor";
import { sizeDefault } from "@/components/ui/DefaultStyle";
import useFadeInAnimation from "@/hooks/useFadeInAnimation";
import { useShowErrorHandler } from "@/hooks/useHandleError";
import useNestedState from "@/hooks/useNestedState";
import { BALANCE_SYMBOL_FOR_ACCOUNT_WALLET } from "@/libs/constant_env";
import { generateUniqueIdRecharge } from "@/libs/utils";
import { _AccountType, RechargeAccountForm } from "@/services/account/@types";
import {
  useGetAccountActive,
  useMutationRecharge,
  useRechargeAccountForm,
} from "@/services/account/hook";
import { useAppStore } from "@/services/app/store";
import { useGetBankConfig } from "@/services/common/hook";
import { useGetTWPrice } from "@/services/trade/hook";
import { FontAwesome } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { Button, Form, Image, Label, Paragraph, XStack, YStack } from "tamagui";

enum _Step {
  STEP_1 = 1,
  STEP_2 = 2,
}

export default function RechargeScreen() {
  const queryAccountActive = useGetAccountActive();

  const account = queryAccountActive.account;
  const headerHeight = useHeaderHeight();

  const [step, setStep] = useState<_Step>(_Step.STEP_1);

  const [option, setOption] = useNestedState({
    transaction_code: "",
    amount_vnd: 0,
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
  });

  const twPrice = useGetTWPrice(BALANCE_SYMBOL_FOR_ACCOUNT_WALLET);

  const setLoading = useAppStore((state) => state.setLoading);

  const bankConfig = useGetBankConfig();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useRechargeAccountForm(account);

  const { mutate, isPending } = useMutationRecharge({
    onSuccess: async () => {
      if (account?.type === _AccountType.TEST_ACCOUNT) {
        showMessage({
          message: "Nạp tiền thành công",
          type: "success",
          duration: 3000,
        });
      }
      if (account?.type === _AccountType.REAL_ACCOUNT) {
        showMessage({
          message: "Chờ xác nhận",
          description:
            "Hệ thống đang duyệt tự động chờ xác nhận, bạn vui lòng chờ đợi",
          type: "success",
          duration: 3000,
        });
      }
      queryAccountActive.get();
      setLoading(false);
      router.back();
    },
    onError: (error) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useShowErrorHandler(error);
    },
  });

  const fadeAnim = useFadeInAnimation();

  useEffect(() => {
    if (account) {
      setValue("account_id", account.id);
    }
  }, [account]);

  useEffect(() => {
    setLoading(bankConfig.loading || isPending || twPrice.loading);
  }, [bankConfig.loading, isPending, twPrice.loading]);

  useEffect(() => {
    if (step === _Step.STEP_2 && bankConfig.data && twPrice.money) {
      const { money } = getValues();
      setOption({
        transaction_code: generateUniqueIdRecharge(),
        bank_name: bankConfig.data.bank_name,
        bank_account_name: bankConfig.data.account_name,
        bank_account_number: bankConfig.data.account_number,
        amount_vnd: money ? money * Number(twPrice.money) : 0,
      });
    }
  }, [step, bankConfig.data, twPrice.money]);

  const onSubmitStepOne = useCallback(
    (data: RechargeAccountForm) => {
      if (account?.type === _AccountType.TEST_ACCOUNT) {
        mutate(data);
      } else {
        setStep(_Step.STEP_2);
      }
    },
    [account]
  );

  const onSubmitStepTwo = useCallback(
    (data: RechargeAccountForm) => {
      const form = {
        ...data,
        ...option,
      };
      mutate(form);
    },
    [account, option]
  );
  return (
    <>
      {step === _Step.STEP_1 && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: DefaultColor.white }}
          keyboardVerticalOffset={headerHeight}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <Form
                gap="$4"
                height="100%"
                paddingHorizontal="$6"
                paddingVertical="$4"
                justifyContent="space-between"
                onSubmit={handleSubmit(onSubmitStepOne)}
              >
                <YStack gap="$3">
                  <Paragraph textAlign="center" fontWeight={500}>
                    Nhập số tiền nạp
                  </Paragraph>
                  <Controller
                    control={control}
                    name="money"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View
                        style={{
                          flexDirection: "column",
                          borderBottomWidth: 1,
                          paddingBottom: 14,
                          borderBottomColor: DefaultColor.slate[300],
                        }}
                      >
                        <XStack gap={8} alignItems="center">
                          <TextInput
                            style={{
                              flex: 1,
                              fontSize: 24,
                              borderRightWidth: 1,
                              borderRightColor: DefaultColor.slate[300],
                            }}
                            placeholder="Nhập số tiền nạp"
                            placeholderTextColor={DefaultColor.slate[300]}
                            value={`${value ?? ""}`}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="number-pad"
                            maxLength={13}
                          />
                          <Text
                            style={{
                              fontSize: sizeDefault.lg,
                              fontWeight: "bold",
                              marginLeft: 8,
                            }}
                          >
                            {" "}
                            USD
                          </Text>
                        </XStack>
                      </View>
                    )}
                  />
                  {!!errors.money && (
                    <Label color="red" size="$2">
                      {errors.money.message}
                    </Label>
                  )}
                  <Paragraph
                    fontSize={sizeDefault["sm"]}
                    color={DefaultColor.slate[500]}
                  >
                    Min:{" "}
                    {Number(account?.account_type.min || 0).toLocaleString(
                      "en-US"
                    )}{" "}
                    USD
                  </Paragraph>
                  <Paragraph
                    fontSize={sizeDefault["sm"]}
                    color={DefaultColor.slate[500]}
                  >
                    Max:{" "}
                    {Number(account?.account_type.max || 0).toLocaleString(
                      "en-US"
                    )}{" "}
                    USD
                  </Paragraph>
                </YStack>
                <Button
                  theme="yellow"
                  fontWeight="bold"
                  borderWidth={1}
                  borderColor="$yellow10"
                  onPress={handleSubmit(onSubmitStepOne)}
                >
                  Nạp tiền
                </Button>
              </Form>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
      {step === _Step.STEP_2 && bankConfig.data && twPrice.money ? (
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: DefaultColor.white,
            opacity: fadeAnim,
          }}
        >
          <YStack
            flex={1}
            gap="$2"
            padding={"$4"}
            alignItems="center"
            justifyContent={"space-between"}
          >
            <YStack gap="$2" alignItems="center">
              <Text>Quét mã để chuyển tiền vào tài khoản</Text>
              <Text style={styles.title}>
                {bankConfig.data.account_name.toUpperCase()}
              </Text>
              <XStack alignItems={"center"} gap={"$2"} marginBottom={16}>
                <Text>STK: {bankConfig.data.account_number}</Text>
                <TouchableOpacity
                  style={styles.copy}
                  onPress={async () => {
                    if (bankConfig.data) {
                      await Clipboard.setStringAsync(
                        bankConfig.data.account_number
                      );
                      showMessage({
                        message: "Đã copy vào clipboard",
                        type: "info",
                        duration: 3000,
                      });
                    }
                  }}
                >
                  <FontAwesome
                    name="copy"
                    size={sizeDefault.lg}
                    color="black"
                  />
                </TouchableOpacity>
              </XStack>
              <Image
                source={{ uri: bankConfig.data.qr_code }}
                style={styles.qr_code}
                objectFit={"contain"}
              />
              <Text
                style={{
                  fontSize: sizeDefault.lg,
                  marginBottom: 20,
                  fontWeight: 700,
                }}
              >
                {bankConfig.data.bank_name}
              </Text>
              <XStack alignItems={"center"} gap={"$2"} marginBottom={16}>
                <Text>Nội dung: {option.transaction_code}</Text>
                <TouchableOpacity
                  style={styles.copy}
                  onPress={async () => {
                    await Clipboard.setStringAsync(option.transaction_code);
                    showMessage({
                      message: "Đã copy vào clipboard",
                      type: "info",
                      duration: 3000,
                    });
                  }}
                >
                  <FontAwesome
                    name="copy"
                    size={sizeDefault.lg}
                    color="black"
                  />
                </TouchableOpacity>
              </XStack>

              <Text>
                Giá tiền cần nạp:{" "}
                {Number(getValues().money).toLocaleString("en-US")} USD
              </Text>
              <XStack alignItems={"center"} gap={"$2"}>
                <Text>
                  Giá tiền sau quy đổi:{" "}
                  {option.amount_vnd.toLocaleString("en-US")} VND
                </Text>
                <TouchableOpacity
                  style={styles.copy}
                  onPress={async () => {
                    await Clipboard.setStringAsync(
                      option.amount_vnd.toFixed(0)
                    );
                    showMessage({
                      message: "Đã copy vào clipboard",
                      type: "info",
                      duration: 3000,
                    });
                  }}
                >
                  <FontAwesome
                    name="copy"
                    size={sizeDefault.lg}
                    color="black"
                  />
                </TouchableOpacity>
              </XStack>
              <Text>
                Mệnh giá USD / VND:{" "}
                {Number(twPrice.money).toLocaleString("en-US")}
              </Text>
            </YStack>
            <Button
              theme="yellow"
              fontWeight="bold"
              borderWidth={1}
              borderColor="$yellow10"
              onPress={handleSubmit(onSubmitStepTwo)}
            >
              Chờ xác nhận
            </Button>
          </YStack>
        </Animated.View>
      ) : (
        <>
          <Text> chạy ở đây</Text>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  qr_code: {
    width: 150,
    height: 150,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: DefaultColor.slate[300],
    padding: 5,
  },
  title: {
    fontSize: sizeDefault["lg"],
    fontWeight: 700,
    lineHeight: sizeDefault["2xl"],
  },
  copy: {},
});
