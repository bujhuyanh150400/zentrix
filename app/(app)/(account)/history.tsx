import {ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Card, Paragraph, XStack, YStack} from "tamagui";
import DefaultStyle, {sizeDefault} from "@/components/ui/DefaultStyle";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import useNestedState from "@/hooks/useNestedState";
import {_AccountStatus, _HistoryStatus, _HistoryType, ListHistoryRequest} from "@/services/account/@types";
import {useGetAccountActive, useInfiniteHistoryList} from "@/services/account/hook";
import {useEffect} from "react";
import {RefreshControl} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {showMessage} from "react-native-flash-message";
import {useShowErrorHandler} from "@/hooks/useHandleError";


export default function HistoryScreen(){
    const insets = useSafeAreaInsets();

    const queryAccountActive = useGetAccountActive();

    const account = queryAccountActive.account;

    const [filter, setFilter] = useNestedState<ListHistoryRequest>({
        account_id: account?.id || 0,
        page: 1
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    }= useInfiniteHistoryList(filter);

    const flatData = data?.pages.flatMap((page) => page.data) || [];

    useEffect(() => {
        if (account){
            setFilter({account_id: account.id});
            refetch();
        }
    }, [account]);


    return (
        <View style={{flex: 1}}>
            {/*Header*/}
            <View
                style={{
                    backgroundColor: DefaultColor.white,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    paddingTop: insets.top,
                    paddingBottom: 10,
                }}
            >
                <View style={{flex: 1}}>
                    <TouchableOpacity
                        onPress={() => {
                            router.back();
                        }}
                        style={{
                            padding: 8,
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Paragraph textAlign={"center"} fontWeight={700} fontSize={sizeDefault.md}>Lịch sử</Paragraph>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}/>
            </View>
            <YStack flex={1}  backgroundColor={DefaultColor.white} paddingVertical={10} paddingHorizontal={20}>
                <FlatList
                    data={flatData}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => {
                        if (!isFetchingNextPage) return null;
                        return <ActivityIndicator style={{marginVertical: 10}}/>;
                    }}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}/>
                    }
                    renderItem={({item, index}) => (
                        <Card size={"$2"} paddingVertical={8} paddingHorizontal={4} bordered
                              backgroundColor={DefaultColor.white} marginBottom={15}>
                            <XStack alignItems={"flex-start"} gap={"$2"}>
                                {item.type === _HistoryType.WITHDRAW && <Ionicons name="arrow-down-circle-outline" size={sizeDefault['5xl']} color={DefaultColor.yellow[500]} />}
                                {item.type === _HistoryType.RECHARGE && <Ionicons name="arrow-up-circle-outline" size={sizeDefault['5xl']} color={DefaultColor.green[500]} />}
                                <YStack gap={"$2"}>
                                    <XStack alignItems={"center"} gap={"$2"}>
                                        <Text style={{color: DefaultColor.slate[700], fontWeight: 700}}>
                                            {item.type === _HistoryType.WITHDRAW && "Rút tiền"}
                                            {item.type === _HistoryType.RECHARGE && "Nạp Tiền"}
                                        </Text>
                                        <View style={[
                                            DefaultStyle.badge,
                                            {
                                                backgroundColor: DefaultColor.slate[400]
                                            }
                                        ]}>
                                            <Text style={{fontSize: sizeDefault.sm, color: DefaultColor.white}}>
                                                {item.status === _HistoryStatus.STATUS_DONE && "Hoàn tất"}
                                                {item.status === _HistoryStatus.STATUS_UNAPPROVE && "Không thành công"}
                                                {item.status === _HistoryStatus.STATUS_PROCESSING && "Chờ xác nhận"}
                                            </Text>
                                        </View>
                                    </XStack>
                                    {item.price && <Text style={{fontSize: sizeDefault.sm, color: DefaultColor.slate['500']}}>- Số tiền: {Number(item.price).toLocaleString('en-US')} USD</Text>}
                                    {item.price && <Text style={{fontSize: sizeDefault.sm, color: DefaultColor.slate['500']}}>- Số tiền chuyển khoản: {Number(item.amount_vnd).toLocaleString('en-US')} VND</Text>}
                                    {item.transaction_code && <Text style={{fontSize: sizeDefault.sm, color: DefaultColor.slate['500']}}>- Mã giao dịch: {item.transaction_code}</Text>}
                                </YStack>
                            </XStack>
                        </Card>
                    )}
                    ListEmptyComponent={() => (
                        <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center"
                                justifyContent="center" gap="$4">
                            <Paragraph fontWeight="bold" theme="alt2">Không có lịch sử giao dịch nào</Paragraph>
                            <Paragraph textAlign="center" theme="alt2">Hãy nạp hoặc rút tiền để có lịch sử giao dịch của tài khoản</Paragraph>
                        </YStack>
                    )}
                />
            </YStack>
        </View>
    )
}