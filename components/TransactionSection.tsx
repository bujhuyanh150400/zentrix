import { Account } from "@/services/account/@types";
import { FC } from "react";
import {useTransactionTotal} from "@/services/transaction/hook";
import {TouchableOpacity, StyleSheet} from "react-native";
import {router} from "expo-router";
import {Paragraph, View, XStack} from "tamagui";
import DefaultStyle, {sizeDefault} from "@/components/ui/DefaultStyle";
import DefaultColor from "@/components/ui/DefaultColor";

type Props = {
    account: Account | null,
}

const TransactionSection: FC<Props> = (props) => {

    const {total} = useTransactionTotal(props.account?.id || null);
    return (
        <>
            <TouchableOpacity
                style={styles.open_close_container}
                onPress={() => {
                    router.push("/(app)/(trade)/transaction")
                }}
            >
                <XStack alignItems={"center"} gap={"$2"}>
                    <Paragraph fontSize={sizeDefault.sm} fontWeight={(total?.open ?? 0) > 0 ? 700 : "normal"}>Mở</Paragraph>
                    <View style={[
                        DefaultStyle.badgeCircle,
                        {backgroundColor: (total?.open ?? 0) > 0 ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                    ]}>
                        <Paragraph>{total?.open ?? 0}</Paragraph>
                    </View>
                </XStack>
                <XStack alignItems={"center"} gap={"$2"}>
                    <Paragraph fontSize={sizeDefault.sm} fontWeight={(total?.waiting ?? 0) > 0 ? 700 : "normal"}>Chờ giao dịch</Paragraph>
                    <View style={[
                        DefaultStyle.badgeCircle,
                        {backgroundColor: (total?.waiting ?? 0) > 0 ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                    ]}>
                        <Paragraph>{total?.waiting ?? 0}</Paragraph>
                    </View>
                </XStack>
            </TouchableOpacity>
        </>
    )
}

export default TransactionSection;

const styles = StyleSheet.create({
    open_close_container: {
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        gap: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: DefaultColor.slate[100],
    },
})
