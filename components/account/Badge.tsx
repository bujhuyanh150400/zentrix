import {useGetAccountActive} from "@/services/account/hook";
import {View, StyleSheet, Text, TouchableOpacity, Alert} from "react-native";
import SkeletonFade from "@/components/SkeletonFade";
import DefaultColor from "@/components/ui/DefaultColor";
import {Paragraph, Separator, Sheet, XStack, YStack} from "tamagui";
import DefaultStyle, {sizeDefault} from "@/components/ui/DefaultStyle";
import {_AccountType} from "@/services/account/@types";
import {Entypo, Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import {useState} from "react";
import {useQueryGetUserProfile} from "@/services/auth/hook";
import {router} from "expo-router";
import {_VerifyUserStatus} from "@/services/auth/@type";


const BadgeAccount = () => {
    const [open,setOpen] = useState<boolean>(false);
    const queryAccountActive = useGetAccountActive();
    const account = queryAccountActive.account;
    const userProfileQuery = useQueryGetUserProfile();
    const userProfile = userProfileQuery?.data || null;


    return (
        <>
            <View style={styles.container}>
                {queryAccountActive.loading ? (
                    <SkeletonFade/>
                ) : (
                    <>
                        {account ?
                            (
                                <XStack gap={"$2"} alignItems={"center"}>
                                    <View style={[
                                        DefaultStyle.badge, {
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
                                    <Text style={styles.money}>
                                        {account.money.toFixed(2)} USD
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        setOpen(true);
                                    }}>
                                        <Feather name="more-vertical" size={sizeDefault.md}
                                                 color={DefaultColor.slate["600"]}/>
                                    </TouchableOpacity>
                                </XStack>
                            )
                            : <Text style={styles.no_account_text}>Không có tài khoản giao dịch</Text>}
                    </>
                )}
            </View>
            <Sheet
                forceRemoveScrollEnabled={true}
                modal={true}
                open={open}
                onOpenChange={setOpen}
                snapPointsMode={"fit"}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="medium"
            >
                <Sheet.Overlay
                    animation="lazy"
                    backgroundColor="$shadow6"
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                />

                <Sheet.Handle/>
                <Sheet.Frame padding="$4" gap="$2">
                    <YStack gap={"$2"} paddingVertical={"$2"}>
                        <TouchableOpacity
                            onPress={() => {
                                setOpen(false);
                                router.push('/(app)/(account)/recharge')
                            }}
                        >
                            <XStack alignItems={"center"} gap={"$2"}>
                                <Feather name="arrow-down-circle" size={sizeDefault.xl} color="black"/>
                                <Paragraph fontWeight={700}>Nạp tiền</Paragraph>
                            </XStack>
                        </TouchableOpacity>
                        <Separator marginVertical={10} />
                        {account && account.type === _AccountType.REAL_ACCOUNT &&
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        setOpen(false);
                                        if ((account?.type === _AccountType.TEST_ACCOUNT)
                                            || (account?.type === _AccountType.REAL_ACCOUNT && userProfile?.status === _VerifyUserStatus.ACTIVE)
                                        ) {
                                            router.push('/(app)/(account)/recharge')
                                        }else {
                                            Alert.alert('Tài khoản cần xác thực', 'Bạn cần xác thực tài khoản để rút tiền')
                                        }
                                    }}
                                >
                                    <XStack alignItems={"center"} gap={"$2"}>
                                        <Feather name="arrow-down-circle" size={sizeDefault.xl} color="black" style={{transform : [{rotate: '240deg'}]}} />
                                        <Paragraph fontWeight={700}>Rút tiền</Paragraph>
                                    </XStack>
                                </TouchableOpacity>
                                <Separator marginVertical={10} />
                            </>
                        }
                        <TouchableOpacity
                            onPress={() => {
                                setOpen(false);
                                router.push('/(app)/(account)/detail')
                            }}
                        >
                            <XStack alignItems={"center"} gap={"$2"}>
                                <Entypo name="dots-three-vertical" size={sizeDefault.xl} color="black" />
                                <Paragraph fontWeight={700}>Chi tiết</Paragraph>
                            </XStack>
                        </TouchableOpacity>
                        <Separator marginVertical={10} />
                        <TouchableOpacity
                            onPress={() => {
                                setOpen(false);
                                router.push('/(app)/(account)/history');
                            }}
                        >
                            <XStack alignItems={"center"} gap={"$2"}>
                                <MaterialCommunityIcons name="transfer" size={sizeDefault.xl} color="black" />
                                <Paragraph fontWeight={700}>Lịch sử</Paragraph>
                            </XStack>
                        </TouchableOpacity>
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: DefaultColor.slate["400"],
        borderRadius: 15,
    },
    no_account_text: {
        fontWeight: 700,
        color: DefaultColor.slate["400"],
    },
    money: {
        fontWeight: 700,
        color: DefaultColor.slate["600"],
    }
})

export default BadgeAccount;