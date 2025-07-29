import {useQueryGetUserProfile} from "@/services/auth/hook";
import DefaultColor from "@/components/ui/DefaultColor";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {Paragraph, Separator, Spinner, XStack, YGroup, YStack} from "tamagui";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import { TouchableOpacity, View } from "react-native";
import { _VerifyUserStatus } from "@/services/auth/@type";
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export default function UserInfoScreen() {
    const userProfileQuery = useQueryGetUserProfile();
    const userProfile = userProfileQuery?.data || null;
    return(
        <LayoutScrollApp style={{backgroundColor: DefaultColor.white}}>
            <Paragraph fontWeight={700} fontSize={sizeDefault.xl} marginBottom={16}>Tài khoản</Paragraph>
            <TouchableOpacity
                onPress={() => {
                    userProfile?.status === _VerifyUserStatus.IN_ACTIVE && router.push('/(app)/(info)/verify_user/stepOne');
                }}
                style={{
                    flex: 1,
                    padding: 20,
                    marginTop: 12,
                    backgroundColor: DefaultColor.white,
                    borderRadius: 8,
                    flexDirection: "column",
                    borderWidth: 1,
                    borderColor: DefaultColor.slate["200"],
                    gap: 32
                }}>
                <XStack gap="$4" alignItems="center" flex={1}>
                    <View
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 100,
                            backgroundColor: 'transparent', // màu nền kem
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* Vòng tròn ngoài */}
                        <View
                            style={{
                                position: 'absolute',
                                width: 70,
                                height: 70,
                                borderRadius: 100,
                                borderWidth: 6,
                                borderColor: DefaultColor.slate["200"], // màu vòng ngoài nhạt
                                opacity: 0.4,
                            }}
                        />

                        {/* Icon người */}
                        <FontAwesome6 name="user" size={sizeDefault["2xl"]} color="black"/>
                    </View>
                    <YStack gap="$2">
                        <Paragraph fontSize={14}>Trạng thái</Paragraph>
                        {userProfileQuery.isFetching && <Spinner />}
                        {!userProfile && <Paragraph>Không có dữ liệu</Paragraph>}
                        {!userProfileQuery.isFetching && userProfile && (
                            <Paragraph
                                fontSize={24}
                                fontWeight={700}
                                style={{
                                    color:
                                        userProfile.status === _VerifyUserStatus.ACTIVE
                                            ? "#22ff65"
                                            : (userProfile.status === _VerifyUserStatus.IN_ACTIVE ? "#ff6343" :
                                                    (userProfile.status === _VerifyUserStatus.WAITING ? "#ccc750" : "#ccc")
                                            ),
                                }}
                            >
                                {userProfile.status === _VerifyUserStatus.ACTIVE && 'Đã xác minh'}
                                {userProfile.status === _VerifyUserStatus.IN_ACTIVE && 'Chưa xác minh'}
                                {userProfile.status === _VerifyUserStatus.WAITING && 'Chờ xác minh'}
                            </Paragraph>
                        )}
                        {!userProfileQuery.isFetching && userProfile?.status === _VerifyUserStatus.IN_ACTIVE &&
                            <Paragraph fontSize={14} fontWeight={500} color="#ccc">Nhấn để xác minh hồ sơ</Paragraph>
                        }
                    </YStack>
                </XStack>
            </TouchableOpacity>
            <Paragraph fontWeight={700} fontSize={20} marginVertical={16}>Thông tin cá nhân</Paragraph>
            {userProfileQuery.isFetching && <Spinner />}
            {!userProfileQuery.isLoading && userProfile && (
                <YGroup separator={<Separator/>}>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Tên tài khoản</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.name}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Email</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.email}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Họ</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.first_name ? userProfile.first_name : "Chưa có thông tin"}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Tên</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.last_name ? userProfile.last_name : "Chưa có thông tin"}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Ngày sinh</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.dob ? userProfile.dob : "Chưa có thông tin"}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Giới tính</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.gender ? (
                                <>
                                    {userProfile.gender === 'male' && "Nam"}
                                    {userProfile.gender === 'female' && "Nữ"}
                                    {userProfile.gender === 'other' && "Khác"}
                                </>
                            ) : "Chưa có thông tin"}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Số điện thoại</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.phone_number ? userProfile.phone_number : "Chưa có thông tin"}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Địa chỉ</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.address ? userProfile.address : "Chưa có thông tin"}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    <YGroup.Item>
                        <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                            <Paragraph fontWeight={500} color="#7D7D7D">Quốc gia</Paragraph>
                            <Paragraph fontWeight={500}>{userProfile.country ? userProfile.country : "Chưa có thông tin"}</Paragraph>
                        </XStack>
                    </YGroup.Item>
                    {userProfile.banks && (
                        <>
                            <YGroup.Item>
                                <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                                    <Paragraph fontWeight={500} color="#7D7D7D">Ngân hàng</Paragraph>
                                    <Paragraph fontWeight={500}>{userProfile.banks.short_name}</Paragraph>
                                </XStack>
                            </YGroup.Item>
                            <YGroup.Item>
                                <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                                    <Paragraph fontWeight={500} color="#7D7D7D">Số tài khoản</Paragraph>
                                    <Paragraph fontWeight={500}>{userProfile.account_bank}</Paragraph>
                                </XStack>
                            </YGroup.Item>
                            <YGroup.Item>
                                <XStack paddingVertical="$4" justifyContent="space-between" alignItems="center">
                                    <Paragraph fontWeight={500} color="#7D7D7D">Tên tài khoản</Paragraph>
                                    <Paragraph fontWeight={500}>{userProfile.account_bank_name}</Paragraph>
                                </XStack>
                            </YGroup.Item>
                        </>
                    )}
                </YGroup>
            )}
        </LayoutScrollApp>
    )
}