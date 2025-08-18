import {Symbol} from "@/services/assest_trading/@types";
import {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from "react";
import {
    _TradeType,
    _TransactionStatus,
    _TransactionTriggerType,
    StoreTransactionRequestType
} from "@/services/transaction/@types";
import {Account} from "@/services/account/@types";
import {
    useCalculateInfoTrading,
    useMutationStoreTrans,
    useTransactionHistory,
    useTransactionTotal
} from "@/services/transaction/hook";
import {useAppStore} from "@/services/app/store";
import useNestedState from "@/hooks/useNestedState";
import {showMessage} from "react-native-flash-message";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {calculateProfit, formatNumber, parseToNumber} from "@/libs/utils";
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Button, Paragraph,  XStack, YStack} from "tamagui";
import {MaterialIcons} from '@expo/vector-icons';
import DefaultColor from "@/components/ui/DefaultColor";
import HorizontalTabBar from "@/components/HorizontalTabBar";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import TransactionMoreInfo from "@/components/TransactionMoreInfo";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import {useGetAccountActive} from "@/services/account/hook";


const SNAP_CLOSE = 35;
const SNAP_OPEN = 70;

type TransactionSheetProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    tradeType: _TradeType,
    price: number,
    account: Account | null,
    symbol?: Symbol,
    callReloadOpenTrans: () => void
}
const TransactionSheet: FC<TransactionSheetProps> = (props) => {
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [snapPoint, setSnapPoint] = useState(SNAP_CLOSE);
    const [openMore, setOpenMore] = useState<boolean>(false);
    const [tab, setTab] = useState<_TransactionTriggerType>(_TransactionTriggerType.TYPE_TRIGGER_AUTO_TRIGGER);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const {query} = useTransactionTotal(props.account?.id || null);
    const setLoading = useAppStore(state => state.setLoading);
    const queryAccountActive = useGetAccountActive();

    const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);

    const [form, setForm] = useNestedState<StoreTransactionRequestType>({
        account_id: 0,
        asset_trading_id: 0,
        type: props.tradeType,
        type_trigger: _TransactionTriggerType.TYPE_TRIGGER_NOW,
        volume: "0.01",
        entry_price: "",
        trigger_price: "",
        percent_take_profit: "",
        percent_stop_loss: "",
    });

    const hookInfoTrading = useCalculateInfoTrading(
        props.price,
        parseToNumber(form.volume),
        props.account,
        props.symbol
    );

    
    const [error, setError] = useNestedState({
        isError: false,
        volume: "",
        trigger_price: "",
        percent_stop_loss: "",
        percent_take_profit: ""
    })

    const hookHistory = useTransactionHistory({
        account_id: props.account?.id || 0,
        status: [_TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY,_TransactionTriggerType.TYPE_TRIGGER_LOW_BUY].includes(form.type_trigger) ? _TransactionStatus.WAITING : _TransactionStatus.OPEN
    });

    const {mutate, isPending} = useMutationStoreTrans({
        onSuccess: async () => {
            showMessage({
                message: "Giao dịch thành công",
                type: 'success',
                duration: 3000,
            });
            query.refetch().then(() => {
                queryAccountActive.get();
                hookHistory.query.refetch();
                props.setOpen(false);
                props.callReloadOpenTrans();
            });
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error);
        }
    })

    useEffect(() => {
        if (parseToNumber(form.volume) < 0) {
            setError({volume: "Khối lượng không được nhỏ hơn 0.01", isError: true});
        } else {
            setError({volume: "", isError: false});
        }
        if ([_TransactionTriggerType.TYPE_TRIGGER_LOW_BUY, _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY, _TransactionTriggerType.TYPE_TRIGGER_AUTO_TRIGGER].includes(form.type_trigger)) {
            if (form.percent_stop_loss) {
                const stopLoss = parseToNumber(form.percent_stop_loss);
                if (stopLoss < 0 || stopLoss > 100) {
                    setError({percent_stop_loss: "Cắt lỗ phải lớn hơn 0 hoặc nhỏ hơn 100%", isError: true});
                } else {
                    setError({percent_stop_loss: "", isError: false});
                }
            }
            if (form.percent_take_profit) {
                const stopLoss = parseToNumber(form.percent_take_profit);
                if (stopLoss < 0 || stopLoss > 100) {
                    setError({percent_take_profit: "Chốt lời phải lớn hơn 0 hoặc nhỏ hơn 100%", isError: true});
                } else {
                    setError({percent_take_profit: "", isError: false});
                }
            }
        }
    }, [form]);

    useEffect(() => {
        if (form.trigger_price) {
            if (form.type_trigger === _TransactionTriggerType.TYPE_TRIGGER_LOW_BUY) {
                if (parseToNumber(form.trigger_price) >= props.price) {
                    setError({trigger_price: `Giá mua thấp phải nhỏ hơn ${props.price}`, isError: true});
                } else {
                    setError({trigger_price: ``, isError: false});
                }
            } else if (form.type_trigger === _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY) {
                if (parseToNumber(form.trigger_price) <= props.price) {
                    setError({trigger_price: `Giá mua cao phải lớn hơn ${props.price}`, isError: true});
                } else {
                    setError({trigger_price: ``, isError: false});
                }
            }
        }
    }, [props.price, form.trigger_price, form.type_trigger]);

    useEffect(() => {
        if (props.open) {
            if (props.symbol && props.account) {
                setForm({
                    account_id: props.account.id,
                    asset_trading_id: props.symbol.id,
                });
            }
        } else {
            setOpenMore(false);
            setForm({
                account_id: 0,
                asset_trading_id: 0,
                type: props.tradeType,
                type_trigger: _TransactionTriggerType.TYPE_TRIGGER_NOW,
                volume: "0.01",
                entry_price: "",
                trigger_price: "",
                percent_take_profit: "",
                percent_stop_loss: "",
            })
        }
    }, [props.symbol, props.account, props.open]);

    useEffect(() => {
        if (openMore) {
            setForm({
                percent_take_profit: "0",
                percent_stop_loss: "0",
            });
            if (tab === _TransactionTriggerType.TYPE_TRIGGER_AUTO_TRIGGER) {
                setSnapPoint(SNAP_OPEN);
            } else {
                setForm({trigger_price: props.price.toString()});
                setSnapPoint(SNAP_OPEN + 10);
            }
            setForm({type_trigger: tab});
        } else {
            setForm({
                percent_take_profit: "",
                percent_stop_loss: "",
            });
            setSnapPoint(SNAP_CLOSE);
            setForm({trigger_price: ""});
            setForm({type_trigger: _TransactionTriggerType.TYPE_TRIGGER_NOW});
        }
    }, [openMore, tab]);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);
    
    useEffect(() => {
        setLoading(isPending);
    }, [isPending]);

    useEffect(() => {
        if (props.open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
            setOpenMoreInfo(false);
        }
    }, [props.open]);

    return (
        <>
            <BottomSheet
                index={-1}
                containerStyle={{
                    zIndex: 100_000,
                }}
                ref={bottomSheetRef}
                snapPoints={[snapPoint]}
                onClose={() => props.setOpen(false)}
                handleComponent={() => null}
                enablePanDownToClose={false}
                enableContentPanningGesture={false}
                enableHandlePanningGesture={false}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        disappearsOnIndex={-1}
                        appearsOnIndex={0}
                        opacity={0.5}
                        pressBehavior="none"
                    />
                )}
            >
                <BottomSheetView>
                    <BottomSheetScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        contentContainerStyle={{paddingBottom: keyboardVisible ? 200 : 0}} // để tránh bị che
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <YStack padding="$4" gap="$2">
                                <XStack alignItems={"center"} justifyContent={"space-between"}>
                                    <Paragraph fontSize={16} fontWeight={700}>Giao dịch</Paragraph>
                                    <TouchableOpacity
                                        style={[
                                            styles.btn_round, {
                                                backgroundColor: openMore ? DefaultColor.slate[300] : DefaultColor.slate[400],
                                            }
                                        ]}
                                        onPress={() => {
                                            setOpenMore(!openMore);
                                        }}
                                    >
                                        <MaterialIcons name="candlestick-chart" size={24} color={
                                            openMore ? "white" : "black"
                                        }/>
                                    </TouchableOpacity>
                                </XStack>
                                <View>
                                    {!openMore ? (
                                        <YStack>
                                            <Paragraph>Khối lượng</Paragraph>
                                            <InputPlusMinus
                                                value={form.volume}
                                                reference={0.01}
                                                onChange={(value) => setForm({volume: value})}
                                                onFocus={() => setSnapPoint(SNAP_OPEN)}
                                                onBlur={() => {
                                                    const num = parseToNumber(form.volume);
                                                    setForm({volume: formatNumber(num)})
                                                    setSnapPoint(SNAP_CLOSE);
                                                }}
                                                pre={"Lô"}
                                            />
                                            {error?.volume && (
                                                <Paragraph color="red">{error.trigger_price}</Paragraph>
                                            )}
                                        </YStack>
                                    ) : (
                                        <>
                                            <HorizontalTabBar<_TransactionTriggerType>
                                                tabs={[
                                                    {
                                                        key: _TransactionTriggerType.TYPE_TRIGGER_AUTO_TRIGGER,
                                                        item: (isActive) => (
                                                            <Paragraph
                                                                style={{
                                                                    color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                                                    fontWeight: isActive ? 700 : 'normal'
                                                                }}
                                                            >
                                                                Lệnh thị trường
                                                            </Paragraph>
                                                        ),
                                                    },
                                                    {
                                                        key: _TransactionTriggerType.TYPE_TRIGGER_LOW_BUY,
                                                        item: (isActive) => (
                                                            <Paragraph
                                                                style={{
                                                                    color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                                                    fontWeight: isActive ? 700 : 'normal'
                                                                }}
                                                            >
                                                                Chờ mua giá thấp
                                                            </Paragraph>
                                                        ),
                                                    },
                                                    {
                                                        key: _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY,
                                                        item: (isActive) => (
                                                            <Paragraph
                                                                style={{
                                                                    color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                                                    fontWeight: isActive ? 700 : 'normal'
                                                                }}
                                                            >
                                                                Chờ mua giá cao
                                                            </Paragraph>
                                                        ),
                                                    },
                                                ]}
                                                activeKey={tab}
                                                onTabPress={setTab}
                                                styleContainer={{
                                                    marginBottom: 20
                                                }}
                                            />
                                            <YStack>
                                                <YStack gap={"$2"}>
                                                    <YStack>
                                                        <Paragraph>Khối lượng</Paragraph>
                                                        <InputPlusMinus
                                                            value={form.volume}
                                                            reference={0.01}
                                                            onChange={(value) => setForm({volume: value})}
                                                            pre={"Lô"}
                                                        />
                                                        {error?.volume && (
                                                            <Paragraph color="red">{error.volume}</Paragraph>
                                                        )}
                                                    </YStack>

                                                    {(tab === _TransactionTriggerType.TYPE_TRIGGER_LOW_BUY
                                                        || tab === _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY) && (
                                                        <YStack>
                                                            <Paragraph>Giá chốt</Paragraph>
                                                            <InputPlusMinus
                                                                value={form.trigger_price || ""}
                                                                reference={0.1}
                                                                onChange={(value) => setForm({trigger_price: value})}
                                                                pre={"Lô"}
                                                            />
                                                            {error?.trigger_price && (
                                                                <Paragraph color="red">{error.trigger_price}</Paragraph>
                                                            )}
                                                        </YStack>
                                                    )}
                                                    <YStack>
                                                        <Paragraph>Chốt lời</Paragraph>
                                                        <InputPlusMinus
                                                            value={form.percent_take_profit || ""}
                                                            reference={1}
                                                            onChange={(value) => setForm({percent_take_profit: value})}
                                                            pre={"+%"}
                                                        />
                                                        {(form.percent_take_profit && parseToNumber(form.percent_take_profit) > 0) && (
                                                            <Paragraph color={DefaultColor.slate[500]}>
                                                                Gía chốt
                                                                lời:{calculateProfit(props.price, form.percent_take_profit, form.volume, "TP")}
                                                            </Paragraph>
                                                        )}
                                                        {error?.percent_take_profit && (
                                                            <Paragraph color="red">{error.percent_take_profit}</Paragraph>
                                                        )}
                                                    </YStack>
                                                    <YStack>
                                                        <Paragraph>Cắt lỗ</Paragraph>
                                                        <InputPlusMinus
                                                            value={form.percent_stop_loss || ""}
                                                            reference={1}
                                                            onChange={(value) => setForm({percent_stop_loss: value})}
                                                            pre={"-%"}
                                                        />
                                                        {(form.percent_stop_loss && parseToNumber(form.percent_stop_loss) > 0) && (
                                                            <Paragraph color={DefaultColor.slate[500]}>
                                                                Gía cắt lỗ:{calculateProfit(props.price, form.percent_stop_loss, form.volume, "SL")}
                                                            </Paragraph>
                                                        )}
                                                        {error?.percent_stop_loss && (
                                                            <Paragraph color="red">{error.percent_stop_loss}</Paragraph>
                                                        )}
                                                    </YStack>
                                                </YStack>
                                            </YStack>
                                        </>
                                    )}
                                </View>
                                <YStack gap={"$2"}>
                                    <XStack gap="$2" alignItems="center" marginTop={"$4"}>
                                        <Button onPress={() => props.setOpen(false)}>Hủy</Button>
                                        <Button
                                            disabled={error.isError}
                                            flex={1}
                                            theme={props.tradeType === _TradeType.BUY ? "blue" : "red"}
                                            backgroundColor={props.tradeType === _TradeType.BUY ?
                                                (error.isError ? DefaultColor.blue[300] : DefaultColor.blue[500]) :
                                                (error.isError ? DefaultColor.red[300] : DefaultColor.red[500])}
                                            color="#fff"
                                            fontWeight="bold"
                                            onPress={() => {
                                                const dataSubmit = {
                                                    account_id: form.account_id,
                                                    asset_trading_id: form.asset_trading_id,
                                                    type: form.type,
                                                    type_trigger: form.type_trigger,
                                                    volume: form.volume,
                                                    entry_price: props.price.toString(),
                                                    trigger_price: form.trigger_price,
                                                    percent_take_profit: form.percent_take_profit,
                                                    percent_stop_loss: form.percent_stop_loss,
                                                }
                                                mutate(dataSubmit)
                                            }}
                                        >
                                            <YStack alignItems="center" justifyContent="center">
                                                <Paragraph theme="alt2" fontSize="$2" color="#fff">Xác
                                                    nhận {props.tradeType === _TradeType.BUY ? "Mua" : "Bán"} {form.volume} lô</Paragraph>
                                                <Paragraph theme="alt2" fontSize="$5" fontWeight="500" color="#fff">
                                                    {props.price}
                                                </Paragraph>
                                            </YStack>
                                        </Button>
                                    </XStack>

                                    <XStack justifyContent={"space-between"} alignItems={"center"} gap={"$2"}>
                                        <Paragraph color={DefaultColor.slate[400]} fontSize={sizeDefault.sm}>
                                            Phí: ~{hookInfoTrading.trans_fee.toFixed(2)} | Thực: ~{hookInfoTrading.priceConvert.totalPrice.toFixed(2)} (Đòn bẩy: {props.account?.lever?.min || 0}:{props.account?.lever?.max || 0})
                                        </Paragraph>
                                        <TouchableOpacity onPress={() => setOpenMoreInfo(true)}>
                                            <MaterialIcons name="info-outline" size={sizeDefault.lg} color={DefaultColor.slate[400]} />
                                        </TouchableOpacity>
                                    </XStack>
                                </YStack>
                            </YStack>
                        </TouchableWithoutFeedback>
                    </BottomSheetScrollView>
                </BottomSheetView>
            </BottomSheet>
            <TransactionMoreInfo open={openMoreInfo} setOpen={setOpenMoreInfo} hookInfoTrading={hookInfoTrading} />
        </>
    )
}

type InputPlusMinusProps = {
    value: string,
    reference: number,
    onChange: (value: string) => void,
    onFocus?: () => void,
    onBlur?: () => void,
    pre?: string
}

const InputPlusMinus: FC<InputPlusMinusProps> = props => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                const num = parseToNumber(props.value);
                const increased = num - props.reference;
                if (increased >= props.reference) {
                    props.onChange(formatNumber(increased));
                }
            }} style={[
                styles.button,
            ]}>
                <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                keyboardType="numeric"
                value={props.value}
                onChangeText={(text) => props.onChange(text)}
            />
            <TouchableOpacity
                onPress={() => {
                    const num = parseToNumber(props.value);
                    const increased = num + props.reference;
                    props.onChange(formatNumber(increased));

                }}
                style={[styles.button]}
            >
                <Text style={styles.buttonText}>＋</Text>
            </TouchableOpacity>
            {props.pre && (
                <View style={styles.pre}>
                    <Paragraph>{props.pre}</Paragraph>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: DefaultColor.slate[300],
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 0,
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        marginHorizontal: 10,
        borderRadius: 6,
    },
    button: {
        paddingHorizontal: 12,
    },
    buttonText: {
        fontSize: 20,
        color: DefaultColor.slate[300],
        fontWeight: 'bold',
    },
    pre: {
        alignItems: "center",
        justifyContent: "center",
        borderLeftWidth: 1,
        borderColor: DefaultColor.slate[300],
        paddingLeft: 10
    },
    btn_round: {
        width: 40,
        height: 40,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: DefaultColor.slate[100],
    }
});

export default TransactionSheet;