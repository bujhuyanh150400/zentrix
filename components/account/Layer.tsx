import {FC, useState} from "react";
import {useGetAccountActive} from "@/services/account/hook";
import {Button, Card, H4, H6, Paragraph, View, XStack, YStack} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import {_AccountType, Account} from "@/services/account/@types";
import {TouchableOpacity} from "@gorhom/bottom-sheet";
import {FontAwesome6, Ionicons} from "@expo/vector-icons";
import DefaultStyle, {sizeDefault} from "@/components/ui/DefaultStyle";
import {StyleSheet, Text} from "react-native";
import SkeletonFade from "@/components/SkeletonFade";
import AddSheet from "@/components/account/AddSheet";



type Props = {
    account: Account | null,
    loading: boolean
}

export const AccountCard: FC<Props> = ({account, loading}) => {
    const [openAdd, setOpenAdd] = useState<boolean>(false);


    return (
        <>
            <Card size="$4" padded bordered backgroundColor={DefaultColor.white} marginBottom={15}>
                {loading ? (
                    <LoadingAccountCard/>
                ) : (
                    <>
                        {account ? (
                                <>

                                </>
                            )
                            : (
                                <YStack gap={"$8"}>
                                    <YStack gap={"$1"}>
                                        <Text style={styles.title_none_account}>Không có tài khoản nào đang hoạt động</Text>
                                        <Paragraph>Tạo mới tài khoản giao dịch mới hoặc hủy lưu trữ một tài khoản giao dịch</Paragraph>
                                    </YStack>
                                    <XStack alignItems={"center"} justifyContent={"center"} gap={"$4"}>
                                        <YStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                                            <TouchableOpacity
                                                style={[
                                                    DefaultStyle.circleButton,
                                                    {backgroundColor: DefaultColor.slate["200"]}
                                                ]}
                                                onPress={() => setOpenAdd(true)}
                                            >
                                                <FontAwesome6 name="add" size={sizeDefault.md} color="black"/>
                                            </TouchableOpacity>
                                            <Paragraph>Mở</Paragraph>
                                        </YStack>
                                        <YStack alignItems={"center"} justifyContent={"center"} gap={"$2"}>
                                            <TouchableOpacity style={[
                                                DefaultStyle.circleButton,
                                                {backgroundColor: DefaultColor.slate["200"]}
                                            ]}>
                                                <Ionicons name="archive-outline" size={sizeDefault.md} color="black" />
                                            </TouchableOpacity>
                                            <Paragraph>Khôi phục</Paragraph>
                                        </YStack>
                                    </XStack>
                                </YStack>
                            )}
                    </>
                )}
            </Card>
            <AddSheet open={openAdd} setOpen={setOpenAdd} />
        </>
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
    }
})