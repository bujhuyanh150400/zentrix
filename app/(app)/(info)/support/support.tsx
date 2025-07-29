import {useQueryGetUserProfile} from "@/services/auth/hook";
import useNestedState, {NestedPartial} from "@/hooks/useNestedState";
import {_SupportTicketStatus, _SupportTicketType, ListTicketRequest, PRIORITY_CONFIG} from "@/services/ticket/@types";
import {useInfiniteTicketList} from "@/services/ticket/hook";
import useDebounce from "@/hooks/useDebounce";
import {ScrollView} from "react-native-gesture-handler";
import {Card, H3, H5, Paragraph, YStack, H6, Separator, Input, XStack, YGroup, Popover, Button} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import {APP_NAME, SUPPORT_PHONE_NUMBER} from "@/libs/constant_env";
import {FontAwesome5, FontAwesome6, AntDesign } from "@expo/vector-icons";
import PopoverCustom from "@/components/PopoverCustom";
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import DefaultStyle from "@/components/ui/DefaultStyle";


export default function SupportScreen() {

    const userProfileQuery = useQueryGetUserProfile();

    const userProfile = userProfileQuery?.data || null;

    const [filter, setFilter] = useNestedState<ListTicketRequest>({
        per_page: 5,
        page: 1,
    });
    const {
        data,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching,
    } = useInfiniteTicketList(filter);
    const flatData = data?.pages.flatMap((page) => page.data) || [];

    const setFilterFetch = (newState: NestedPartial<ListTicketRequest>) => {
        setFilter(newState);
        refetch();
    }

    const searchFilterDebounce = useDebounce((value: string) => {
        setFilter({keyword: value});
        refetch();
    }, 1000, [setFilter, refetch]);

    return (
        <ScrollView
            contentContainerStyle={{padding: 16, paddingTop: 32,}}
            showsVerticalScrollIndicator={false}
        >
            <H3 fontWeight={700} marginBottom="$4">Trung tâm hỗ trợ khách hàng</H3>

            <Card padding={"$5"} elevate bordered backgroundColor={DefaultColor.slate[100]} marginBottom="$10">
                <H5 fontWeight={700} marginBottom="$4">Xin chào {userProfile?.name.toUpperCase() ?? "Customer"} chúng
                    tôi có thể giúp gì cho bạn?</H5>

                <Paragraph lineHeight={24}>
                    {APP_NAME} - Giải pháp tổng hợp cho mọi nhu cầu của bạn. Tìm câu trả lời, khắc phục sự cố và luôn
                    làm hài lòng quý khách.
                </Paragraph>
            </Card>

            <H3 fontWeight={700} marginBottom="$4">Các yêu cầu của tôi</H3>

            <Card padding={"$5"} elevate bordered backgroundColor={DefaultColor.white} marginBottom="$10">
                <H6 fontWeight={700} marginBottom="$4">Bạn cần hỗ trợ ?</H6>
                <Paragraph lineHeight={24} marginBottom={"$4"}>
                    Vui lòng điền thông tin vào biểu mẫu. Chúng tôi sẽ hỗ trợ phản hồi trong vòng 24h.
                </Paragraph>
                <XStack
                    alignItems="center"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius={8}
                    paddingVertical="$3"
                    paddingHorizontal="$3"
                    backgroundColor="white"
                    gap="$2"
                    marginBottom={"$4"}
                >
                    <FontAwesome5 name="search" size={14} color="black"/>
                    <Input
                        flex={1}
                        unstyled
                        onChangeText={(text) => searchFilterDebounce(text)}
                        placeholder={"Tìm kiếm..."}
                    />
                </XStack>

                <PopoverCustom
                    shouldAdapt={false}
                    height={135}
                    width={200}
                    Trigger={
                        <TouchableOpacity
                            style={{
                                paddingVertical: 4,
                                paddingHorizontal: 12,
                                borderRadius: 20,
                                backgroundColor: DefaultColor.slate[100],
                                alignSelf: 'flex-start',
                                alignItems: "center",
                                flexDirection: "row",
                                gap: 4,
                                flex: 1,
                            }}
                        >
                            <XStack gap={"$2"} alignItems={"center"}>
                                <Paragraph fontSize={14} >
                                    Trạng thái đang hoạt động:
                                </Paragraph>
                                <Paragraph fontSize={14}>
                                    {filter?.status === _SupportTicketStatus.OPEN && "Mở"}
                                    {filter?.status === _SupportTicketStatus.CLOSED && "Đóng"}
                                    {!filter?.status && "Tất cả"}
                                </Paragraph>
                                <FontAwesome6 name="chevron-down" size={12} color="black" />
                            </XStack>
                        </TouchableOpacity>
                    }
                >
                    <YGroup separator={<Separator/>} style={{flex: 1, width: "100%"}}>
                        <YGroup.Item>
                            <Popover.Close asChild>
                                <TouchableOpacity
                                    disabled={isRefetching || isLoading}
                                    onPress={() => {
                                        setFilterFetch({status: ''});
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: 10,
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <Paragraph fontSize={14} color="#616161" fontWeight={500}>Tất cả</Paragraph>
                                </TouchableOpacity>
                            </Popover.Close>
                            <Popover.Close asChild>
                                <TouchableOpacity
                                    disabled={isRefetching || isLoading}
                                    onPress={() => {
                                        filter.status !== _SupportTicketStatus.OPEN && setFilterFetch({status: _SupportTicketStatus.OPEN});
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: 10,
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <Paragraph fontSize={14} color="#616161" fontWeight={500}>Mở</Paragraph>
                                </TouchableOpacity>
                            </Popover.Close>
                            <Popover.Close asChild>
                                <TouchableOpacity
                                    disabled={isRefetching || isLoading}
                                    onPress={() => {
                                        filter.status !== _SupportTicketStatus.CLOSED && setFilterFetch({status: _SupportTicketStatus.CLOSED});
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: 10,
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <Paragraph fontSize={14} color="#616161" fontWeight={500}>Đóng</Paragraph>
                                </TouchableOpacity>
                            </Popover.Close>
                        </YGroup.Item>

                    </YGroup>
                </PopoverCustom>

                <YStack flex={1} gap={"$2"} marginVertical={"$4"} paddingHorizontal={"$2"}>
                    {flatData && flatData.length === 0 && (
                        <YStack flex={1} gap={"$4"} marginVertical={"$4"} alignItems="center" justifyContent="center">
                            <AntDesign name="exclamationcircleo" size={50} color={DefaultColor.gray[400]} />
                            <H6 fontWeight={700} marginBottom="$4" textAlign="center">Bạn đang không có bất kỳ yêu cầu nào</H6>
                            <Button theme="yellow" backgroundColor={DefaultColor.yellow[300]}
                                    onPress={() => {
                                        router.push('/(app)/(info)/support/create/stepOne')
                                    }}>
                                <AntDesign name="plus" size={14} color="black" />
                                Mở yêu cầu
                            </Button>
                        </YStack>
                    )}
                    {isFetchingNextPage && (
                        <ActivityIndicator style={{ marginVertical: 12 }} />
                    )}
                    {!isLoading && flatData && flatData.length > 0 && flatData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "#eee",
                                paddingVertical: 8,
                            }}
                            onPress={() => {
                                router.push({
                                    pathname: '/(app)/(info)/support/reply',
                                    params: {
                                        ticket_id: item.id
                                    }
                                })
                            }}
                        >
                            <XStack justifyContent="space-between" alignItems="center">
                                <XStack alignItems="center" gap="$2">
                                    <YStack gap="$2">
                                        <Paragraph fontWeight={500} numberOfLines={1} ellipsizeMode="tail">{item.message}</Paragraph>
                                        <XStack alignItems="center" gap="$2">
                                            <View
                                                style={[DefaultStyle.badge, {
                                                    backgroundColor: item.status === _SupportTicketStatus.OPEN ? DefaultColor.green[200] : DefaultColor.slate[200],
                                                }]}
                                            >
                                                <Paragraph fontSize={12}>
                                                    {item.status === _SupportTicketStatus.OPEN && "Open"}
                                                    {item.status === _SupportTicketStatus.CLOSED && "Close"}
                                                </Paragraph>
                                            </View>
                                            <View
                                                style={[
                                                    DefaultStyle.badge,
                                                    {backgroundColor: PRIORITY_CONFIG[item.priority]?.color || DefaultColor.slate[200],},
                                                ]}
                                            >
                                                <Paragraph fontSize={12}>
                                                    {PRIORITY_CONFIG[item.priority]?.text || 'Không rõ'}
                                                </Paragraph>
                                            </View>
                                            <View
                                                style={[DefaultStyle.badge, {
                                                    backgroundColor: DefaultColor.slate[200],
                                                }]}
                                            >
                                                <Paragraph fontSize={12}>
                                                    {item.type === _SupportTicketType.TECHNICAL && "Kĩ thuật"}
                                                    {item.type === _SupportTicketType.TRANSACTION && "Giao dịch"}
                                                    {item.type === _SupportTicketType.PAYMENT && "Thanh toán"}
                                                </Paragraph>
                                            </View>
                                        </XStack>
                                    </YStack>
                                </XStack>
                                <FontAwesome6 name="message" size={18} color={DefaultColor.slate[600]} />
                            </XStack>
                        </TouchableOpacity>
                    ))}
                </YStack>
            </Card>

            <H3 fontWeight={700} marginBottom="$4">Liên hệ</H3>

            <Card padding={"$5"} elevate bordered backgroundColor={DefaultColor.white} marginBottom="$4">
                <H6 fontWeight={700} marginBottom="$4">Điện thoại</H6>
                <Paragraph color={DefaultColor.slate[500]}>Bạn muốn trao đổi với Đội ngũ hỗ trợ của chúng tôi? Hãy gọi đến số {SUPPORT_PHONE_NUMBER}</Paragraph>
                <Separator marginVertical="$6" />
                <H6 fontWeight={700} marginBottom="$4">Giờ làm việc</H6>
                <Paragraph color={DefaultColor.slate[500]}>Thời gian hỗ trợ: <Paragraph color={DefaultColor.green[500]} fontWeight={500}>Online 24/7</Paragraph></Paragraph>
            </Card>

        </ScrollView>
    )
}