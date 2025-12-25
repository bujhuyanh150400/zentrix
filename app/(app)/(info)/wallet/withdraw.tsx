import DefaultColor from "@/components/ui/DefaultColor";
import { sizeDefault } from "@/components/ui/DefaultStyle";
import { useShowErrorHandler } from "@/hooks/useHandleError";
import { useAppStore } from "@/services/app/store";
import { WithdrawTransactionWalletRequest } from "@/services/wallet/@types";
import {
  useMutationWithdrawWallet,
  useWithdrawWalletUserForm,
} from "@/services/wallet/hook";
import { useHeaderHeight } from "@react-navigation/elements";
import { router } from "expo-router";
import { useCallback } from "react";
import { Controller } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { Button, Form, Label, Paragraph, XStack, YStack } from "tamagui";

export default function WithdrawUserScreen() {
  const headerHeight = useHeaderHeight();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useWithdrawWalletUserForm();

  const setLoading = useAppStore((state) => state.setLoading);

  const { mutate, isPending } = useMutationWithdrawWallet({
    onSuccess: async () => {
      showMessage({
        message: "Chờ xác nhận",
        description:
          "Hệ thống đang duyệt tự động chờ xác nhận, bạn vui lòng chờ đợi",
        type: "success",
        duration: 3000,
      });
      setLoading(false);
      router.back();
    },
    onError: (error) => {
      setLoading(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useShowErrorHandler(error);
    },
  });

  const onSubmit = useCallback((data: WithdrawTransactionWalletRequest) => {
    mutate(data);
    setLoading(true);
  }, []);

  return (
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
            onSubmit={handleSubmit(onSubmit)}
          >
            <YStack gap="$3">
              <Paragraph textAlign="center" fontWeight={500}>
                Nhập số tiền rút
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
                        placeholder="Nhập số tiền rút"
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
                        VND
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
            </YStack>
            <Button
              theme="yellow"
              fontWeight="bold"
              borderWidth={1}
              borderColor="$yellow10"
              onPress={handleSubmit(onSubmit)}
            >
              Rút tiền
            </Button>
          </Form>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
