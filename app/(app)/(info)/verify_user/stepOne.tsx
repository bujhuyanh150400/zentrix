import {useState} from "react";
import {useFormVerifyAccountStepOne} from "@/services/auth/hook";
import {useGetListBankOptions} from "@/services/common/hook";
import {useVerifyAccountUserStore} from "@/services/auth/store";
import {FormVerifyAccountStepOne} from "@/services/auth/@type";
import {router} from "expo-router";
import {Keyboard, KeyboardAvoidingView, Platform, Pressable, TouchableWithoutFeedback} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {Button, Form, Input, Label, Paragraph, YStack} from "tamagui";
import {Controller} from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectFields from "@/components/SelectFields";
import {removeVietnameseTones} from "@/libs/utils";
import dayjs from "dayjs";

export default function StepOneScreen() {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const setStepOne = useVerifyAccountUserStore(s => s.setStepOne);

    const {control, handleSubmit, formState: {errors}} = useFormVerifyAccountStepOne();

    const listBankOptions = useGetListBankOptions();

    const onSubmit = (data: FormVerifyAccountStepOne) => {
        setStepOne(data);
        router.push("/(app)/(info)/verify_user/stepTwo");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <LayoutScrollApp
                style={{
                    backgroundColor: DefaultColor.white,
                }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form gap="$4" paddingBottom="$8" onSubmit={handleSubmit(onSubmit)}>
                        <Paragraph theme="alt2" fontSize={20} fontWeight="bold">
                            Vui lòng điền thông tin xác thực
                        </Paragraph>

                        {/* first_name */}
                        <Controller
                            control={control}
                            name="first_name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Họ
                                    </Label>
                                    <Input
                                        id="first_name"
                                        placeholder="Họ"
                                        value={value ?? ""}
                                        onChangeText={onChange}
                                        backgroundColor="#fff"
                                        onBlur={onBlur}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                        borderColor={!!errors.first_name ? "red" : "$borderColor"}
                                    />
                                    {!!errors.first_name && (
                                        <Label color="red" size="$2">
                                            {errors.first_name.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* last_name */}
                        <Controller
                            control={control}
                            name="last_name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Tên
                                    </Label>
                                    <Input
                                        id="last_name"
                                        placeholder="Tên"
                                        value={value ?? ""}
                                        onChangeText={onChange}
                                        backgroundColor="#fff"
                                        onBlur={onBlur}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                        borderColor={!!errors.last_name ? "red" : "$borderColor"}
                                    />
                                    {!!errors.last_name && (
                                        <Label color="red" size="$2">
                                            {errors.last_name.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* gender */}
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field: { onChange, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Giới tính
                                    </Label>
                                    <SelectFields
                                        backgroundColor={DefaultColor.white}
                                        options={[
                                            { label: "Nam", value: "male" },
                                            { label: "Nữ", value: "female" },
                                            { label: "Khác", value: "other" },
                                        ]}
                                        borderColor={!!errors.gender ? "red" : "$borderColor"}
                                        value={`${value}`}
                                        onValueChange={onChange}
                                        placeholder="Chọn giới tính"
                                    />
                                    {!!errors.gender && (
                                        <Label color="red" size="$2">
                                            {errors.gender.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* phone_number */}
                        <Controller
                            control={control}
                            name="phone_number"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Số điện thoại
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        placeholder="Số điện thoại"
                                        keyboardType="phone-pad"
                                        maxLength={15}
                                        value={value ?? ""}
                                        onChangeText={onChange}
                                        backgroundColor="#fff"
                                        onBlur={onBlur}
                                        autoCapitalize="none"
                                        borderColor={!!errors.phone_number ? "red" : "$borderColor"}
                                    />
                                    {!!errors.phone_number && (
                                        <Label color="red" size="$2">
                                            {errors.phone_number.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* address */}
                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Địa chỉ
                                    </Label>
                                    <Input
                                        id="address"
                                        placeholder="Địa chỉ"
                                        value={value ?? ""}
                                        onChangeText={onChange}
                                        backgroundColor="#fff"
                                        onBlur={onBlur}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                        borderColor={!!errors.address ? "red" : "$borderColor"}
                                    />
                                    {!!errors.address && (
                                        <Label color="red" size="$2">
                                            {errors.address.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* bin bank */}
                        <Controller
                            control={control}
                            name="bin_bank"
                            render={({ field: { onChange, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Ngân hàng
                                    </Label>
                                    <SelectFields
                                        backgroundColor="#fff"
                                        options={listBankOptions}
                                        borderColor={!!errors.bin_bank ? "red" : "$borderColor"}
                                        value={`${value}`}
                                        onValueChange={onChange}
                                        placeholder="Chọn ngân hàng"
                                    />
                                    {!!errors.bin_bank && (
                                        <Label color="red" size="$2">
                                            {errors.bin_bank.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* account_bank */}
                        <Controller
                            control={control}
                            name="account_bank"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Tài khoản ngân hàng
                                    </Label>
                                    <Input
                                        id="account_bank"
                                        placeholder="Tài khoản ngân hàng"
                                        value={value ?? ""}
                                        onChangeText={onChange}
                                        backgroundColor="#fff"
                                        onBlur={onBlur}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                        borderColor={!!errors.account_bank ? "red" : "$borderColor"}
                                    />
                                    {!!errors.account_bank && (
                                        <Label color="red" size="$2">
                                            {errors.account_bank.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* account_bank_name */}
                        <Controller
                            control={control}
                            name="account_bank_name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Tên tài khoản ngân hàng
                                    </Label>
                                    <Input
                                        id="account_bank_name"
                                        placeholder="Tên tài khoản ngân hàng"
                                        value={value ?? ""}
                                        onChangeText={(text) => {
                                            const formatted = removeVietnameseTones(text).toUpperCase();
                                            onChange(formatted);
                                        }}
                                        backgroundColor="#fff"
                                        onBlur={onBlur}
                                        keyboardType="default"
                                        autoCapitalize="characters"
                                        borderColor={
                                            !!errors.account_bank_name ? "red" : "$borderColor"
                                        }
                                    />
                                    {!!errors.account_bank_name && (
                                        <Label color="red" size="$2">
                                            {errors.account_bank_name.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* dob */}
                        <Controller
                            control={control}
                            name="dob"
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <YStack gap="$2">
                                    <Label fontWeight={500} size="$2">
                                        Ngày sinh:{" "}
                                    </Label>

                                    <Pressable onPress={() => setShowDatePicker(true)}>
                                        <Input
                                            placeholder="Chọn ngày sinh"
                                            value={
                                                value && dayjs(value).isValid()
                                                    ? dayjs(value).format("DD/MM/YYYY")
                                                    : ""
                                            }
                                            backgroundColor="#fff"
                                            editable={false} // Không cho nhập tay
                                            pointerEvents="none" // Disable text input
                                            borderColor={!!errors.dob ? "red" : undefined}
                                        />
                                    </Pressable>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            locale="vi-VN"
                                            mode="date"
                                            display={Platform.OS === "ios" ? "spinner" : "default"}
                                            textColor="black"
                                            maximumDate={new Date()} // Không cho chọn ngày trong tương lai
                                            value={value ? new Date(value) : new Date()}
                                            onChange={(event, selectedDate) => {
                                                if (Platform.OS === "android") {
                                                    setShowDatePicker(false);
                                                }

                                                if (event.type === "set" && selectedDate) {
                                                    onChange(dayjs(selectedDate).format("YYYY-MM-DD"));
                                                }

                                                if (event.type === "dismissed") {
                                                    setShowDatePicker(false);
                                                }
                                            }}
                                        />
                                    )}
                                    {!!errors.dob && (
                                        <Label color="red" size="$2">
                                            {errors.dob.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />

                        <YStack marginTop="$4" paddingBottom="$4">
                            <Button
                                theme="yellow"
                                fontWeight={500}
                                onPress={handleSubmit(onSubmit)}
                            >
                                Bước tiếp theo
                            </Button>
                        </YStack>
                    </Form>
                </TouchableWithoutFeedback>
            </LayoutScrollApp>
        </KeyboardAvoidingView>
    )
}