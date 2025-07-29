import React, {useState} from "react";
import {useQueryGetUserProfile} from "@/services/auth/hook";
import {useAuthStore} from "@/services/auth/store";
import {
    Alert,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";
import InfoAppCanvas from "@/components/InfoAppCanvas";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {Button, Paragraph, Separator, Spinner, XStack, YStack} from "tamagui";
import { router } from "expo-router";
import {AntDesign, FontAwesome6, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import { _VerifyUserStatus } from "@/services/auth/@type";
import {maintainWarning} from "@/hooks/reuseFunc";
import {APP_NAME} from "@/libs/constant_env";


export default function InfoScreen() {

    const [appInfo, setAppInfo] = useState<boolean>(false);

    const userProfileQuery = useQueryGetUserProfile();

    const userProfile = userProfileQuery?.data || null;

    const logout = useAuthStore((state) => state.logout);


    return (
        <>
            <LayoutScrollApp title="Hồ sơ">
                <YStack gap={4} marginTop={24} paddingBottom={100}>
                    <Paragraph fontWeight={700} fontSize={20} marginBottom={16}>
                        Tài khoản
                    </Paragraph>
                    <TouchableOpacity
                        onPress={() => router.push("/(app)/(info)/userInfo")}
                    >
                        <XStack alignItems="center" justifyContent="space-between" gap="$4">
                            <XStack alignItems="center" gap="$4">
                                <View style={style.box_icon}>
                                    <FontAwesome6 name="user" size={18} color="black" />
                                </View>
                                <Paragraph fontWeight={500}>Thông tin cá nhân</Paragraph>
                            </XStack>
                            <XStack gap="$2" alignItems="center">
                                {userProfileQuery.isFetching && <Spinner />}
                                {userProfile && (
                                    <View
                                        style={{
                                            paddingHorizontal: 8,
                                            borderRadius: 32,
                                            backgroundColor:
                                                userProfile.status === _VerifyUserStatus.ACTIVE
                                                    ? "#EEFBF3"
                                                    : userProfile.status === _VerifyUserStatus.IN_ACTIVE
                                                        ? "#FDF1EC"
                                                        : userProfile.status === _VerifyUserStatus.WAITING
                                                            ? "#FFFBED"
                                                            : "#ccc",
                                        }}
                                    >
                                        {userProfile.status === _VerifyUserStatus.ACTIVE && (
                                            <Paragraph fontWeight={500} fontSize={12} color="427C5C">
                                                Đã xác minh
                                            </Paragraph>
                                        )}
                                        {userProfile.status === _VerifyUserStatus.IN_ACTIVE && (
                                            <Paragraph fontWeight={500} fontSize={12} color="#814441">
                                                Chưa xác minh
                                            </Paragraph>
                                        )}
                                        {userProfile.status === _VerifyUserStatus.WAITING && (
                                            <Paragraph fontWeight={500} fontSize={12}>
                                                Chờ xác minh
                                            </Paragraph>
                                        )}
                                    </View>
                                )}
                                <FontAwesome6 name="angle-right" size={20} color="black" />
                            </XStack>
                        </XStack>
                    </TouchableOpacity>

                    {userProfile?.status === _VerifyUserStatus.IN_ACTIVE && (
                        <View
                            style={{
                                flex: 1,
                                padding: 16,
                                marginTop: 16,
                                backgroundColor: "#FFFBED",
                                borderRadius: 8,
                                flexDirection: "column",
                                gap: 32,
                            }}
                        >
                            <XStack gap="$2" alignItems="flex-start" flex={1}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 32,
                                        backgroundColor: "#fefae0", // màu nền kem
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {/* Vòng tròn ngoài */}
                                    <View
                                        style={{
                                            position: "absolute",
                                            width: 50,
                                            height: 50,
                                            borderRadius: 32,
                                            borderWidth: 4,
                                            borderColor: "#d6ccc2", // màu vòng ngoài nhạt
                                            opacity: 0.4,
                                        }}
                                    />

                                    {/* Icon người */}
                                    <FontAwesome6 name="user-xmark" size={16} color="black" />
                                </View>
                                <Paragraph
                                    fontSize={14}
                                    fontWeight={500}
                                    style={{
                                        flex: 1,
                                        flexWrap: "wrap", // Nếu vẫn lỗi thì có thể bỏ, chỉ cần flex: 1 là đủ
                                    }}
                                >
                                    Xin chào! Hãy điền thông tin chi tiết tài khoản của bạn để có
                                    thể nạp tiền lần đầu
                                </Paragraph>
                            </XStack>
                            <Button
                                theme="yellow"
                                fontWeight={500}
                                onPress={() => {
                                    router.push("/(app)/(info)/verify_user/stepOne");
                                }}
                            >
                                Hoàn tất hồ sơ
                            </Button>
                        </View>
                    )}

                    <Paragraph fontWeight={700} fontSize={20} marginVertical={16}>
                        Quyền lợi
                    </Paragraph>
                    <YStack gap="$4">
                        <TouchableOpacity onPress={maintainWarning}>
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <FontAwesome6 name="moon" size={18} color="black" />
                                    </View>
                                    <Paragraph maxWidth={250} lineHeight={18}>
                                        Miễn phí phí qua đêm
                                    </Paragraph>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6 name="angle-right" size={20} color="black" />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={maintainWarning}>
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <Ionicons
                                            name="shield-checkmark-outline"
                                            size={18}
                                            color="black"
                                        />
                                    </View>
                                    <Paragraph maxWidth={250} lineHeight={18}>
                                        Bảo vệ số dư âm
                                    </Paragraph>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6 name="angle-right" size={20} color="black" />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                    </YStack>

                    <Paragraph fontWeight={700} fontSize={20} marginVertical={16}>
                        Ví tiền
                    </Paragraph>
                    <TouchableOpacity
                        onPress={() => router.push("/(app)/(info)/wallet/wallet")}
                    >
                        <XStack alignItems="center" justifyContent="space-between" gap="$4">
                            <XStack alignItems="center" gap="$4">
                                <View style={style.box_icon}>
                                    <Ionicons name="wallet-outline" size={18} color="black" />
                                </View>
                                <Paragraph fontWeight={500}>Số dư</Paragraph>
                            </XStack>
                            <XStack gap="$2" alignItems="center">
                                {userProfileQuery.isFetching && <Spinner />}
                                {userProfile && (
                                    <Paragraph fontWeight="bold">
                                        {Number(userProfile.money).toLocaleString("en-US")} VND
                                    </Paragraph>
                                )}
                                <FontAwesome6 name="angle-right" size={20} color="black" />
                            </XStack>
                        </XStack>
                    </TouchableOpacity>

                    <Paragraph fontWeight={700} fontSize={20} marginVertical={16}>
                        Hỗ trợ
                    </Paragraph>
                    <YStack gap="$4">
                        <TouchableOpacity
                            onPress={() => router.push("/(app)/(info)/support/support")}
                        >
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                                flex={1}
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <FontAwesome6
                                            name="question-circle"
                                            size={18}
                                            color="black"
                                        />
                                    </View>
                                    <YStack>
                                        <Paragraph>Trung tâm hỗ trợ</Paragraph>
                                        <Paragraph
                                            fontSize={12}
                                            lineHeight={16}
                                            color={DefaultColor.slate[400]}
                                        >
                                            Giải đáp các thắc mắc của bạn
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6
                                        name="angle-right"
                                        size={20}
                                        color={DefaultColor.slate[400]}
                                    />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                router.push("/(app)/(info)/support/create/stepOne");
                            }}
                        >
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                                flex={1}
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <MaterialCommunityIcons
                                            name="comment-alert-outline"
                                            size={18}
                                            color="black"
                                        />
                                    </View>
                                    <YStack>
                                        <Paragraph>Mở yêu cầu</Paragraph>
                                        <Paragraph
                                            maxWidth={200}
                                            fontSize={12}
                                            lineHeight={16}
                                            color={DefaultColor.slate[400]}
                                        >
                                            Điền vào mẫu yêu cầu và chúng tôi sẽ liên hệ lại với bạn
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6
                                        name="angle-right"
                                        size={20}
                                        color={DefaultColor.slate[400]}
                                    />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={maintainWarning}>
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                                flex={1}
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <MaterialCommunityIcons
                                            name="comment-text-outline"
                                            size={18}
                                            color="black"
                                        />
                                    </View>
                                    <YStack>
                                        <Paragraph>Chat trực tuyến</Paragraph>
                                        <Paragraph
                                            maxWidth={200}
                                            fontSize={12}
                                            lineHeight={16}
                                            color={DefaultColor.slate[400]}
                                        >
                                            Đừng ngần ngại liên hệ với bộ pận hỗ trợ khách hàng của
                                            chúng tôi
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6
                                        name="angle-right"
                                        size={20}
                                        color={DefaultColor.slate[400]}
                                    />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={maintainWarning}>
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                                flex={1}
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <MaterialCommunityIcons
                                            name="lightbulb-on-outline"
                                            size={18}
                                            color="black"
                                        />
                                    </View>
                                    <YStack>
                                        <Paragraph>Đề xuất một tính năng</Paragraph>
                                        <Paragraph
                                            maxWidth={200}
                                            fontSize={12}
                                            lineHeight={16}
                                            color={DefaultColor.slate[400]}
                                        >
                                            Giúp chúng tôi trở nên tốt hơn
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6
                                        name="angle-right"
                                        size={20}
                                        color={DefaultColor.slate[400]}
                                    />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={maintainWarning}>
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                                flex={1}
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <MaterialCommunityIcons
                                            name="clipboard-check-multiple-outline"
                                            size={18}
                                            color="black"
                                        />
                                    </View>
                                    <YStack>
                                        <Paragraph>Giấy tờ pháp lý</Paragraph>
                                        <Paragraph
                                            maxWidth={200}
                                            fontSize={12}
                                            lineHeight={16}
                                            color={DefaultColor.slate[400]}
                                        >
                                            {APP_NAME} (SC) Ltd
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6
                                        name="angle-right"
                                        size={20}
                                        color={DefaultColor.slate[400]}
                                    />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={maintainWarning}>
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                                flex={1}
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <AntDesign name="like2" size={18} color="black" />
                                    </View>
                                    <YStack>
                                        <Paragraph>Đánh giá ứng dụng</Paragraph>
                                        <Paragraph
                                            maxWidth={200}
                                            fontSize={12}
                                            lineHeight={16}
                                            color={DefaultColor.slate[400]}
                                        >
                                            Vui lòng để lại đánh giá cho chúng tôi trên{" "}
                                            {Platform.OS === "ios" ? "App Store" : "Google Play"}
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6
                                        name="angle-right"
                                        size={20}
                                        color={DefaultColor.slate[400]}
                                    />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setAppInfo(true)}>
                            <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                gap="$4"
                                flex={1}
                            >
                                <XStack alignItems="center" gap="$4">
                                    <View style={style.box_icon}>
                                        <AntDesign name="infocirlceo" size={18} color="black" />
                                    </View>
                                    <YStack>
                                        <Paragraph>Giới thiệu ứng dụng</Paragraph>
                                    </YStack>
                                </XStack>
                                <XStack gap="$2" alignItems="center">
                                    <FontAwesome6
                                        name="angle-right"
                                        size={20}
                                        color={DefaultColor.slate[400]}
                                    />
                                </XStack>
                            </XStack>
                        </TouchableOpacity>
                    </YStack>

                    <Separator marginVertical={24} />
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                "Đăng xuất tài khoản",
                                "Bạn có chắc chắn muốn đăng xuất?",
                                [
                                    { text: "Hủy", style: "cancel" },
                                    { text: "Đăng xuất", style: "destructive", onPress: logout },
                                ]
                            );
                        }}
                    >
                        <XStack alignItems="center" justifyContent="space-between" gap="$4">
                            <XStack alignItems="center" gap="$4">
                                <View
                                    style={[
                                        style.box_icon,
                                        {
                                            backgroundColor: "#FDF1EC",
                                        },
                                    ]}
                                >
                                    <Ionicons name="exit-outline" size={24} color="#814441" />
                                </View>
                                <YStack>
                                    <Paragraph>Đăng xuất</Paragraph>
                                    <Paragraph
                                        maxWidth={200}
                                        fontSize={12}
                                        lineHeight={16}
                                        color={DefaultColor.slate[400]}
                                    >
                                        {userProfile?.email || "Email"}
                                    </Paragraph>
                                </YStack>
                            </XStack>
                            <XStack gap="$2" alignItems="center">
                                <FontAwesome6 name="angle-right" size={20} color="black" />
                            </XStack>
                        </XStack>
                    </TouchableOpacity>
                </YStack>
            </LayoutScrollApp>
            <InfoAppCanvas open={appInfo} setOpen={setAppInfo} />
        </>
    )


}


const style = StyleSheet.create({
    box_icon: {
        width: 48,
        height: 48,
        backgroundColor: DefaultColor.slate[100],
        borderRadius: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});