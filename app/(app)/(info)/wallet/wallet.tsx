import {FontAwesome6} from "@expo/vector-icons";
import {ActivityIndicator, Alert, FlatList, TouchableOpacity, View} from "react-native";
import {Button, H4, Paragraph, Separator, XStack, YStack,} from "tamagui";
import dayjs from "dayjs";
import React, {useState} from "react";
import DefaultColor from "@/components/ui/DefaultColor";
import {useQueryGetUserProfile} from "@/services/auth/hook";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import {router} from "expo-router";
import {_VerifyUserStatus} from "@/services/auth/@type";
import {useInfiniteWalletList} from "@/services/wallet/hook";
import useNestedState from "@/hooks/useNestedState";
import {_WalletTransactionStatus, ListWalletRequest, WalletTransaction} from "@/services/wallet/@types";
import {RefreshControl} from "react-native-gesture-handler";

const getTransactionColor = (status: _WalletTransactionStatus) => {
    if (status === _WalletTransactionStatus.APPROVED_STATUS) return DefaultColor.green[500]; // Green for success
    if (status === _WalletTransactionStatus.REJECTED_STATUS) return DefaultColor.red[500]; // Red for failed
    if (status === _WalletTransactionStatus.PENDING_STATUS) return DefaultColor.yellow[500]; // Orange for pending
    return "gray"; // Default gray
};
const getStatusText = (status:  _WalletTransactionStatus) => {
    switch (status) {
        case _WalletTransactionStatus.APPROVED_STATUS:
            return "Thành công";
        case _WalletTransactionStatus.PENDING_STATUS:
            return "Đang xử lý";
        case _WalletTransactionStatus.REJECTED_STATUS:
            return "Thất bại";
        default:
            return status;
    }
};
const formatAmount = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat("vi-VN").format(amount);
    return `-${formattedAmount} VND`;
};
export default function WalletScreen() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);

    const handleTransactionPress = (item: WalletTransaction) => {
        setSelectedTransaction(item);
        setSheetOpen(true);
    };

    const userProfileQuery = useQueryGetUserProfile();

    const [filter,setFilter] = useNestedState<ListWalletRequest>({
        page: 1
    })

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    }= useInfiniteWalletList(filter)

    const userProfile = userProfileQuery?.data || null;

    const flatData = data?.pages.flatMap((page) => page.data) || [];


    return (
        <YStack gap={16} padding={16} flex={1}>
            {/* Header Section */}
            <XStack alignItems="center" justifyContent="space-between">
                <H4 fontWeight="bold">Ví tiền</H4>
            </XStack>
            {/* Balance Card */}
            <YStack marginTop={16}>
                <Paragraph color={DefaultColor.slate['500']} fontSize={sizeDefault.base} marginBottom={8}>
                    Tổng số dư
                </Paragraph>
                <Paragraph fontSize={sizeDefault.xl} fontWeight="bold" marginBottom={16}>
                    {userProfile?.money ? Number(userProfile.money).toLocaleString('en-US') : 0} VND
                </Paragraph>
                <Button theme="yellow" size="$4" borderRadius={8} onPress={() => {
                    if (userProfile?.status === _VerifyUserStatus.ACTIVE) {
                        router.push("/(app)/(info)/wallet/withdraw");
                    }else {
                        Alert.alert('Tài khoản cần xác thực', 'Bạn cần xác thực tài khoản để rút tiền')
                    }
                }}>
                    <FontAwesome6 name="money-bill-wave" size={16}/>
                    <Paragraph fontSize={14} fontWeight="bold">
                        Rút tiền
                    </Paragraph>
                </Button>
            </YStack>

            <Separator marginVertical={8}/>

            {/* Transaction History */}
            <YStack flex={1}>
                <XStack justifyContent="space-between" alignItems="center" marginBottom={12}>
                    <Paragraph fontWeight="bold" fontSize={18}>
                        Lịch sử giao dịch
                    </Paragraph>
                </XStack>
                <FlatList
                    style={{
                        flex: 1
                    }}
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
                            key={item.id}
                            onPress={() => handleTransactionPress(item)}
                            style={{ marginBottom: 12 }}
                        >
                            <XStack
                                alignItems="center"
                                backgroundColor="white"
                                borderRadius={12}
                                padding={16}
                                borderWidth={1}
                                borderColor={DefaultColor.slate[500]}
                            >
                                {/* Content */}
                                <YStack flex={1} gap={4}>
                                    <XStack justifyContent="space-between" alignItems="center">
                                        <Paragraph fontWeight="700" fontSize={16}>
                                            Rút tiền
                                        </Paragraph>
                                        <Paragraph fontWeight="700" fontSize={16} color={getTransactionColor(item.status)}>
                                            {item.money.toLocaleString('en-US')} VND
                                        </Paragraph>
                                    </XStack>

                                    {item.note &&
                                        <Paragraph
                                            fontSize={14}
                                            color="gray"
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.note}
                                        </Paragraph>
                                    }

                                    <XStack
                                        justifyContent="space-between"
                                        alignItems="center"
                                        marginTop={4}
                                    >
                                        <Paragraph fontSize={12} color="#9CA3AF">
                                            {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                                        </Paragraph>
                                        <XStack alignItems="center" gap={4}>
                                            <View
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: getTransactionColor(item.status),
                                                }}
                                            />
                                            <Paragraph fontSize={12} color={getTransactionColor(item.status)} fontWeight="500">
                                                {getStatusText(item.status)}
                                            </Paragraph>
                                        </XStack>
                                    </XStack>
                                </YStack>
                            </XStack>
                        </TouchableOpacity>
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
        </YStack>
    );
}


// {/* Transaction Detail Bottom Sheet */}
// <Sheet
//     modal
//     open={sheetOpen}
//     onOpenChange={setSheetOpen}
//     snapPoints={[100]}
//     position={0}
//     dismissOnSnapToBottom
// >
//   <Sheet.Overlay
//       animation="lazy"
//       enterStyle={{ opacity: 0 }}
//       exitStyle={{ opacity: 0 }}
//   />
//   <Sheet.Handle />
//   <Sheet.Frame padding={0} backgroundColor="white">
//     <Sheet.ScrollView
//         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
//         showsVerticalScrollIndicator={false}
//     >
//       <YStack gap={20}>
//         {/* Header */}
//         <XStack
//             alignItems="center"
//             justifyContent="space-between"
//             marginTop={30}
//         >
//           <H4 fontWeight="bold">Chi tiết giao dịch</H4>
//           <TouchableOpacity onPress={() => setSheetOpen(false)}>
//             <FontAwesome6 name="circle-xmark" size={20} />
//           </TouchableOpacity>
//         </XStack>
//
//         {selectedTransaction && (
//             <>
//               {/* Status Badge */}
//               <XStack alignItems="center" justifyContent="center">
//                 <YStack
//                     alignItems="center"
//                     backgroundColor={`${getTransactionColor(
//                         selectedTransaction.status
//                     )}20`}
//                     padding={16}
//                     borderRadius={12}
//                     borderWidth={2}
//                     borderColor={getTransactionColor(
//                         selectedTransaction.status
//                     )}
//                 >
//                   <View
//                       style={{
//                         width: 60,
//                         height: 60,
//                         borderRadius: 30,
//                         backgroundColor: getTransactionColor(
//                             selectedTransaction.status
//                         ),
//                         alignItems: "center",
//                         justifyContent: "center",
//                         marginBottom: 8,
//                       }}
//                   >
//                     <FontAwesome6 name="arrow-up" size={24} color="white" />
//                   </View>
//                   <Paragraph
//                       fontWeight="bold"
//                       fontSize={18}
//                       color={getTransactionColor(selectedTransaction.status)}
//                   >
//                     {formatAmount(selectedTransaction.amount)}
//                   </Paragraph>
//                   <Paragraph
//                       fontSize={14}
//                       color={getTransactionColor(selectedTransaction.status)}
//                       fontWeight="500"
//                   >
//                     {getStatusText(selectedTransaction.status)}
//                   </Paragraph>
//                 </YStack>
//               </XStack>
//
//               {/* Transaction Details */}
//               <YStack gap={16}>
//                 <YStack gap={8}>
//                   <Paragraph color="gray" fontSize={12} fontWeight="500">
//                     MÃ GIAO DỊCH
//                   </Paragraph>
//                   <Paragraph fontSize={16} fontWeight="600">
//                     {selectedTransaction.transactionCode}
//                   </Paragraph>
//                 </YStack>
//
//                 <YStack gap={8}>
//                   <Paragraph color="gray" fontSize={12} fontWeight="500">
//                     THỜI GIAN
//                   </Paragraph>
//                   <Paragraph fontSize={16} fontWeight="600">
//                     {dayjs(selectedTransaction.createdAt).format(
//                         "DD/MM/YYYY HH:mm:ss"
//                     )}
//                   </Paragraph>
//                 </YStack>
//
//                 <YStack gap={8}>
//                   <Paragraph color="gray" fontSize={12} fontWeight="500">
//                     NGÂN HÀNG
//                   </Paragraph>
//                   <Paragraph fontSize={16} fontWeight="600">
//                     {selectedTransaction.bankName}
//                   </Paragraph>
//                 </YStack>
//
//                 <YStack gap={8}>
//                   <Paragraph color="gray" fontSize={12} fontWeight="500">
//                     SỐ TÀI KHOẢN
//                   </Paragraph>
//                   <Paragraph fontSize={16} fontWeight="600">
//                     {selectedTransaction.accountNumber}
//                   </Paragraph>
//                 </YStack>
//
//                 <YStack gap={8}>
//                   <Paragraph color="gray" fontSize={12} fontWeight="500">
//                     TÊN TÀI KHOẢN
//                   </Paragraph>
//                   <Paragraph fontSize={16} fontWeight="600">
//                     {selectedTransaction.accountName}
//                   </Paragraph>
//                 </YStack>
//
//                 <Separator />
//
//                 <XStack justifyContent="space-between" alignItems="center">
//                   <Paragraph color="gray" fontSize={14}>
//                     Số tiền rút
//                   </Paragraph>
//                   <Paragraph fontSize={16} fontWeight="600">
//                     {new Intl.NumberFormat("vi-VN").format(
//                         selectedTransaction.amount
//                     )}{" "}
//                     VND
//                   </Paragraph>
//                 </XStack>
//
//                 <XStack justifyContent="space-between" alignItems="center">
//                   <Paragraph color="gray" fontSize={14}>
//                     Phí giao dịch
//                   </Paragraph>
//                   <Paragraph
//                       fontSize={16}
//                       fontWeight="600"
//                       color={DefaultColor.red[500]}
//                   >
//                     {selectedTransaction.fee
//                         ? `${new Intl.NumberFormat("vi-VN").format(
//                             selectedTransaction.fee
//                         )} VND`
//                         : "Miễn phí"}
//                   </Paragraph>
//                 </XStack>
//
//                 <Separator />
//
//                 <XStack
//                     justifyContent="space-between"
//                     alignItems="center"
//                     marginBottom={30}
//                 >
//                   <Paragraph fontSize={16} fontWeight="bold">
//                     Tổng tiền thực nhận
//                   </Paragraph>
//                   <Paragraph
//                       fontSize={18}
//                       fontWeight="bold"
//                       color={getTransactionColor(selectedTransaction.status)}
//                   >
//                     {new Intl.NumberFormat("vi-VN").format(
//                         selectedTransaction.amount -
//                         (selectedTransaction.fee || 0)
//                     )}{" "}
//                     VND
//                   </Paragraph>
//                 </XStack>
//
//                 {selectedTransaction.status === "failed" &&
//                     selectedTransaction.failReason && (
//                         <YStack
//                             gap={8}
//                             backgroundColor="#FEF2F2"
//                             padding={12}
//                             borderRadius={8}
//                             borderWidth={1}
//                             borderColor="#FECACA"
//                             marginBottom={20}
//                         >
//                           <Paragraph
//                               color="#EF4444"
//                               fontSize={12}
//                               fontWeight="500"
//                           >
//                             LÝ DO THẤT BẠI
//                           </Paragraph>
//                           <Paragraph fontSize={14} color="#DC2626">
//                             {selectedTransaction.failReason}
//                           </Paragraph>
//                         </YStack>
//                     )}
//               </YStack>
//             </>
//         )}
//       </YStack>
//     </Sheet.ScrollView>
//   </Sheet.Frame>
// </Sheet>