import { useSafeAreaInsets } from "react-native-safe-area-context";
import {Card, Paragraph, XStack, YStack} from "tamagui";
import {Alert, TouchableOpacity, View} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";
import {Href, router} from "expo-router";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {useMutationDeletedFavoriteSymbol, useQueryFavoriteSymbolQuery} from "@/services/assest_trading/hook";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {useAppStore} from "@/services/app/store";
import {useEffect} from "react";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";


export const HeaderEditFavoriteScreen = ({routerBack} :{ routerBack?: Href}) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                backgroundColor: DefaultColor.white,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingTop: insets.top,
                paddingBottom: 10,
                justifyContent: "space-between"
            }}
        >
            <XStack gap={"$4"} alignItems={"center"}>
                <TouchableOpacity
                    onPress={() => {
                        if (routerBack) {
                            router.replace(routerBack)
                        }else {
                            router.back();
                        }
                    }}
                    style={{
                        padding: 8,
                        borderRadius: 100,
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#000"/>
                </TouchableOpacity>
                <Paragraph fontWeight={700} fontSize={20}>Sửa danh sách yêu thích</Paragraph>
            </XStack>
            <TouchableOpacity
                onPress={() => {
                    router.push("/(app)/(trade)/addFavorite")
                }}
                style={{
                    padding: 8,
                    borderRadius: 100,
                }}
            >
                <AntDesign name="plus" size={24} color="black"/>
            </TouchableOpacity>
        </View>
    );
}

export default function EditFavoriteScreen() {
    const insets = useSafeAreaInsets();
    
    const {isRefetching, isLoading, data, refetch} = useQueryFavoriteSymbolQuery();
    
    const setLoading = useAppStore(state => state.setLoading);
    
    const {mutate, isPending} = useMutationDeletedFavoriteSymbol({
        onSuccess: async () => {
            refetch();
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error);
        }
    })
    useEffect(() => {
        setLoading(isLoading || isRefetching || isPending);
    }, [isLoading, isRefetching, isPending, setLoading]);
    
    const favoriteSymbols = data?.data || null;

    return (
        <LayoutScrollApp style={{marginBottom: insets.bottom + 40, flex: 1}}>
            <YStack flex={1} gap={"$2"}>
                {!isLoading && favoriteSymbols && favoriteSymbols.length > 0 && favoriteSymbols.map((item, index) => (
                    <Card
                        key={item.id}
                        bordered paddingHorizontal={"$3"}
                        paddingVertical={"$2"}
                        backgroundColor={DefaultColor.white}
                    >
                        <XStack alignItems={"center"} gap={"$2"}>
                            <TouchableOpacity onPress={() => {
                                Alert.alert("Xóa giao dịch yêu thích","Ban có chắc muốn xóa không ?",[
                                    {text: "Đồng ý", onPress: () => mutate({asset_trading_id: item.id})},
                                    {text: "Hủy", style: "destructive"}
                                ])
                            }}>
                                <AntDesign name="close" size={18} color="black"/>
                            </TouchableOpacity>
                            {/*symbol and info*/}
                            <YStack gap={"$2"}>
                                <XStack alignItems={"flex-start"} justifyContent={"flex-start"} gap={"$2"}>
                                    <SymbolAssetIcons
                                        symbol={item.symbol}
                                        currency_base={item.currency_base}
                                        currency_quote={item.currency_quote ?? ""}
                                        size={18}
                                    />
                                    <Paragraph fontSize={16} fontWeight={700}>{item.symbol}</Paragraph>
                                </XStack>
                                <Paragraph fontSize={12} fontWeight={500} color={DefaultColor.slate[400]}>
                                    {item.currency_base} {item.currency_quote ? `vs ${item.currency_quote}` : ''}
                                </Paragraph>
                            </YStack>
                        </XStack>
                    </Card>
                ))}
            </YStack>
        </LayoutScrollApp>
    )
}