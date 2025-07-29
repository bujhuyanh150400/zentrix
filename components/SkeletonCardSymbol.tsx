import {FC} from "react";
import {Card, XStack, YStack} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import SkeletonFade from "@/components/SkeletonFade";

const SkeletonCardSymbol: FC<{ numberCard?: number }> = ({numberCard = 1}) => (
    <YStack gap={"$2"}>
        {Array.from({length: numberCard}).map((_, index) => (
            <Card
                key={index}
                bordered
                paddingHorizontal="$3"
                paddingVertical="$2"
                marginVertical="$2"
                backgroundColor={DefaultColor.white}
            >
                <XStack alignItems="flex-start" justifyContent="space-between" gap="$2">
                    {/* symbol and info */}
                    <YStack gap="$2">
                        <XStack alignItems="flex-start" justifyContent="flex-start" gap="$2">
                            <SymbolAssetIcons symbol="" currency_base="" currency_quote="" size={18}/>
                            <SkeletonFade/>
                        </XStack>
                    </YStack>

                    <YStack gap="$2" alignItems="flex-end">
                        <SkeletonFade/>
                        <SkeletonFade/>
                    </YStack>
                </XStack>
            </Card>
        ))}
    </YStack>
)
export default SkeletonCardSymbol;