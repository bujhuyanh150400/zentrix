import {useGetAccountActive} from "@/services/account/hook";
import {useAppStore} from "@/services/app/store";
import {useEffect} from "react";
import {showMessage} from "react-native-flash-message";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import DefaultColor from "@/components/ui/DefaultColor";
import {Button, Card, H4, H6, Paragraph, View, XStack, YStack} from "tamagui";
import { _AccountType } from "@/services/account/@types";
import {Link, router} from "expo-router";
import {TouchableOpacity} from "@gorhom/bottom-sheet";
import {FontAwesome6} from "@expo/vector-icons";
import DefaultStyle from "@/components/ui/DefaultStyle";
import TransactionTabs from "@/components/TransactionTabs";


export default function AccountTabScreen() {

    const queryAccountActive = useGetAccountActive();

    const setLoading = useAppStore(state => state.setLoading);

    useEffect(() => {
        if (queryAccountActive.error) {
            showMessage({
                message: 'Không thể lấy thông tin tài khoản hoạt động',
                description: 'Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.',
                type: 'danger',
                duration: 3000,
            })
        }
    }, [queryAccountActive.error]);

    useEffect(() => {
        setLoading(queryAccountActive.loading);
    }, [queryAccountActive.loading])

    const activeAccount = queryAccountActive.account;

    return (
        <LayoutScrollApp title="Tài khoản" style={{backgroundColor: DefaultColor.white}}>
            <Card elevate size="$4" bordered backgroundColor="white" marginBottom={15}>
                <Card.Header padded>
                    {queryAccountActive.isSuccess && activeAccount && (
                        <>
                            <XStack alignItems="flex-start" justifyContent="space-between" paddingBottom={36}>
                                <YStack gap="$2">
                                    {/*name + btn list*/}
                                    <H6 fontWeight="bold">{activeAccount.name}</H6>
                                    {/*Credit + type name + code*/}
                                    <XStack gap="$2" alignItems="center">
                                        <View
                                            style={{
                                                paddingHorizontal: 8,
                                                borderRadius: 8,
                                                backgroundColor: activeAccount.type === _AccountType.TEST_ACCOUNT ? '#FEF08A' : '#BBF7D0',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Paragraph theme="alt2"
                                                       fontSize="$2">{activeAccount.type === _AccountType.TEST_ACCOUNT ? 'Credit' : 'Thật'}</Paragraph>
                                        </View>
                                        <View
                                            style={{
                                                paddingHorizontal: 8,
                                                borderRadius: 8,
                                                backgroundColor: '#E5E5E5',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Paragraph theme="alt2"
                                                       fontSize="$2">{activeAccount.account_type.name}</Paragraph>
                                        </View>
                                        <Paragraph theme="alt2" fontSize="$2">{activeAccount.code}</Paragraph>
                                    </XStack>
                                </YStack>
                                <Link href={'/(app)/(account)/list'}>
                                    <TouchableOpacity>
                                        <FontAwesome6 name="list" size={18} color="black" />
                                    </TouchableOpacity>
                                </Link>

                            </XStack>
                            <H4 fontWeight="bold">0 {activeAccount.currency.currency}</H4>
                        </>
                    )}
                    {queryAccountActive.isSuccess && !activeAccount && (
                        <>
                            <H6 fontWeight="bold" paddingBottom={12}>Không có tài khoản nào đang hoạt động</H6>
                            <Paragraph theme="alt2">Mở tài khoản mới hoặc restore 1 tài khoản</Paragraph>
                        </>
                    )}
                    {queryAccountActive.error && (
                        <>
                            <H6 fontWeight="bold" paddingBottom={12}>Lỗi khi lấy thông tin tài khoản</H6>
                            <Paragraph theme="alt2">Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.</Paragraph>
                        </>
                    )}
                </Card.Header>
                <Card.Footer alignItems="center" justifyContent="center" gap="$4" padded>
                    {!queryAccountActive.loading &&
                        <>
                            {!activeAccount
                                &&
                                <>
                                    <YStack alignItems="center" justifyContent="center" gap="$2">
                                        <TouchableOpacity
                                            style={[
                                                DefaultStyle.circleButton, {backgroundColor: DefaultColor.slate[200]}
                                            ]}
                                            onPress={() => {
                                                router.push('/(app)/(account)/addStepOne');
                                            }}
                                        >
                                            <FontAwesome6 name="add" size={10} color="black"/>
                                        </TouchableOpacity>
                                        <Paragraph theme="alt2" fontSize="$2">Tạo tài khoản</Paragraph>
                                    </YStack>
                                    <YStack alignItems="center" justifyContent="center" gap="$2">
                                        <TouchableOpacity
                                            style={[
                                                DefaultStyle.circleButton, {backgroundColor: DefaultColor.slate[200]}
                                            ]}
                                        >
                                            <FontAwesome6 name="box-archive" size={10} color="black"/>
                                        </TouchableOpacity>
                                        <Paragraph theme="alt2" fontSize="$2">Restore</Paragraph>
                                    </YStack>
                                </>
                            }
                            {activeAccount
                                &&
                                <>
                                    <YStack alignItems="center" justifyContent="center" gap="$2">
                                        <Button
                                            borderRadius="100%"
                                            theme="yellow"
                                            borderWidth={2}
                                            borderColor="$yellow6"
                                            paddingVertical={10}
                                            paddingHorizontal={12}
                                            icon={<FontAwesome6 name="circle-down" size={18} color="black" />}
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/(app)/(account)/recharge/credit',
                                                    params: {
                                                        account_id: activeAccount.id,
                                                        currency: activeAccount.currency.currency,
                                                    }
                                                });
                                            }}
                                        />
                                        <Paragraph theme="alt2" fontSize="$2">Nạp tiền</Paragraph>
                                    </YStack>
                                    <YStack alignItems="center" justifyContent="center" gap="$2">
                                        <Button
                                            borderRadius="100%"
                                            paddingVertical={10}
                                            paddingHorizontal={12}
                                            icon={<FontAwesome6 name="circle-up" size={18} color="black" />}
                                        />
                                        <Paragraph theme="alt2" fontSize="$2">Rút tiền</Paragraph>
                                    </YStack>
                                </>
                            }
                        </>
                    }
                </Card.Footer>
            </Card>
            <TransactionTabs account={queryAccountActive.account} showTotal={true} />
        </LayoutScrollApp>


    )
}