import useNestedState from "@/hooks/useNestedState";
import {_AccountStatus, _TypeSearch, ListAccountRequest} from "@/services/account/@types";
import {
    useGetAccountActive,
    useInfiniteAccountList,
    useMutationDeletedAccount,
    useMutationEditActiveAccount
} from "@/services/account/hook";
import {Card, Paragraph, XStack, YStack} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import DefaultStyle, {sizeDefault} from "@/components/ui/DefaultStyle";
import {useRef, useState} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import AddAccountView from "@/components/account/AddAccountView";
import AccountSheet from "@/components/account/Sheet";
import {Ionicons} from "@expo/vector-icons";
import HorizontalTabBar from "@/components/HorizontalTabBar";
import {RefreshControl} from "react-native-gesture-handler";
import Swipeable, {SwipeableMethods} from 'react-native-gesture-handler/ReanimatedSwipeable';
import {useAppStore} from "@/services/app/store";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {showMessage} from "react-native-flash-message";


export default function ListScreen() {
    const insets = useSafeAreaInsets();
    const swipeRefs = useRef<{ [key: string]: SwipeableMethods | null }>({});
    const [openSheet, setOpenSheet] = useState<boolean>(false);

    const accountSheetRef = useRef<BottomSheet>(null);

    const setLoading = useAppStore(state => state.setLoading);

    const queryAccountActive = useGetAccountActive();

    const [filter, setFilter] = useNestedState<ListAccountRequest>({
        type: _TypeSearch.REAL,
        page: 1
    })
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useInfiniteAccountList(filter);

    const flatData = data?.pages.flatMap((page) => page.data) || [];

    const mutationEdit = useMutationEditActiveAccount();

    const mutationDeleted = useMutationDeletedAccount();


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
                    <Paragraph textAlign={"center"} fontWeight={700} fontSize={sizeDefault.md}>Tài khoản</Paragraph>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity
                        onPress={() => {
                            setOpenSheet(true);
                        }}
                        style={{
                            padding: 8,
                            borderRadius: 100,
                        }}
                    >
                        <Ionicons name="add" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
            </View>
            {/*Container*/}
            <YStack flex={1} gap={"$4"} backgroundColor={DefaultColor.white} paddingBottom={10} paddingHorizontal={20}>
                <View>
                    <HorizontalTabBar<_TypeSearch>
                        tabs={[
                            {
                                key: _TypeSearch.REAL,
                                item: (isActive) => (
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Thực
                                    </Paragraph>
                                ),
                            },
                            {
                                key: _TypeSearch.CREDIT,
                                item: (isActive) => (
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Thử nghiệm
                                    </Paragraph>
                                ),
                            },
                        ]}
                        activeKey={filter.type}
                        onTabPress={(tab) => {
                            setFilter({type: tab});
                            refetch();
                        }}
                    />
                </View>
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
                        <Swipeable
                            containerStyle={{
                                marginBottom: 15
                            }}
                            ref={(ref) => {
                                swipeRefs.current[item.id] = ref;
                            }}
                            key={index}
                            renderRightActions={() => {
                                if (item.status === _AccountStatus.ACTIVE) {
                                    return null;
                                }
                                return (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: DefaultColor.slate[400],
                                            borderTopRightRadius: 8,
                                            borderBottomRightRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingHorizontal: 24
                                        }}
                                        onPress={() => {
                                            Alert.alert("Xóa Tài khoản giao dịch", "Ban có chắc muốn xóa không ?", [
                                                {
                                                    text: "Đồng ý", onPress: () => {
                                                        setLoading(true);
                                                        mutationDeleted.mutate({account_id: item.id}, {
                                                            onSuccess: async () => {
                                                                refetch();
                                                                showMessage({
                                                                    message: "Xóa thành công",
                                                                    description: "Xóa tài khoản hoạt động thành công",
                                                                    type: 'success',
                                                                    duration: 3000,
                                                                });
                                                                // Đóng swipe khi item bị update status
                                                                swipeRefs.current[item.id]?.close?.();
                                                                setLoading(false);
                                                            },
                                                            onError: (error) => {
                                                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                                                useShowErrorHandler(error);
                                                                setLoading(false);
                                                            }
                                                        });
                                                    }
                                                },
                                                {text: "Hủy", style: "destructive"}
                                            ]);
                                        }}
                                    >
                                        <Ionicons name="trash-bin" size={sizeDefault.lg} color={DefaultColor.white}/>
                                    </TouchableOpacity>
                                );
                            }}
                            renderLeftActions={() => {
                                if (item.status === _AccountStatus.ACTIVE) {
                                    return null;
                                }
                                return (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: DefaultColor.yellow[400],
                                            borderTopLeftRadius: 8,
                                            borderBottomLeftRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingHorizontal: 24
                                        }}
                                        onPress={() => {
                                            Alert.alert("Chỉnh sửa tài khoản giao dịch", "Ban có chắc muốn chỉnh tài khoản này thành tài khoản giao dịch không ?", [
                                                {
                                                    text: "Đồng ý", onPress: () => {
                                                        setLoading(true);
                                                        mutationEdit.mutate({account_id: item.id}, {
                                                            onSuccess: async () => {
                                                                refetch();
                                                                queryAccountActive.get();
                                                                showMessage({
                                                                    message: "Thay đổi thành công",
                                                                    description: "Cập nhật tài khoản hoạt động thành công",
                                                                    type: 'success',
                                                                    duration: 3000,
                                                                });
                                                                // Đóng swipe khi item bị update status
                                                                swipeRefs.current[item.id]?.close?.();
                                                                setLoading(false);
                                                            },
                                                            onError: (error) => {
                                                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                                                useShowErrorHandler(error);
                                                                setLoading(false);
                                                            }
                                                        });
                                                    }
                                                },
                                                {text: "Hủy", style: "destructive"}
                                            ]);
                                        }}
                                    >
                                        <Ionicons name="checkmark" size={sizeDefault.lg} color={DefaultColor.white}/>
                                    </TouchableOpacity>
                                );
                            }}
                            overshootLeft={false}
                            overshootRight={false}
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
                                        <Text style={{
                                            fontSize: sizeDefault["md"],
                                        }}>
                                            {item.money.toFixed(2)} USD
                                        </Text>
                                    </XStack>
                                    <XStack alignItems={"center"} gap={"$2"}>
                                        {item.status === _AccountStatus.ACTIVE && (
                                            <View style={[
                                                DefaultStyle.badge, {
                                                    paddingVertical: 5,
                                                    backgroundColor: DefaultColor.green[400],
                                                }
                                            ]}>
                                                <Ionicons name="checkmark" size={sizeDefault.sm}
                                                          color={DefaultColor.white}/>
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
                        </Swipeable>

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
            <AccountSheet ref={accountSheetRef} open={openSheet} setOpen={setOpenSheet}>
                <AddAccountView open={openSheet} setOpen={setOpenSheet} onCreateSuccess={() => {
                    refetch();
                }}/>
            </AccountSheet>
        </View>
    )
}

