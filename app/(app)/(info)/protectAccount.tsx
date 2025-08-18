import {FC} from "react";
import {Card, H6, Paragraph, XStack, YStack} from "tamagui";
import {_AccountActiveProtectCost, _AccountStatus, _TypeSearch} from "@/services/account/@types";
import {useInfiniteAccountList, useMutationActiveProtectAccount} from "@/services/account/hook";
import DefaultColor from "@/components/ui/DefaultColor";
import {ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View} from "react-native";
import {RefreshControl} from "react-native-gesture-handler";
import DefaultStyle, {sizeDefault} from "@/components/ui/DefaultStyle";
import {useConfigApp} from "@/services/app/hook";
import {_ConfigKey} from "@/services/common/@types";
import {useAppStore} from "@/services/app/store";
import {showMessage} from "react-native-flash-message";
import {useShowErrorHandler} from "@/hooks/useHandleError";

const ProtectAccountScreen: FC = () => {

    const {getConfig} = useConfigApp();

    const feeProtectAccount = getConfig(_ConfigKey.FEE_PROTECT_ACCOUNT_COST);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useInfiniteAccountList({type: _TypeSearch.REAL});

    const setLoading = useAppStore(state => state.setLoading);

    const flatData = data?.pages.flatMap((page) => page.data) || [];

    const {mutate} =  useMutationActiveProtectAccount();

    return (
        <YStack flex={1} gap={"$4"} backgroundColor={DefaultColor.white} paddingBottom={10} paddingHorizontal={20}>
            <H6 paddingVertical={12} fontWeight={700}>Bảo vệ số dư âm</H6>
            <Card size={"$2"} paddingVertical={8} paddingHorizontal={16} bordered backgroundColor={DefaultColor.white}>
                <YStack gap={"$2"}>
                    <Paragraph textAlign={"justify"}>
                        Bạn không thể mất nhiều hơn số tiền mà bạn nạp vào tài khoản. Nếu mức ngưng giao dịch khiến toàn bộ lệnh giao dịch của bạn đóng lại khi số dư đang âm, chúng tôi sẽ khôi phục số dư về mức bạn đặt ra
                    </Paragraph>
                    <Paragraph color={DefaultColor.slate[400]} fontSize={sizeDefault.sm} textAlign={"justify"}>
                        Ví dụ: Nếu một tài khoản giao dịch có số dư là 100 dollar và các lệnh giao dịch được đóngở mức lỗ 150 dollar, tài khoản sẽ có số dư là âm 50 dollar, Với tính năng bảo vệ số dư âm, chúng tôi sẽ đặt lại số dư về 0, và bạn sẽ không cần phải bù đắp khoản lỗ này bằng tiền của mình
                    </Paragraph>
                    {feeProtectAccount &&
                        <Paragraph color={DefaultColor.slate[400]} fontWeight={700} textAlign={"justify"}>
                            Phí bảo vệ cho mỗi giao dịch: {feeProtectAccount.value}%
                        </Paragraph>
                    }
                </YStack>
            </Card>
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
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            Alert.alert(`${item.active_protect_cost === _AccountActiveProtectCost.IN_ACTIVE ? "Kích hoạt" : "Hủy kích hoạt"} Bảo vệ qua đêm`, `Ban có chắc muốn ${item.active_protect_cost === _AccountActiveProtectCost.IN_ACTIVE ? "kích hoạt" : "hủy kích hoạt"} không? Mọi giao dịch trong tài khoản này sẽ được áp dụng ngay lập tức`, [
                                {
                                    text: "Đồng ý", onPress: () => {
                                        setLoading(true);
                                        mutate({
                                            account_id: item.id
                                        }, {
                                            onSuccess: () => {
                                                refetch();
                                                showMessage({
                                                    message: "Thay đổi thành công",
                                                    type: 'success',
                                                    duration: 3000,
                                                });
                                                setLoading(false);
                                            },
                                            onError: (error) => {
                                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                                useShowErrorHandler(error);
                                                setLoading(false);
                                            }
                                        })
                                    }
                                },
                                {text: "Hủy", style: "destructive"}
                            ]);
                        }}
                    >
                        <Card size={"$2"} paddingVertical={8} paddingHorizontal={16} bordered
                              backgroundColor={DefaultColor.white}>
                            <YStack gap={"$2"}>
                                <XStack alignItems={"center"} gap={"$2"} justifyContent={"space-between"}>
                                    <Text style={{
                                        fontSize: sizeDefault["md"],
                                        maxWidth: 100,
                                    }}>
                                        {item.name}
                                    </Text>
                                    <View style={[
                                        DefaultStyle.badge, {
                                            paddingVertical: 5,
                                            backgroundColor: item.active_protect_cost === _AccountActiveProtectCost.ACTIVE ? DefaultColor.green[400] : DefaultColor.slate[200],
                                        }
                                    ]}>
                                        <Text style={{
                                            fontSize: sizeDefault["sm"],
                                        }}>
                                            {item.active_protect_cost === _AccountActiveProtectCost.ACTIVE ? "Đã kích hoạt" : "Chưa kích hoạt"}
                                        </Text>
                                    </View>
                                </XStack>
                                <XStack alignItems={"center"} gap={"$2"}>
                                    {item.status === _AccountStatus.ACTIVE && (
                                        <View style={[
                                            DefaultStyle.badge, {
                                                paddingVertical: 5,
                                                backgroundColor: DefaultColor.green[400],
                                            }
                                        ]}>
                                            <Text style={{
                                                fontSize: sizeDefault["sm"],
                                            }}>
                                                Tài khoản chính
                                            </Text>
                                        </View>
                                    )}
                                    <View style={[
                                        DefaultStyle.badge, {
                                            paddingVertical: 5,
                                            backgroundColor: item.account_type.color ? item.account_type.color : DefaultColor.slate[300]
                                        }
                                    ]}>
                                        <Text style={{
                                            fontSize: sizeDefault["sm"],
                                        }}>
                                            {item.account_type.name}
                                        </Text>
                                    </View>
                                    <Text style={{
                                        fontSize: sizeDefault["sm"],
                                        color: DefaultColor.slate[400]
                                    }}>{item.code}</Text>
                                </XStack>
                            </YStack>
                        </Card>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center"
                            justifyContent="center" gap="$4">
                        <Paragraph fontWeight="bold" theme="alt2">Không có tài khoản giao dịch nào</Paragraph>
                        <Paragraph textAlign="center" theme="alt2">Tạo tài khoản để giao dịch trên các thị
                            trường tài chính lớn trên thế giới</Paragraph>
                    </YStack>
                )}
            />
        </YStack>
    )
}

export default ProtectAccountScreen