import {Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {
    TouchableOpacity,
    TouchableWithoutFeedback
} from "@gorhom/bottom-sheet";
import {Animated, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Text, View} from "react-native";
import {
    useFormCreateAccount, useGetAccountActive,
    useGetLeverOptions,
    useMutationCreateAccount,
    useQueryAccountTypeList
} from "@/services/account/hook";
import {useSharedValue} from "react-native-reanimated";
import Carousel, {ICarouselInstance, Pagination} from "react-native-reanimated-carousel";
import {_AccountType, AccountType} from "@/services/account/@types";
import {Button, Card, Form, H2, Input, Label, Paragraph, Separator, XStack, YStack, Spinner} from "tamagui";
import {AntDesign, FontAwesome6} from '@expo/vector-icons';
import {sizeDefault} from "@/components/ui/DefaultStyle";
import DefaultColor from "@/components/ui/DefaultColor";
import {useHeaderHeight} from "@react-navigation/elements";
import {Controller} from "react-hook-form";
import SelectFields from "@/components/SelectFields";
import {showMessage} from "react-native-flash-message";
import {useShowErrorHandler} from "@/hooks/useHandleError";


type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    onCreateSuccess?:() => void
}

enum _Step {
    STEP_1 = 1,
    STEP_2 = 2,
    STEP_3 = 3,
    STEP_4 = 4
}

const {width} = Dimensions.get('window');

const rules = [
    {
        label: 'Từ 8–15 ký tự',
        isValid: (val: string) => val && val.length >= 8 && val.length <= 15,
    },
    {
        label: 'Ít nhất có một chữ hoa và một chữ thường',
        isValid: (val: string) => /[a-z]/.test(val) && /[A-Z]/.test(val),
    },
    {
        label: 'Ít nhất có một số',
        isValid: (val: string) => /\d/.test(val),
    },
    {
        label: 'Ít nhất có một ký tự đặc biệt',
        isValid: (val: string) => /[^a-zA-Z0-9]/.test(val),
    },
]

const AddAccountView: FC<Props> = (props) => {
    const progress = useSharedValue<number>(0);
    const refCarousel = useRef<ICarouselInstance>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [step, setStep] = useState<_Step>(_Step.STEP_1);

    const {
        control,
        formState: {errors},
        setValue,
        trigger,
        watch,
        reset,
        getValues
    } = useFormCreateAccount();

    const queryAccountTypeList = useQueryAccountTypeList();

    const queryAccountActive = useGetAccountActive();

    const accountTypes = useMemo(() => queryAccountTypeList?.data?.data ?? [] as AccountType[], [queryAccountTypeList?.data]);

    const leversOptions = useGetLeverOptions();

    const password = watch('password');

    const allValid = useMemo(() => {
        if (rules && rules.length > 0) {
            return rules.every((rule) => rule.isValid(password ?? ""))
        }
        return false;
    }, [password]);

    const {mutate, isPending} = useMutationCreateAccount({
        onSuccess: async () => {
            showMessage({
                message: "Tạo tài khoản ví thành công",
                type: 'success',
                duration: 3000,
            });
            reset();
            setStep(_Step.STEP_1);
            props.setOpen(false);
            queryAccountActive.get();
            if (props.onCreateSuccess){
                props.onCreateSuccess();
            }
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error);
        }
    });


    useEffect(() => {
        if (accountTypes && accountTypes.length > 0) {
            setValue('account_type_id', accountTypes[0].id);
        }
        if (!props.open){
            reset();
            setStep(_Step.STEP_1);
        }
    }, [accountTypes, props.open]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const headerHeight = useHeaderHeight();

    return (
        <>
            {step === _Step.STEP_1 && (
                <Animated.View style={{padding: 16, opacity: fadeAnim}}>
                    <Text style={{fontSize: sizeDefault.lg, fontWeight: 700}}>Chọn loại tài khoản</Text>
                    <Separator marginTop={15} marginBottom={10}/>
                    <YStack gap={"$2"}>
                        <TouchableOpacity
                            onPress={() => {
                                setValue('account_type', _AccountType.TEST_ACCOUNT);
                                trigger(['account_type']).then(valid => valid && setStep(_Step.STEP_2));
                            }}
                        >
                            <XStack alignItems={"center"} justifyContent={"space-between"} gap={"$2"}>
                                <YStack gap={"$2"}>
                                    <Text>Tài khoản credit</Text>
                                    <Text style={{color: DefaultColor.slate["400"]}}>Tài khoản không rủi ro. Giao
                                        dịch bằng tiền ảo</Text>
                                </YStack>
                                <FontAwesome6 name="chevron-right" size={sizeDefault.md} color="black"/>
                            </XStack>
                        </TouchableOpacity>
                        <Separator marginVertical={10}/>
                        <TouchableOpacity
                            onPress={() => {
                                setValue('account_type', _AccountType.REAL_ACCOUNT);
                                trigger(['account_type']).then(valid => valid && setStep(_Step.STEP_2));
                            }}
                        >
                            <XStack alignItems={"center"} justifyContent={"space-between"} gap={"$2"}>
                                <YStack gap={"$2"}>
                                    <Text>Tài khoản thật</Text>
                                    <Text style={{color: DefaultColor.slate["400"], maxWidth: 250}}>Giao dịch bằng
                                        tiền thật và rút bất kỳ khoản lợi nhuận nào bạn kiếm được</Text>
                                </YStack>
                                <FontAwesome6 name="chevron-right" size={sizeDefault.md} color="black"/>
                            </XStack>
                        </TouchableOpacity>
                    </YStack>
                </Animated.View>
            )}
            {step === _Step.STEP_2 && (
                <Animated.View style={{padding: 16, opacity: fadeAnim}}>
                    <YStack flex={1} gap="$2">
                        <XStack alignItems={"center"} gap={"$4"}>
                            <TouchableOpacity
                                style={{padding: 8}}
                                onPress={() => setStep(_Step.STEP_1)}
                            >
                                <FontAwesome6 name="chevron-left" size={sizeDefault.md} color="black"/>
                            </TouchableOpacity>
                            <Text style={{fontSize: sizeDefault.lg, fontWeight: 700}}>Mở tài khoản mới</Text>
                        </XStack>

                        <Carousel
                            width={width - 32}
                            height={480}
                            data={accountTypes}
                            scrollAnimationDuration={200}
                            onSnapToItem={(index: number) => {
                                const current = accountTypes[index];
                                if (current) {
                                    setValue('account_type_id', current.id);
                                    trigger(['account_type_id'])
                                }
                            }}
                            onProgressChange={progress}
                            renderItem={({item}) => (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: width * 0.9,
                                        alignSelf: 'center',
                                        paddingVertical: 16,
                                    }}
                                >
                                    <Card
                                        bordered
                                        backgroundColor="white"
                                        style={{
                                            width: '100%',
                                            borderRadius: 16,
                                        }}
                                    >
                                        <Card.Header padded alignItems="center">
                                            <H2 fontWeight={700} marginBottom="$2" textAlign="center">
                                                {item.name}
                                            </H2>
                                            <View
                                                style={{
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 4,
                                                    borderRadius: 999,
                                                    backgroundColor: item.color ? item.color : DefaultColor.slate[300],
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 8,
                                                    marginTop: 8,
                                                }}
                                            >
                                                <AntDesign name="checkcircleo" size={20} color="black"/>
                                                <Paragraph theme="alt2">{item.summary}</Paragraph>
                                            </View>
                                        </Card.Header>
                                        <Card.Footer padded>
                                            <YStack gap="$2">
                                                <Paragraph
                                                    theme="alt2"
                                                    textAlign="center"
                                                    style={{marginBottom: 12}}
                                                >
                                                    {item.description}
                                                </Paragraph>
                                                <Separator marginVertical={8}/>
                                                <XStack justifyContent="space-between" width="100%">
                                                    <Paragraph color="#7a7f83" fontWeight={500}>Tiền nạp tối
                                                        thiểu:</Paragraph>
                                                    <Paragraph fontWeight={500}>{item.min} USD</Paragraph>
                                                </XStack>
                                                <Separator marginVertical={8}/>
                                                <XStack justifyContent="space-between" width="100%">
                                                    <Paragraph color="#7a7f83" fontWeight={500}>Chênh
                                                        lệch:</Paragraph>
                                                    <Paragraph fontWeight={500}>Từ {item.difference}</Paragraph>
                                                </XStack>
                                                <Separator marginVertical={8}/>
                                                <XStack justifyContent="space-between" width="100%">
                                                    <Paragraph color="#7a7f83" fontWeight={500}>Hoa
                                                        hồng:</Paragraph>
                                                    <Paragraph fontWeight={500}>{item.commission}</Paragraph>
                                                </XStack>
                                            </YStack>
                                        </Card.Footer>
                                    </Card>
                                </View>
                            )}
                        />
                        <Pagination.Basic
                            progress={progress}
                            data={accountTypes}
                            size={10}
                            dotStyle={{
                                borderRadius: 100,
                                backgroundColor: DefaultColor.slate[200],
                            }}
                            activeDotStyle={{
                                borderRadius: 100,
                                overflow: "hidden",
                                backgroundColor: DefaultColor.slate[500],
                            }}
                            containerStyle={[
                                {
                                    gap: 5,
                                    marginBottom: 10,
                                },
                            ]}
                            horizontal
                            onPress={(index: number) => {
                                refCarousel.current?.scrollTo({
                                    count: index - Math.round(progress.value),
                                    animated: true,
                                })
                            }}
                        />
                        <Button theme={"yellow"}
                                fontWeight="bold"
                                borderWidth={1}
                                borderColor="$yellow10"
                                disabled={!!errors.account_type_id}
                                backgroundColor={!errors.account_type_id ? DefaultColor.yellow[200] : undefined}
                                onPress={() => setStep(_Step.STEP_3)}
                        >
                            Tiếp tục
                        </Button>
                    </YStack>
                </Animated.View>
            )}
            {step === _Step.STEP_3 && (
                <Animated.View style={{padding: 16, opacity: fadeAnim}}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{flex: 1, backgroundColor: DefaultColor.white}}
                        keyboardVerticalOffset={headerHeight}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Form
                                gap="$4"
                                height="100%"
                                justifyContent="space-between"
                            >
                                <YStack>
                                    <XStack alignItems={"center"} gap={"$4"}>
                                        <TouchableOpacity
                                            style={{padding: 8}}
                                            onPress={() => {
                                                setStep(_Step.STEP_2)
                                                reset({
                                                    name: "",
                                                    lever_id: 0
                                                })
                                            }}
                                        >
                                            <FontAwesome6 name="chevron-left" size={sizeDefault.md} color="black"/>
                                        </TouchableOpacity>
                                        <Text style={{fontSize: sizeDefault.lg, fontWeight: 700}}>Mở tài khoản
                                            mới</Text>
                                    </XStack>
                                    {/* Name */}
                                    <Controller
                                        control={control}
                                        name="name"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <YStack gap="$2">
                                                <Label size="$2">
                                                    Tên tài khoản
                                                </Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Tên tài khoản"
                                                    value={value ?? ""}
                                                    onChangeText={onChange}
                                                    backgroundColor={DefaultColor.white}
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
                                    {/* lever */}
                                    <Controller
                                        control={control}
                                        name="lever_id"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <YStack gap="$2">
                                                <Label size="$2">
                                                    Chọn tỷ lệ đòn bẩy
                                                </Label>
                                                <SelectFields
                                                    options={leversOptions}
                                                    value={`${value}`}
                                                    backgroundColor={DefaultColor.white}
                                                    onValueChange={onChange}
                                                    placeholder="Chọn tỷ lệ đòn bẩy"
                                                />
                                                {!!errors.lever_id && (
                                                    <Label color="red" size="$2">
                                                        {errors.lever_id.message}
                                                    </Label>
                                                )}
                                            </YStack>
                                        )}
                                    />
                                    <Paragraph theme="alt2" color="#7a7f83">
                                        Sử dụng đòn bẩy có nghĩa là bạn có thể giao dịch với số lượng lệnh giao dịch
                                        lớn hơn số
                                        tiền trong tài khoản giao dịch của mình giá trị đòn bẩy được thể hiện dưới
                                        dạng tỉ lệ
                                    </Paragraph>
                                </YStack>
                                <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                                        onPress={() => {
                                            trigger(['name', 'lever_id']).then((valid) => {
                                                if (valid) {
                                                    setStep(_Step.STEP_4)
                                                }
                                            })
                                        }}>
                                    Tiếp tục
                                </Button>
                            </Form>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </Animated.View>
            )}
            {step === _Step.STEP_4 && (
                <Animated.View style={{padding: 16, opacity: fadeAnim}}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{flex: 1, backgroundColor: DefaultColor.white}}
                        keyboardVerticalOffset={headerHeight}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <YStack flex={1} justifyContent="space-between" gap={"$3"}>
                                <XStack alignItems={"center"} gap={"$4"}>
                                    <TouchableOpacity
                                        style={{padding: 8}}
                                        onPress={() => {
                                            setStep(_Step.STEP_3)
                                            reset({
                                                password: "",
                                            })
                                        }}
                                    >
                                        <FontAwesome6 name="chevron-left" size={sizeDefault.md} color="black"/>
                                    </TouchableOpacity>
                                    <Text style={{fontSize: sizeDefault.lg, fontWeight: 700}}>Mở tài khoản mới</Text>
                                </XStack>
                                <YStack gap="$3">
                                    <Text style={{fontSize: sizeDefault.lg}}>
                                        Mật khẩu tài khoản là mật khẩu bạn sử dụng để thao tác với tài khoản ví này.
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="password"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <Input
                                                id="password"
                                                value={value ?? ""}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry
                                                backgroundColor={DefaultColor.white}
                                                placeholder="Tạo mật khẩu giao dịch mới"
                                                keyboardType="default"
                                                autoCapitalize="none"
                                            />
                                        )}
                                    />

                                    <YStack gap="$2">
                                        {rules && rules.length > 0 && (
                                            rules.map((rule, idx) => {
                                                const valid = rule.isValid(password ?? "")
                                                return (
                                                    <XStack key={idx} alignItems="center" gap="$2">
                                                        {valid ? (
                                                            <FontAwesome6 name="check" size={sizeDefault.md}
                                                                          color={DefaultColor.green[500]}/>
                                                        ) : (
                                                            <FontAwesome6 name="x" size={sizeDefault.md}
                                                                          color={DefaultColor.red[500]}/>
                                                        )}
                                                        <Text
                                                            style={{
                                                                color: valid ? DefaultColor.green[500] : DefaultColor.red[500]
                                                            }}
                                                        >{rule.label}</Text>
                                                    </XStack>
                                                )
                                            })
                                        )}
                                    </YStack>
                                    <Paragraph>
                                        Hãy lưu ngay mật khẩu giao dịch của bạn do không thể gửi mật khẩu tới email của
                                        bạn vì mục đích bảo mật.
                                    </Paragraph>
                                </YStack>
                                <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                                        disabled={!allValid || isPending}
                                        backgroundColor={!allValid || isPending ? DefaultColor.yellow[100] : DefaultColor.yellow[400]}
                                        onPress={() => {
                                            trigger().then((valid) => {
                                                if (valid) {
                                                    const data = getValues();
                                                    mutate(data);
                                                }
                                            })
                                        }}>
                                    {isPending && <Spinner/>} Xác nhận
                                </Button>
                            </YStack>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </Animated.View>
            )}
        </>
    )
}

export default AddAccountView;