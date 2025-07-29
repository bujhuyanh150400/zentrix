import {Account} from "@/services/account/@types";
import {Dispatch, FC, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import useNestedState from "@/hooks/useNestedState";
import {
    _TradeType,
    _TransactionStatus, _TransactionTriggerType,
    CalculateTransactionPrices,
    TransactionHistoryRequestType
} from "@/services/transaction/@types";
import {
    useCalculateTransactionPrices, useMutationCanceledTrans,
    useMutationCloseTrans, useMutationOpenNowTrans,
    useTransactionHistory,
    useTransactionTotal
} from "@/services/transaction/hook";
import {ScrollView} from "react-native-gesture-handler";
import {Alert, TouchableOpacity, View} from "react-native";
import {Button, Card, Paragraph, Separator, Sheet, XStack, YStack} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import DefaultStyle from "@/components/ui/DefaultStyle";
import HorizontalTabBar from "@/components/HorizontalTabBar";
import SkeletonCardSymbol from "@/components/SkeletonCardSymbol";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import SkeletonFade from "@/components/SkeletonFade";
import { showMessage } from "react-native-flash-message";
import { useShowErrorHandler } from "@/hooks/useHandleError";


type Props = {
    account: Account | null,
    showTotal?: boolean,
    allowScroll?: boolean,
}

const TransactionTabs: FC<Props> = (props) => {

    const [filter, setFilter] = useNestedState<TransactionHistoryRequestType>({
        account_id: props.account?.id || 0,
        status: _TransactionStatus.OPEN
    });
    const [openInfo, setOpenInfo] = useState<boolean>(false);

    const selectedTransactionRef = useRef<number | null>(null);

    const {query, transactions} = useTransactionHistory(filter);

    const ContentWrapper = props.allowScroll ? ScrollView : View;

    const hookTotal = useTransactionTotal(props.account?.id || null);

    const transactionsData = transactions[filter.status] || [];

    const hookCalculate = useCalculateTransactionPrices(transactionsData, filter.status === _TransactionStatus.OPEN || filter.status === _TransactionStatus.WAITING);

    useEffect(() => {
        if (query.isRefetching) {
            hookTotal.query.refetch()
        }
    }, [query.isRefetching]);

    useEffect(() => {
        if (props.account) {
            setFilter({account_id: props.account.id});
        }
        if (props.showTotal) {
            hookTotal.query.refetch();
        }
    }, [ props.account, props.showTotal]);

    useEffect(() => {
        query.refetch();
    }, [filter.status]);

    return (
        <>
            <View>
                <HorizontalTabBar<_TransactionStatus>
                    tabs={[
                        {
                            key: _TransactionStatus.OPEN,
                            item: (isActive) => (
                                <XStack gap={"$2"}>
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Mở
                                    </Paragraph>
                                    {(props.showTotal && hookTotal.total && hookTotal.total.open > 0) && (
                                        <View style={[
                                            DefaultStyle.badgeCircle,
                                            {backgroundColor: isActive ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                                        ]}>
                                            <Paragraph
                                                fontSize={12}
                                                fontWeight={isActive ? 700 : 500}
                                                color={isActive ? DefaultColor.slate[700] : DefaultColor.slate[400]}
                                            >
                                                {hookTotal.total.open}
                                            </Paragraph>
                                        </View>
                                    )}
                                </XStack>
                            ),
                        },
                        {
                            key: _TransactionStatus.WAITING,
                            item: (isActive) => (
                                <XStack gap={"$2"}>
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Chờ giao dịch
                                    </Paragraph>
                                    {(props.showTotal && hookTotal.total && hookTotal.total.waiting > 0) && (
                                        <View style={[
                                            DefaultStyle.badgeCircle,
                                            {backgroundColor: isActive ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                                        ]}>
                                            <Paragraph
                                                fontSize={12}
                                                fontWeight={isActive ? 700 : 500}
                                                color={isActive ? DefaultColor.slate[700] : DefaultColor.slate[400]}
                                            >
                                                {hookTotal.total.waiting}
                                            </Paragraph>
                                        </View>
                                    )}
                                </XStack>
                            ),
                        },
                        {
                            key: _TransactionStatus.CLOSED,
                            item: (isActive) => (
                                <XStack>
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Đóng
                                    </Paragraph>
                                </XStack>
                            ),
                        },
                    ]}
                    activeKey={filter.status}
                    onTabPress={(tab) => {
                        setFilter({status: tab});
                    }}
                    styleContainer={{

                    }}
                    styleTab={{
                        paddingVertical: 12,
                    }}
                />
            </View>
            <ContentWrapper
                style={{
                    flex: 1,
                    marginTop: 10,
                    marginBottom: 60,
                }}>
                {(query.isLoading || query.isRefetching) ? <SkeletonCardSymbol numberCard={2}/> : (
                    <>
                        {(hookCalculate.data && hookCalculate.data.length > 0)
                            ? <>
                                {filter.status === _TransactionStatus.OPEN && (
                                    <XStack gap={"$1"}>
                                        <Paragraph fontWeight={700} color={DefaultColor.slate[400]}>Lãi/Lỗ:</Paragraph>
                                        <Paragraph fontWeight={700}
                                                   color={hookCalculate.total > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>{hookCalculate.total.toFixed(2)}</Paragraph>
                                    </XStack>
                                )}

                                {hookCalculate.data.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                setOpenInfo(true);
                                                selectedTransactionRef.current = item.id;
                                            }}
                                        >
                                            <Card bordered paddingHorizontal={"$3"} paddingVertical={"$2"}
                                                  marginVertical={"$2"}
                                                  backgroundColor={DefaultColor.white}>
                                                <XStack alignItems={"flex-start"} justifyContent={"space-between"}
                                                        gap={"$2"}>
                                                    {/*symbol and info*/}
                                                        <SymbolAndInfo item={item} />
                                                </XStack>
                                            </Card>
                                        </TouchableOpacity>
                                    )
                                })}

                                {filter.status === _TransactionStatus.CLOSED && (
                                    <>
                                        <Separator marginVertical={15} />
                                        <YStack flex={1} paddingBottom={20} alignItems="center"
                                                justifyContent="center" gap="$4">
                                            <Paragraph textAlign="center" color={DefaultColor.slate[400]} theme="alt2">Hiển thị các giao dịch đóng trong vòng 30 ngày trở lại gần đây</Paragraph>
                                        </YStack>
                                    </>
                                )}
                            </> :
                            (
                                <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center"
                                        justifyContent="center" gap="$4">
                                    <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch nào</Paragraph>
                                    <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị
                                        trường tài chính lớn trên thế giới</Paragraph>
                                </YStack>
                            )
                        }
                    </>
                )}
            </ContentWrapper>
            <TransactionInfoSheet
                item={selectedTransactionRef}
                setOpen={setOpenInfo}
                open={openInfo}
                hookCalculate={hookCalculate}
                query={query}
            />
        </>
    )
}

const SymbolAndInfo: FC<{item: CalculateTransactionPrices}> = ({item}) => (
    <XStack alignItems={"flex-start"} justifyContent={"space-between"} gap={"$2"} flex={1}>
        {/*symbol and info*/}
        <XStack alignItems={"flex-start"} justifyContent={"flex-start"} gap={"$2"}>
            <SymbolAssetIcons
                symbol={item.symbol.symbol}
                currency_base={item.symbol.currency_base}
                currency_quote={item.symbol.currency_quote || ''}
                size={18}
            />
            <YStack gap={"$2"}>
                <Paragraph fontSize={16}
                           fontWeight={700}>{item.symbol.symbol}</Paragraph>
                <XStack gap={"$1"} alignItems={"center"}>
                    <Paragraph fontSize={14} fontWeight={500}
                               color={item.type === _TradeType.BUY ? DefaultColor.blue[500] : DefaultColor.red[500]}>
                        {item.type === _TradeType.BUY ? 'Mua' : 'Bán'} {item.volume.toFixed(2)} lô
                    </Paragraph>
                    <Paragraph fontSize={14} fontWeight={500}
                               color={DefaultColor.slate[400]}>
                        at {item.entry_price.toFixed(2)}
                    </Paragraph>
                </XStack>
            </YStack>
        </XStack>
        <YStack gap={"$2"} alignItems={"flex-end"}>
            {item.status === _TransactionStatus.OPEN &&
                (<>
                    {item.profit ? (
                        <Paragraph fontSize={14} fontWeight={500}
                                   color={item.profit > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>
                            {item.profit.toFixed(2)}
                        </Paragraph>
                    ) : <SkeletonFade/>}
                    {item.realtime_price ? (
                        <Paragraph fontSize={14} fontWeight={500}
                                   color={DefaultColor.slate[400]}>
                            {item.realtime_price.toFixed(2)}
                        </Paragraph>
                    ) : <SkeletonFade/>}
                </>)
            }
            {item.status === _TransactionStatus.WAITING &&
                (
                    <>
                        {item.trigger_price ? (
                            <Paragraph fontSize={14} fontWeight={500}
                                       color={DefaultColor.slate[400]}>
                                open {item.trigger_price.toFixed(2)}
                            </Paragraph>
                        ) : <SkeletonFade/>}
                        {item.realtime_price ? (
                            <Paragraph fontSize={14} fontWeight={500}
                                       color={DefaultColor.slate[400]}>
                                {item.realtime_price.toFixed(2)}
                            </Paragraph>
                        ) : <SkeletonFade/>}
                    </>
                )
            }
            {item.status === _TransactionStatus.CLOSED &&
                (
                    <>
                        <Paragraph fontSize={14} fontWeight={500} color={DefaultColor.slate[400]}>
                            {item.close_price ? item.close_price.toFixed(2) : '__'}
                        </Paragraph>
                    </>
                )
            }
        </YStack>
    </XStack>
)


const TransactionInfoSheet: FC<{
    item: MutableRefObject<number | null>;
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    hookCalculate: ReturnType<typeof useCalculateTransactionPrices>,
    query: ReturnType<typeof useTransactionHistory>['query']
}> = ({item, open, setOpen, hookCalculate, query}) => {
    const onClosed = useCallback((open: boolean) => {
        setOpen(open);
        if (!open) item.current = null;
    }, [item, setOpen]);

    const mutationCloseTrans = useMutationCloseTrans({
        onSuccess: async () => {
            query.refetch();
            onClosed(false);
            showMessage({
                message: "Chốt giao dịch thành công",
                type: 'success',
                duration: 3000,
            });
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler({error});
        }
    })

    const mutationOpenNowTrans = useMutationOpenNowTrans({
        onSuccess: async () => {
            query.refetch();
            onClosed(false);
            showMessage({
                message: "Mở giao dịch thành công",
                type: 'success',
                duration: 3000,
            });
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler({error});
        }
    })

    const mutationCancelTrans =  useMutationCanceledTrans({
        onSuccess: async () => {
            query.refetch();
            onClosed(false);
            showMessage({
                message: "Xóa giao dịch thành công",
                type: 'success',
                duration: 3000,
            });
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler({error});
        }
    })

    const onCloseTransaction = useCallback((data: CalculateTransactionPrices) => {
        Alert.alert('Đóng giao dịch', 'Bạn có chắc chắn muốn đóng giao dịch này?',
            [
                {text: 'Hủy', style: 'cancel'},
                {
                    text: 'Đóng giao dịch',
                    onPress: () => {
                        if (data.id) {
                            mutationCloseTrans.mutate({
                                transaction_id: data.id,
                                close_price: data.realtime_price || 0
                            });
                        }
                    }
                }
            ]);
    }, [mutationCloseTrans]);

    const onOpenNowTransaction = useCallback((data: CalculateTransactionPrices) => {
        Alert.alert('Thực hiện mở giao dịch', 'Giao dịch đang chờ để chốt giá mong muốn, bạn muốn mở luôn giao dịch ?',
            [
                {text: 'Hủy', style: 'cancel'},
                {
                    text: 'Mở giao dịch',
                    onPress: () => {
                        if (data.id) {
                            mutationOpenNowTrans.mutate({
                                transaction_id: data.id,
                                entry_price: data.realtime_price || 0
                            });
                        }
                    }
                }
            ]);
    }, [mutationOpenNowTrans]);

    const onCancelTransaction = useCallback((data: CalculateTransactionPrices) => {
        Alert.alert('Xóa giao dịch', 'Giao dịch đang chờ để chốt giá mong muốn, bạn không muốn thực hiện giao dịch này nữa ?',
            [
                {text: 'Hủy', style: 'cancel'},
                {
                    text: 'Xóa giao dịch',
                    onPress: () => {
                        if (data.id) {
                            mutationCancelTrans.mutate({
                                transaction_id: data.id,
                            });
                        }
                    }
                }
            ]);
    }, [mutationCancelTrans]);

    const data = hookCalculate.data.find(tx => tx.id === item.current);

    return (
        <Sheet
            forceRemoveScrollEnabled={true}
            modal={true}
            open={open}
            onOpenChange={(open: boolean) => {
                onClosed(open);
            }}
            snapPointsMode={"fit"}
            dismissOnSnapToBottom
            zIndex={200_000}
            animation={"fast"}
        >
            <Sheet.Overlay
                animation="lazy"
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Sheet.Handle/>
            <Sheet.Frame padding="$4" gap="$2">
                {data && (
                    <YStack gap={"$2"}>
                        <XStack alignItems={"center"} justifyContent={"center"}>
                            <Paragraph fontWeight={500} fontSize={12} color={DefaultColor.slate[500]} alignItems={"center"}>#{data.code}</Paragraph>
                        </XStack>
                        {/*symbol info*/}
                        <SymbolAndInfo item={data} />
                        {data.status === _TransactionStatus.WAITING && (
                            <>
                                <XStack alignItems={"center"} justifyContent={"space-between"}>
                                    <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Mở giao dịch lúc:</Paragraph>
                                    <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                        {data.type_trigger === _TransactionTriggerType.TYPE_TRIGGER_LOW_BUY && 'Giá thấp'}
                                        {data.type_trigger === _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY && 'Giá cao'}
                                    </Paragraph>
                                </XStack>

                            </>
                        )}
                        {/*Trạng thái*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Trạng thái:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.status === _TransactionStatus.OPEN && 'Mở'}
                                {data.status === _TransactionStatus.WAITING && 'Chờ giao dịch'}
                                {data.status === _TransactionStatus.CLOSED && 'Đóng'}
                            </Paragraph>
                        </XStack>
                        {/*Giá mở*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Giá mở:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.entry_price.toFixed(2)}
                            </Paragraph>
                        </XStack>
                        {/*Giá đóng*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Giá đóng:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.close_price ? data.close_price.toFixed(2) : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Lỗ/Lãi:*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Lỗ/Lãi:</Paragraph>
                            {data.profit ? (
                                <Paragraph fontWeight={500}
                                           color={data.profit > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>
                                    {data.profit.toFixed(2)}
                                </Paragraph>
                            ) : <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>__</Paragraph>}
                        </XStack>
                        {/*Thời gian mở*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Thời gian mở:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.open_at ? new Date(data.open_at).toLocaleString() : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Thời gian đóng*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Thời gian đóng:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.close_at ? new Date(data.close_at).toLocaleString() : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Giá chốt */}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Giá chốt giao dịch:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.trigger_price ? data.trigger_price.toFixed(2) : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Cắt Lỗ*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Cắt lỗ (SL)</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.stop_loss ? data.stop_loss.toFixed(2) : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Chốt lời*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Chốt lời (TP)</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.take_profit ? data.take_profit.toFixed(2) : '__'}
                            </Paragraph>
                        </XStack>
                        {data.status === _TransactionStatus.OPEN && (
                            <Button
                                flex={1}
                                disabled={mutationCloseTrans.isPending}
                                marginTop={"$2"}
                                onPress={() => {
                                    onCloseTransaction(data);
                                }}
                            >
                                {mutationCloseTrans.isPending ? 'Đang xử lý...' : 'Đóng giao dịch'}
                            </Button>
                        )}
                        {data.status === _TransactionStatus.WAITING &&
                            <XStack alignItems={"center"} gap={"$2"}>
                                <Button
                                    flex={1}
                                    disabled={mutationOpenNowTrans.isPending || mutationCancelTrans.isPending}
                                    marginTop={"$2"}
                                    onPress={() => {
                                        onOpenNowTransaction(data);
                                    }}
                                >
                                    {mutationOpenNowTrans.isPending || mutationCancelTrans.isPending ? 'Đang xử lý...' : 'Mở giao dịch'}
                                </Button>
                                <Button
                                    flex={1}
                                    theme={"red"}
                                    disabled={mutationOpenNowTrans.isPending || mutationCancelTrans.isPending}
                                    marginTop={"$2"}
                                    onPress={() => {
                                        onCancelTransaction(data);
                                    }}
                                >
                                    {mutationOpenNowTrans.isPending || mutationCancelTrans.isPending ? 'Đang xử lý...' : 'Xóa'}
                                </Button>
                            </XStack>
                        }
                    </YStack>
                )}
            </Sheet.Frame>
        </Sheet>
    )
}


export default TransactionTabs