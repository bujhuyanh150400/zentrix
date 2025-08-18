import {useCalculateInfoTrading} from "@/services/transaction/hook";
import {Dispatch, FC, SetStateAction} from "react";
import {Paragraph, Separator, Sheet, XStack, YStack} from "tamagui";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import DefaultColor from "@/components/ui/DefaultColor";


type Props = {
    hookInfoTrading: ReturnType<typeof useCalculateInfoTrading>
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
}

const TransactionMoreInfo: FC<Props> = ({hookInfoTrading, open, setOpen}) => {

    return (
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
            <Sheet.Handle/>
            <Sheet.Frame padding="$4" gap="$2">
                <Paragraph fontSize={sizeDefault.lg} fontWeight={700} textAlign="center">Thông tin lệnh</Paragraph>
                <YStack gap={"$2"}>
                    <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"}>
                        <Paragraph fontSize={sizeDefault.base}>Giao dịch:</Paragraph>
                        <Paragraph fontSize={sizeDefault.base} color={DefaultColor.slate[500]}>{hookInfoTrading.priceConvert.totalPrice.toFixed(2)}</Paragraph>
                    </XStack>
                    <Separator />
                    <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"}>
                        <Paragraph fontSize={sizeDefault.base}>Giá chuyển đổi:</Paragraph>
                        <Paragraph fontSize={sizeDefault.base} color={DefaultColor.slate[500]}>{hookInfoTrading.priceConvert.convertPrice.toFixed(2)} USD</Paragraph>
                    </XStack>
                    <Separator />
                    <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"}>
                        <Paragraph fontSize={sizeDefault.base}>Tỉ giá:</Paragraph>
                        <Paragraph fontSize={sizeDefault.base} color={DefaultColor.slate[500]}>{hookInfoTrading.rateToUsd.toFixed(2)}</Paragraph>
                    </XStack>
                    <Separator />
                    <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"}>
                        <Paragraph fontSize={sizeDefault.base}>Phí giao dịch:</Paragraph>
                        <Paragraph fontSize={sizeDefault.base} color={DefaultColor.slate[500]}>~{hookInfoTrading.trans_fee.toFixed(2)}</Paragraph>
                    </XStack>
                    <Separator />
                    <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"}>
                        <Paragraph fontSize={sizeDefault.base}>Phí qua đêm (mỗi ngày):</Paragraph>
                        <Paragraph fontSize={sizeDefault.base} color={DefaultColor.slate[500]}>{hookInfoTrading.trans_fee_overnight.toFixed(2)}</Paragraph>
                    </XStack>
                    <Separator />
                    <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"}>
                        <Paragraph fontSize={sizeDefault.base}>Kí quỹ:</Paragraph>
                        <Paragraph fontSize={sizeDefault.base} color={DefaultColor.slate[500]}>{hookInfoTrading.deposit.toFixed(2)}</Paragraph>
                    </XStack>

                    {hookInfoTrading.account &&
                        <>
                            <Separator />
                            <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"}>
                                <Paragraph fontSize={sizeDefault.base}>Đòn bảy:</Paragraph>
                                <Paragraph fontSize={sizeDefault.base} color={DefaultColor.slate[500]}>{hookInfoTrading.account.lever.min} : {hookInfoTrading.account.lever.max}</Paragraph>
                            </XStack>
                        </>
                    }

                </YStack>
            </Sheet.Frame>
        </Sheet>
    )
}


export default TransactionMoreInfo;