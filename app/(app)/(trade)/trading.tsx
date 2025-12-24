import {FontAwesome6, MaterialIcons} from "@expo/vector-icons";
import {_Timeframe, _TradeType, _TypeChart, TIME_FRAME_SELECT} from "@/services/transaction/@types";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import type {WebView as WebViewType} from 'react-native-webview';
import WebView from "react-native-webview";
import {useCallback, useEffect, useRef, useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import {useGetAccountActive} from "@/services/account/hook";
import useNestedState from "@/hooks/useNestedState";
import {useQueryItemSymbol, useSubscribeSymbols} from "@/services/assest_trading/hook";
import {useAuthStore} from "@/services/auth/store";
import {useSubscribeSymbolStore} from "@/services/assest_trading/store";
import {calculateBidAskSpread} from "@/libs/utils";
import {showMessage} from "react-native-flash-message";
import {useAppStore} from "@/services/app/store";
import {useTransactionTotal} from "@/services/transaction/hook";
import {ActivityIndicator, Alert, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import {Paragraph, XStack, YStack} from "tamagui";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import DefaultColor from "@/components/ui/DefaultColor";
import SkeletonFade from "@/components/SkeletonFade";
import TransactionSection from "@/components/TransactionSection";
import { BACKEND_REACT_URL } from "@/libs/constant_env";
import BottomSheetSelect from "@/components/BottomSheetSelect";
import TransactionSheet from "@/components/TransactionSheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import BadgeAccount from "@/components/account/Badge";

export const TYPE_CHART_SELECT = [
    {label: 'Đường', unit: <FontAwesome6 name="chart-line" size={sizeDefault.md} color="black"/>, value: _TypeChart.LINE},
    {
        label: 'Biểu đồ nến',
        unit: <MaterialIcons name="candlestick-chart" size={sizeDefault.md} color="black"/>,
        value: _TypeChart.CANDLE
    },
]

export default function TradingScreen() {
    const webViewRef = useRef<WebViewType>(null);
    const insets = useSafeAreaInsets();

    const [isWebViewReady, setIsWebViewReady] = useState(false);
    const {symbol} = useLocalSearchParams<{ symbol?: string }>();
    const [openTransactionSheet,  setOpenTransactionSheet] = useState<boolean>(false);
    const [tradeType, setTradeType] = useState<_TradeType>(_TradeType.BUY);
    const {account} =  useGetAccountActive();
    const [loadingChart, setLoadingChart] = useState(false);
    const [errorChart, setErrorChart] = useState(false);

    const authData = useAuthStore(s => s.auth_data);
    // set loading
    const setLoading = useAppStore(state => state.setLoading);

    const [filter, setFilter] = useNestedState({
        timeframe: _Timeframe.FiveMinute,
        type_chart: _TypeChart.LINE,
    });
    const queryItemSymbol = useQueryItemSymbol(symbol);

    // get realtime
    useSubscribeSymbols([symbol || ''], authData?.user?.id, authData?.user?.secret);
    const priceRealtime = useSubscribeSymbolStore(s => s.prices[symbol || '']);
    const sendChartPayload = useCallback(() => {
        if (!webViewRef.current || !authData?.user || !symbol) return;
        const payload = {
            type: "PAYLOAD",
            symbol,
            interval: filter.timeframe,
            chartType: filter.type_chart,
            user_id: authData?.user?.id,
            secret: authData?.user?.secret,
        };
        webViewRef.current.postMessage(JSON.stringify(payload));
    },[authData?.user, filter.timeframe, filter.type_chart, symbol]);

    const callReloadOpenTrans = useCallback(() => {
        if (!webViewRef.current) return;
        const payload = {
            type: "RELOAD_OPEN_TRANS",
        };
        webViewRef.current.postMessage(JSON.stringify(payload));
    },[])

    // // send to web view to handle chart
    useEffect(() => {
        if (!isWebViewReady || !webViewRef.current) return;
        sendChartPayload();
    }, [symbol, filter.timeframe, filter.type_chart, authData, isWebViewReady]);
    //
    const {bid, ask, spread} = calculateBidAskSpread(priceRealtime?.price, queryItemSymbol.data ? queryItemSymbol.data.spread : "");

    useEffect(() => {
        if (queryItemSymbol.isError || errorChart) {
            setLoading(false);
            showMessage({
                type: "danger",
                message: "Có trục trặc kĩ thuật",
                description: "Có lỗi xảy ra, vui lòng thử lại sau",
                duration: 3000,
            })
            router.back();
        }
    }, [queryItemSymbol.isError, errorChart]);

    useEffect(() => {
        setLoading(queryItemSymbol.isLoading || queryItemSymbol.isRefetching || loadingChart);
    }, [queryItemSymbol.isLoading, queryItemSymbol.isRefetching, loadingChart]);

    // call total transaction
    const {query} = useTransactionTotal(account?.id || null);
    useEffect(() => {
        if (account?.id) {
            query.refetch();
        }
    }, [account?.id]);

    return (
        <>
            <View
                style={{
                    backgroundColor: DefaultColor.white,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingTop: insets.top,
                    paddingBottom: 10,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                    style={{
                        padding: 8,
                        borderRadius: 100,
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <BadgeAccount />
            </View>
            <View style={{flex: 1, paddingTop: 0}}>
                {/*Header*/}
                <View style={{
                    paddingHorizontal: 20
                }}>
                    <YStack gap={"$2"} marginBottom={"$2"}>
                        <XStack alignItems={"center"} gap={"$2"}>
                            {/*Symbol info*/}
                            <YStack gap={"$2"}>
                                <XStack alignItems={"flex-start"} justifyContent={"center"} gap={"$2"}>
                                    {queryItemSymbol.data &&
                                        <SymbolAssetIcons
                                            symbol={queryItemSymbol.data.symbol}
                                            currency_base={queryItemSymbol.data.currency_base}
                                            currency_quote={queryItemSymbol.data.currency_quote || ''}
                                            size={18}
                                        />
                                    }
                                    <YStack>
                                        {queryItemSymbol.data ? <Paragraph fontSize={20} fontWeight={700}>{queryItemSymbol.data.symbol}</Paragraph> :
                                            <SkeletonFade/>}
                                        {queryItemSymbol.data ? (
                                            <Paragraph fontSize={12} fontWeight={500} color={DefaultColor.slate[400]}
                                                       numberOfLines={1} maxWidth={200}>
                                                {queryItemSymbol.data.currency_base}
                                                {queryItemSymbol.data.currency_quote ? `vs ${queryItemSymbol.data.currency_quote}` : ''}
                                            </Paragraph>
                                        ) : <SkeletonFade/>}
                                    </YStack>
                                </XStack>
                            </YStack>
                        </XStack>
                        <TransactionSection account={account} />
                    </YStack>
                </View>

                {/*Chart*/}
                <WebView
                    ref={webViewRef}
                    renderLoading={() => <ActivityIndicator/>}
                    source={{uri: BACKEND_REACT_URL}}
                    mixedContentMode="always"
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}
                    scrollEnabled={false}
                    onError={() => {
                        setErrorChart(true)
                    }}
                    onMessage={(event) => {
                        if (event.nativeEvent.data === 'READY') {
                            if (!isWebViewReady) {
                                setIsWebViewReady(true);
                            }
                            if (Platform.OS === 'android') {
                                setTimeout(() => {
                                    if (!isWebViewReady) {
                                        setIsWebViewReady(true);
                                    }
                                }, 300);
                            } else {
                                sendChartPayload();
                            }
                        }
                        if (event.nativeEvent.data === 'IS_LOADING') {
                            setLoadingChart(true)
                        }else if (event.nativeEvent.data === 'IS_NOT_LOADING') {
                            setLoadingChart(false)
                        }
                        if (event.nativeEvent.data === 'IS_ERROR') {
                            setErrorChart(true)
                        }else if (event.nativeEvent.data === 'IS_NOT_ERROR') {
                            setErrorChart(false)
                        }
                    }}
                />

                {/*Footer*/}
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingBottom: 20,
                    }}
                >
                    <YStack gap={"$4"} paddingTop={"$4"}>
                        <XStack alignItems={"center"} gap={"$4"} justifyContent={"space-between"}>
                            <XStack gap={"$2"}>
                                <BottomSheetSelect
                                    options={TYPE_CHART_SELECT}
                                    value={filter.type_chart}
                                    snapPoints={[50]}
                                    onChange={(value) => {
                                        const valueSelect = value as _TypeChart;
                                        setFilter({type_chart: valueSelect})
                                    }}
                                />
                                <BottomSheetSelect
                                    options={TIME_FRAME_SELECT}
                                    value={filter.timeframe}
                                    snapPoints={[50]}
                                    onChange={(value) => {
                                        const valueSelect = value as _Timeframe;
                                        setFilter({timeframe: valueSelect})
                                    }}
                                />
                            </XStack>
                        </XStack>
                        <View style={{
                            position: "relative",
                            width: "100%"
                        }}>
                            <XStack width={"100%"} gap={"$2"}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (account){
                                            setOpenTransactionSheet(true);
                                            setTradeType(_TradeType.SELL);
                                        }else {
                                            Alert.alert('Bạn cần mở tài khoản', 'Bạn cần mở tài khoản trước để có thể giao dịch được')
                                        }
                                    }}
                                    style={[
                                        styles.btn_trading, {backgroundColor: DefaultColor.red[500]}
                                    ]}
                                >
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>BÁN</Paragraph>
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>{bid}</Paragraph>
                                </TouchableOpacity>
                                <View style={styles.spread}>
                                    <Paragraph fontSize={12}>{spread}</Paragraph>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (account){
                                            setOpenTransactionSheet(true);
                                            setTradeType(_TradeType.BUY);
                                        }else {
                                            Alert.alert('Bạn cần mở tài khoản', 'Bạn cần mở tài khoản trước để có thể giao dịch được')
                                        }
                                    }}
                                    style={[
                                        styles.btn_trading, {backgroundColor: DefaultColor.blue[500]}
                                    ]}
                                >
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>MUA</Paragraph>
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>{ask}</Paragraph>
                                </TouchableOpacity>
                            </XStack>
                        </View>
                    </YStack>
                </View>
            </View>
            <TransactionSheet
                symbol={queryItemSymbol.data}
                account={account}
                tradeType={tradeType}
                open={openTransactionSheet}
                setOpen={setOpenTransactionSheet}
                callReloadOpenTrans={callReloadOpenTrans}
                price={tradeType === _TradeType.BUY ? ask : bid}
            />
        </>
    )
}

const styles = StyleSheet.create({
    btn_trading: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
        borderRadius: 8,
    },
    spread: {
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: [{translateX: "-50%"}, {translateY: "-100%"}],
        paddingHorizontal: 4,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        zIndex: 1,
        backgroundColor: DefaultColor.white
    },
})
