import {useSafeAreaInsets} from "react-native-safe-area-context";
import {_AssetType} from "@/services/assest_trading/@types";
import {useEffect, useMemo,  useState} from "react";
import {useAuthStore} from "@/services/auth/store";
import {useQueryListAssetTrading, useSubscribeSymbols} from "@/services/assest_trading/hook";
import {useSubscribeSymbolStore} from "@/services/assest_trading/store";
import {useAppStore} from "@/services/app/store";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {Card, H6, Paragraph, XStack, YStack} from "tamagui";
import {Alert, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {AntDesign, FontAwesome5, FontAwesome6} from "@expo/vector-icons";
import HorizontalTabBar from "@/components/HorizontalTabBar";
import DefaultColor from "@/components/ui/DefaultColor";
import SkeletonCardSymbol from "@/components/SkeletonCardSymbol";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import SkeletonFade from "@/components/SkeletonFade";
import BadgeAccount from "@/components/account/Badge";


export default function TradeListScreen() {
    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState<_AssetType>(_AssetType.FAVORITE);
    const authData = useAuthStore(s => s.auth_data);
    const setLoading = useAppStore(state => state.setLoading);

    const {isRefetching, isLoading, data, refetch} = useQueryListAssetTrading(activeTab);

    const listData = data?.data || null;

    const listSymbol: string[] = useMemo(() => {
        if (listData) {
            return listData.reduce((acc,item) => {
                acc.push(item.symbol);
                return acc;
            },[] as string[])
        }
        return [];
    }, [listData, activeTab]);

    useSubscribeSymbols(listSymbol,authData?.user?.id,authData?.user?.secret);
    const prices = useSubscribeSymbolStore((s) => s.prices);

    const listDataRealtimePrice = useMemo(() => {
        if (listData) {
            return listData.map((item) => {
                const ws = prices[item.symbol];
                return {
                    ...item,
                    price: ws?.price ?? null,
                    percent: ws?.percent ?? null,

                }
            });
        }
        return [];
    }, [listData, prices]);

    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isLoading, isRefetching]);

    useEffect(() => {
        refetch();
    }, [activeTab]);

    return (
        <>
            <LayoutScrollApp style={{marginBottom: insets.bottom + 40, marginTop: 10}}>
                <XStack alignItems={"center"} justifyContent={"center"}>
                    <BadgeAccount />
                </XStack>
                <XStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={"$2"}
                    paddingHorizontal={"$2"}
                >
                    <H6 paddingVertical={12} fontWeight={700}>Giao dịch</H6>
                    <TouchableOpacity onPress={() => router.push("/(app)/(trade)/search")}>
                        <FontAwesome5 name="search" size={20} color="black"/>
                    </TouchableOpacity>
                </XStack>
                <HorizontalTabBar<_AssetType>
                    tabs={[
                        {
                            key: _AssetType.FAVORITE,
                            item: (isActive) => (
                                <View style={{
                                    alignItems: "center",
                                    gap: 4,
                                    flexDirection: "row"
                                }}
                                >
                                    <AntDesign name="staro" size={16} color={
                                        isActive ? DefaultColor.yellow[600] : DefaultColor.slate[300]
                                    }/>
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Yêu thích
                                    </Paragraph>
                                </View>
                            ),
                        },
                        {
                            key: _AssetType.CRYPTO,
                            item: (isActive) => (
                                <View style={{
                                    alignItems: "center",
                                    gap: 4,
                                    flexDirection: "row"
                                }}
                                >
                                    <FontAwesome5 name="coins" size={16} color={
                                        isActive ? DefaultColor.yellow[600] : DefaultColor.slate[300]
                                    }/>
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Crypto
                                    </Paragraph>
                                </View>
                            ),
                        },
                        {
                            key: _AssetType.METAL,
                            item: (isActive) => (
                                <View style={{
                                    alignItems: "center",
                                    gap: 4,
                                    flexDirection: "row"
                                }}
                                >
                                    <FontAwesome6 name="wand-magic-sparkles" size={16} color={
                                        isActive ? DefaultColor.yellow[600] : DefaultColor.slate[300]
                                    }/>
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Kim loại
                                    </Paragraph>
                                </View>
                            ),
                        },
                        {
                            key: _AssetType.ENERGY,
                            item: (isActive) => (
                                <View style={{
                                    alignItems: "center",
                                    gap: 4,
                                    flexDirection: "row"
                                }}
                                >
                                    <FontAwesome6 name="oil-well" size={16} color={
                                        isActive ? DefaultColor.yellow[600] : DefaultColor.slate[300]
                                    }/>
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Dầu khí & năng lượng
                                    </Paragraph>
                                </View>
                            ),
                        }
                    ]}
                    activeKey={activeTab}
                    onTabPress={setActiveTab}
                />
                <YStack marginTop={"$4"} gap={"$2"}>
                    {(isLoading || isRefetching) && (
                        <SkeletonCardSymbol numberCard={5}/>
                    ) }
                    {(!isLoading && !isRefetching) && listDataRealtimePrice && listDataRealtimePrice.length > 0 && (
                        <>
                            {activeTab === _AssetType.FAVORITE && (
                                <XStack>
                                    <TouchableOpacity
                                        onPress={() => router.push("/(app)/(trade)/editFavorite")}
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 2,
                                            borderRadius: 20,
                                            backgroundColor: DefaultColor.slate[200],
                                            flexDirection: "row",
                                            gap: "4",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Paragraph fontWeight={500}>Chỉnh sửa</Paragraph>
                                        <FontAwesome5 name="edit" size={14} color="black"/>
                                    </TouchableOpacity>
                                </XStack>
                            )}
                            {listDataRealtimePrice.map((item,index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        if (item.price) {
                                            router.push({
                                                pathname: '/(app)/(trade)/trading',
                                                params: {
                                                    symbol: item.symbol
                                                }
                                            })
                                        }else {
                                            Alert.alert('Hiện tại giao dịch này không thể truy cập được, vui lòng thử lại sau')
                                        }
                                    }}
                                >
                                    <Card bordered paddingHorizontal={"$3"} paddingVertical={"$2"} marginVertical={"$2"}
                                          backgroundColor={DefaultColor.white}>
                                        <XStack alignItems={"flex-start"} justifyContent={"space-between"} gap={"$2"}>
                                            {/*symbol and info*/}
                                            <YStack gap={"$2"}>
                                                <XStack alignItems={"flex-start"} justifyContent={"flex-start"} gap={"$2"}>
                                                    <SymbolAssetIcons
                                                        symbol={item.symbol}
                                                        currency_base={item.currency_base}
                                                        currency_quote={item.currency_quote || ''}
                                                        size={18}
                                                    />
                                                    <Paragraph fontSize={16} fontWeight={700}>{item.symbol}</Paragraph>
                                                </XStack>
                                                <Paragraph fontSize={12} fontWeight={500} color={DefaultColor.slate[400]} numberOfLines={1} maxWidth={200}>
                                                    {item.currency_base} {item.currency_quote ? `vs ${item.currency_quote}` : ''}
                                                </Paragraph>
                                            </YStack>
                                            <YStack gap={"$2"} alignItems={"flex-end"}>
                                                <Paragraph fontSize={14} fontWeight={700} color={DefaultColor.black}>
                                                    {item.price ?? <SkeletonFade />}
                                                </Paragraph>
                                                {item.percent ?
                                                    <Paragraph fontSize={14} fontWeight={700}
                                                               color={item.percent > 0 ? DefaultColor.green[400] : DefaultColor.red[400]}>
                                                        {item.percent > 0 ? "+" : ""}
                                                        {item.percent} %
                                                    </Paragraph>
                                                    :<SkeletonFade />
                                                }
                                            </YStack>
                                        </XStack>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </YStack>
            </LayoutScrollApp>

        </>
    )

}