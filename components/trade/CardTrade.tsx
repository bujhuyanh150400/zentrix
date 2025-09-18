import {FC, useEffect, useMemo} from "react";
import {Card, Paragraph, View, YStack} from "tamagui";
import {Symbol} from "@/services/assest_trading/@types";
import SkeletonFade from "@/components/SkeletonFade";
import DefaultColor from "@/components/ui/DefaultColor";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import {useAuthStore} from "@/services/auth/store";
import {useSubscribeSymbols} from "@/services/assest_trading/hook";
import {useSubscribeSymbolStore} from "@/services/assest_trading/store";
import {useQuery} from "@tanstack/react-query";
import tradeAPI from "@/services/trade/api";
import {_Timeframe} from "@/services/transaction/@types";
import dayjs from "dayjs";
import {CartesianChart, Line} from "victory-native";
import {TouchableOpacity} from "react-native";
import {router} from "expo-router";


type Props = {
    symbol?: Symbol;
    showChart?: boolean;
}
const CardTrade: FC<Props> = (props) => {
    const authData = useAuthStore(s => s.auth_data);
    useSubscribeSymbols([props.symbol?.symbol || ''], authData?.user?.id, authData?.user?.secret);
    const prices = useSubscribeSymbolStore((s) => s.prices);
    const symbolRealPrice = useMemo(() => {
        if (props.symbol) {
            const ws = prices[props.symbol.symbol];
            return {
                ...props.symbol,
                price: ws?.price ?? null,
                percent: ws?.percent ?? null,
            }
        }
        return null;
    }, [props.symbol, prices]);

    const {data, refetch} = useQuery({
        queryKey: ['twelveAPI-timeSeries', props.symbol],
        enabled: false,
        queryFn: async () => {
            return await tradeAPI.timeSeries({
                symbol: props.symbol?.symbol || '',
                interval: _Timeframe.FiveMinute,
                outputsize: 30,
                order: 'ASC',
                timezone: "Asia/Bangkok"
            });
        },
        select: (res) => res.values ?? [],
    });

    useEffect(() => {
        if (props.showChart && props.symbol){
            refetch();
        }
    }, [props.symbol, props.showChart]);

    const chartData = useMemo(() => {
        if (data) {
            return data.map(item => {
                return {
                    time: dayjs(item.datetime.date).unix(),
                    value: parseFloat(item.close),
                };
            })
        }
        return [] as { time: number, value: number }[];
    }, [data])

    return (
        <TouchableOpacity
            onPress={() => {
                if (props.symbol) {
                    router.push({
                        pathname: '/(app)/(trade)/trading',
                        params: {
                            symbol: props.symbol.symbol
                        }
                    })
                }
            }}
        >
            <Card backgroundColor={DefaultColor.slate["100"]} paddingHorizontal={10} paddingVertical={4}
                  justifyContent={"space-between"} alignItems={"center"} flexDirection={"row"} gap={"10"}>
                <YStack gap="$1">
                    {symbolRealPrice ? (
                        <>
                            <Paragraph fontWeight={700}
                                       fontSize={sizeDefault.md}>{symbolRealPrice.currency_base}</Paragraph>
                            <Paragraph fontSize={sizeDefault.sm}>{symbolRealPrice.symbol}</Paragraph>
                        </>
                    ) : <>
                        <SkeletonFade width={140}/>
                        <SkeletonFade/>
                    </>}
                </YStack>
                <YStack gap="$1" alignItems={"flex-end"}>
                    {symbolRealPrice ? (
                        <>
                            {symbolRealPrice.percent ?
                                <Paragraph fontSize={sizeDefault.sm}
                                           fontWeight={700}
                                           color={symbolRealPrice.percent > 0 ? DefaultColor.green[400] : DefaultColor.red[400]}>
                                    {symbolRealPrice.percent > 0 ? "+" : ""}
                                    {symbolRealPrice.percent} %
                                </Paragraph>
                                : <SkeletonFade/>
                            }
                            {props.showChart && (
                                chartData.length > 0 ?
                                    (
                                        <View height={40} width={100}>
                                            <CartesianChart data={chartData} xKey="time" yKeys={["value"]}

                                            >
                                                {({points}) => (
                                                    <Line points={points.value} color={
                                                        symbolRealPrice.percent && symbolRealPrice.percent > 0 ? DefaultColor.green[400] : DefaultColor.red[400]
                                                    } strokeWidth={1}/>
                                                )}
                                            </CartesianChart>

                                        </View>
                                    )
                                    : <SkeletonFade/>
                            )}
                        </>
                    ) : <>
                        <SkeletonFade/>
                        <SkeletonFade/>
                    </>}

                </YStack>
            </Card>
        </TouchableOpacity>
    )
}


export default CardTrade;