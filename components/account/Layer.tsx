import {FC, useRef, useState} from "react";
import {Card, Paragraph, View, XStack, YStack} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import {_AccountType, Account} from "@/services/account/@types";
import BottomSheet, {TouchableOpacity} from "@gorhom/bottom-sheet";
import {Entypo, Feather, FontAwesome6, MaterialCommunityIcons} from "@expo/vector-icons";
import DefaultStyle, {sizeDefault} from "@/components/ui/DefaultStyle";
import {Alert, StyleSheet, Text} from "react-native";
import SkeletonFade from "@/components/SkeletonFade";
import AddAccountView from "@/components/account/AddAccountView";
import AccountSheet from "@/components/account/Sheet";
import {router} from "expo-router";
import {useQueryGetUserProfile} from "@/services/auth/hook";
import {_VerifyUserStatus, UserLogin} from "@/services/auth/@type";

type Props = {
    account: Account | null,
    loading: boolean
}

export const AccountCard: FC<Props> = ({account, loading}) => {
    const [openSheet, setOpenSheet] = useState<boolean>(false);
    console.log(account)
    const userProfileQuery = useQueryGetUserProfile();

    const userProfile = userProfileQuery?.data || null;

    const accountSheetRef = useRef<BottomSheet>(null);

    return (
        <>
            <Card size="$4" padded bordered backgroundColor={DefaultColor.white} marginBottom={15}>
                {loading ? (
                    <LoadingAccountCard/>
                ) : (
                    <>
                        {account ? (
                                <YStack gap={"$6"}>
                                    <YStack gap={"$2"}>
                                        <XStack justifyContent={"space-between"} alignItems={"center"} gap={"$2"}>
                                            <XStack gap={"$2"}>
                                                <Text style={styles.name}>{account.name}</Text>
                                                <Text style={styles.code}>{account.code}</Text>
                                            </XStack>
                                            <TouchableOpacity
                                                style={[DefaultStyle.circleButtonSmall, {backgroundColor: DefaultColor.slate["200"],}]}
                                                onPress={() => {
                                                    router.push('/(app)/(account)/list')
                                                }}
                                            >
                                                <Entypo name="list" size={sizeDefault.base} color="black"/>
                                            </TouchableOpacity>
                                        </XStack>
                                        <XStack gap={"$2"}>
                                            <View style={[
                                                DefaultStyle.badge, {
                                                    paddingVertical: 5,
                                                    backgroundColor: account.type === _AccountType.REAL_ACCOUNT ? DefaultColor.slate[300] : DefaultColor.yellow[200]
                                                }
                                            ]}>
                                                <Text style={{
                                                    color: account.type === _AccountType.REAL_ACCOUNT ? DefaultColor.slate[700] : DefaultColor.yellow["700"]
                                                }}>
                                                    {account.type === _AccountType.TEST_ACCOUNT && "Credit"}
                                                    {account.type === _AccountType.REAL_ACCOUNT && "Thực"}
                                                </Text>
                                            </View>
                                            <View style={[
                                                DefaultStyle.badge, {
                                                    paddingVertical: 5,
                                                    backgroundColor: account.account_type.color ? account.account_type.color : DefaultColor.slate[300]
                                                }
                                            ]}>
                                                <Text>
                                                    {account.account_type.description}
                                                </Text>
                                            </View>
                                        </XStack>
                                        <Text style={styles.money}>
                                            {account.money.toLocaleString('en-US')} USD
                                        </Text>
                                    </YStack>
                                    <StackButtonAccountReal account={account} userProfile={userProfile} showDetail={true}/>
                                </YStack>
                            )
                            : (
                                <YStack gap={"$8"}>
                                    <YStack gap={"$1"}>
                                        <Text style={styles.title_none_account}>Không có tài khoản nào đang hoạt
                                            động</Text>
                                        <Paragraph>Tạo mới tài khoản giao dịch mới hoặc hủy lưu trữ một tài khoản giao
                                            dịch</Paragraph>
                                    </YStack>
                                    <XStack alignItems={"center"} justifyContent={"center"} gap={"$4"}>
                                        <YStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                                            <TouchableOpacity
                                                style={[
                                                    DefaultStyle.circleButton,
                                                    {backgroundColor: DefaultColor.slate["200"]}
                                                ]}
                                                onPress={() => {
                                                    setOpenSheet(true);
                                                }}
                                            >
                                                <FontAwesome6 name="add" size={sizeDefault.md} color="black"/>
                                            </TouchableOpacity>
                                            <Paragraph>Mở</Paragraph>
                                        </YStack>
                                    </XStack>
                                </YStack>
                            )}
                    </>
                )}
            </Card>
            <AccountSheet ref={accountSheetRef} open={openSheet} setOpen={(open) => {
                setOpenSheet(open)
            }}>
                <AddAccountView open={openSheet} setOpen={setOpenSheet}/>
            </AccountSheet>
        </>
    )
}

export type StackButtonAccountRealPropsType = {
    account: Account | null,
    userProfile: UserLogin | null
    showDetail: boolean
}
export const StackButtonAccountReal: FC<StackButtonAccountRealPropsType> = ({account,userProfile, showDetail  }) => {
    if (!account || !userProfile){
        return null;
    }
    return (
        <XStack alignItems={"center"} justifyContent={"center"} gap={"$4"}>
            <YStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                <TouchableOpacity
                    style={[
                        DefaultStyle.circleButton,
                        {backgroundColor: DefaultColor.yellow["200"]}
                    ]}
                    onPress={() => {
                        router.push('/(app)/(account)/recharge')
                    }}
                >
                    <Feather name="arrow-down-circle" size={sizeDefault.xl} color="black" />
                </TouchableOpacity>
                <Paragraph>Nạp tiền</Paragraph>
            </YStack>
            {account.type === _AccountType.REAL_ACCOUNT &&
                <YStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                    <TouchableOpacity
                        style={[
                            DefaultStyle.circleButton,
                            {backgroundColor: DefaultColor.slate["200"]}
                        ]}
                        onPress={() => {
                            if ((account?.type === _AccountType.TEST_ACCOUNT)
                                || (account?.type === _AccountType.REAL_ACCOUNT && userProfile?.status === _VerifyUserStatus.ACTIVE)
                            ) {
                                router.push('/(app)/(account)/withdraw')
                            }else {
                                Alert.alert('Tài khoản cần xác thực', 'Bạn cần xác thực tài khoản để rút tiền')
                            }
                        }}
                    >
                        <Feather name="arrow-down-circle" size={sizeDefault.xl} color="black" style={{transform : [{rotate: '240deg'}]}} />
                    </TouchableOpacity>
                    <Paragraph>Rút tiền</Paragraph>
                </YStack>
            }
            {showDetail &&
                <YStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                    <TouchableOpacity
                        style={[
                            DefaultStyle.circleButton,
                            {backgroundColor: DefaultColor.slate["200"]}
                        ]}
                        onPress={() => {
                            router.push('/(app)/(account)/detail')
                        }}
                    >
                        <Entypo name="dots-three-vertical" size={sizeDefault.md} color="black" />
                    </TouchableOpacity>
                    <Paragraph>Chi tiết</Paragraph>
                </YStack>
            }
            <YStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                <TouchableOpacity
                    style={[
                        DefaultStyle.circleButton,
                        {backgroundColor: DefaultColor.slate["200"]}
                    ]}
                    onPress={() => {
                        router.push('/(app)/(account)/history')
                    }}
                >
                    <MaterialCommunityIcons name="transfer" size={sizeDefault.xl} color="black" />
                </TouchableOpacity>
                <Paragraph>Lịch sử</Paragraph>
            </YStack>
        </XStack>
    )
}

const LoadingAccountCard = () => (
    <YStack gap={"$10"}>
        <YStack gap={"$2"}>
            <SkeletonFade width={"100%"} height={40}/>
            <SkeletonFade width={"100%"}/>
        </YStack>
        <XStack gap={"$2"} alignItems={"center"} justifyContent={"center"}>
            <SkeletonFade width={48} height={48}/>
            <SkeletonFade width={48} height={48}/>
        </XStack>
    </YStack>
)

const styles = StyleSheet.create({
    title_none_account: {
        fontSize: sizeDefault["2xl"],
        lineHeight: sizeDefault['4xl'],
        fontWeight: 700,
        marginBottom: 12
    },
    name: {
        fontSize: sizeDefault["md"],
        maxWidth: 100,
    },
    code: {
        fontSize: sizeDefault["md"],
        color: DefaultColor.slate[400]
    },
    money:{
        marginTop: 20,
        fontSize: sizeDefault['2xl'],
        fontWeight: 700,
        lineHeight: sizeDefault['4xl'],
    }
})