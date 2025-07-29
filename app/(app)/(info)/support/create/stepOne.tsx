import {formSupportStore} from "@/services/ticket/store";
import {_SupportTicketType} from "@/services/ticket/@types";
import {router} from "expo-router";
import { YStack, H3, Paragraph, Card, H4 } from "tamagui";
import { ScrollView } from "react-native-gesture-handler";
import DefaultColor from "@/components/ui/DefaultColor";
import {
    MaterialIcons,
    MaterialCommunityIcons,
    AntDesign,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function StepOneScreen() {
    const setStepOne = formSupportStore(s => s.setStepOne);

    const nextStep = (type: _SupportTicketType) => {
        setStepOne({ type });
        router.push("/(app)/(info)/support/create/stepTwo");
    };
    return (
        <ScrollView
            contentContainerStyle={{ padding: 16, paddingTop: 32 }}
            showsVerticalScrollIndicator={false}
        >
            <YStack gap="$4" marginBottom="$4">
                <H3 fontWeight={700}>Mở yêu cầu</H3>
                <Paragraph>
                    Vui lòng chọn chủ đề cho câu hỏi của bạn để chúng tôi có thể hỗ trợ tốt nhất.
                </Paragraph>
            </YStack>
            <YStack gap="$4">
                <TouchableOpacity onPress={() => nextStep(_SupportTicketType.PAYMENT)}>
                    <Card
                        paddingHorizontal={32}
                        paddingVertical={24}
                        gap={"$4"}
                        bordered
                        elevation={"$1"}
                        backgroundColor={DefaultColor.white}
                    >
                        <MaterialCommunityIcons
                            name="hand-coin-outline"
                            size={40}
                            color="black"
                        />
                        <H4 fontWeight={700}>Thanh toán</H4>
                        <Paragraph>
                            Vấn đề liên quan đến thanh toán, nạp tiền, rút tiền hoặc các giao dịch tài chính khác.
                        </Paragraph>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => nextStep(_SupportTicketType.TRANSACTION)}
                >
                    <Card
                        paddingHorizontal={32}
                        paddingVertical={24}
                        gap={"$4"}
                        bordered
                        elevation={"$1"}
                        backgroundColor={DefaultColor.white}
                    >
                        <MaterialIcons name="candlestick-chart" size={40} color="black" />
                        <H4 fontWeight={700}>Giao dịch</H4>
                        <Paragraph>
                            Vấn đề liên quan đến giao dịch, đặt lệnh, hoặc các vấn đề kỹ thuật khác trong quá trình giao dịch.
                        </Paragraph>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => nextStep(_SupportTicketType.TECHNICAL)}
                >
                    <Card
                        paddingHorizontal={32}
                        paddingVertical={24}
                        gap={"$4"}
                        bordered
                        elevation={"$1"}
                        backgroundColor={DefaultColor.white}
                    >
                        <AntDesign name="setting" size={40} color="black" />
                        <H4 fontWeight={700}>Kỹ thuật</H4>
                        <Paragraph>
                            Sự cố kỹ thuật, lỗi hệ thống, hoặc các vấn đề liên quan đến nền tảng giao dịch.
                        </Paragraph>
                    </Card>
                </TouchableOpacity>
            </YStack>
        </ScrollView>
    );
}