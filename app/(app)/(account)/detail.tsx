import {useGetAccountActive, useGetLeverOptions, useMutationEditLever} from "@/services/account/hook";
import {View} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import {Card, Paragraph, Separator, XStack} from "tamagui";
import SkeletonFade from "@/components/SkeletonFade";
import {useQueryGetUserProfile} from "@/services/auth/hook";
import {StackButtonAccountReal} from "@/components/account/Layer";
import useNestedState from "@/hooks/useNestedState";
import {useEffect} from "react";
import SelectOptions from "@/components/ui/SelectOptions";
import {FontAwesome5} from '@expo/vector-icons';
import {showMessage} from "react-native-flash-message";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {useAppStore} from "@/services/app/store";

export default function DetailScreen () {

    const queryAccountActive = useGetAccountActive();
    const userProfileQuery = useQueryGetUserProfile();

    const account = queryAccountActive.account;
    const userProfile = userProfileQuery?.data || null;

    const setLoading = useAppStore(state => state.setLoading);

    const [options, setOptions] = useNestedState({
        account_id: account?.id || 0,
        lever_id: account?.lever.id || 0,
    });

    const leversOptions = useGetLeverOptions();

    const {mutate} = useMutationEditLever({
        onSuccess: async () => {
            showMessage({
                message: "Thay đổi thành công",
                description: "Cập nhật đòn bẩy thành công",
                type: 'success',
                duration: 3000,
            });
            setLoading(false);
            queryAccountActive.get();
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error);
            setLoading(false);
        }
    })

    useEffect(() => {
        if (account){
            setOptions({
                account_id: account.id,
                lever_id: account.lever.id
            });
        }
    }, [account]);

    return (
        <View style={{flex: 1, backgroundColor: DefaultColor.white, paddingHorizontal: 20, paddingBottom: 20}}>
            <Paragraph style={{textAlign:"center", fontWeight: 700, fontSize: sizeDefault.lg, marginBottom: 16}}>Chi tiết account</Paragraph>
            <Card size="$3" padded bordered backgroundColor={DefaultColor.white} marginBottom={40}>
                <XStack alignItems={"center"} justifyContent={"space-between"}>
                    <Paragraph fontWeight={500}>Số dư:</Paragraph>
                    <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>{account? account.money.toLocaleString('en-US') : <SkeletonFade/>} USD</Paragraph>
                </XStack>
                <Separator marginVertical={10} />
                <XStack alignItems={"center"} justifyContent={"space-between"}>
                    <Paragraph fontWeight={500}>Lời/Lỗ giao động:</Paragraph>
                    <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>{account ? account.profit.toLocaleString('en-US') : <SkeletonFade/>} USD</Paragraph>
                </XStack>
                <Separator marginVertical={10} />
                <XStack alignItems={"center"} justifyContent={"space-between"}>
                    <Paragraph fontWeight={500}>Loại tài khoản:</Paragraph>
                    <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>{account ? account.account_type.name : <SkeletonFade/>}</Paragraph>
                </XStack>
                <Separator marginVertical={10} />
                <XStack alignItems={"center"} justifyContent={"space-between"}>
                    <Paragraph fontWeight={500}>Số tiền nạp tối thiểu:</Paragraph>
                    <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>{account ? Number(account.account_type.min).toLocaleString('en-US') : <SkeletonFade/>} USD </Paragraph>
                </XStack>
                <Separator marginVertical={10} />
                <XStack alignItems={"center"} justifyContent={"space-between"}>
                    <Paragraph fontWeight={500}>Số tiền nạp tối đa:</Paragraph>
                    <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>{account ? Number(account.account_type.max).toLocaleString('en-US') : <SkeletonFade/>} USD </Paragraph>
                </XStack>
                <Separator marginVertical={10} />
                <XStack alignItems={"center"} justifyContent={"space-between"}>
                    <Paragraph fontWeight={500}>Đòn bẩy:</Paragraph>
                    <XStack gap={"$2"} alignItems={"center"}>
                        <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>
                            {account ? `${account.lever.min}:${account.lever.max}` : <SkeletonFade/>}
                        </Paragraph>
                        <SelectOptions
                            snapPoints={[50]}
                            options={leversOptions}
                            value={options.lever_id.toString()}
                            onChange={(value) => {
                                mutate({
                                    account_id: options.account_id,
                                    lever_id: Number(value),
                                })
                                setLoading(true);
                            }}
                            trigger={() => (
                                <FontAwesome5 name="edit" size={sizeDefault.md} color={DefaultColor.slate[500]}/>
                            )}/>
                    </XStack>
                </XStack>
            </Card>
            <Card size="$3" padded bordered backgroundColor={DefaultColor.white} marginBottom={15}>
                <StackButtonAccountReal account={account} userProfile={userProfile} showDetail={false}/>
            </Card>
        </View>
    )

}