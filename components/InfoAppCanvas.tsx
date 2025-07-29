import {Dispatch, FC, SetStateAction} from "react";
import {Paragraph, Sheet, XStack, YStack} from "tamagui";
import {View, Image} from "react-native";
import {APP_INFO, APP_NAME} from "@/libs/constant_env";
import DefaultColor from "@/components/ui/DefaultColor";


type InfoAppCanvasProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
}

const InfoAppCanvas: FC<InfoAppCanvasProps> = ({open, setOpen}) => {

    return (
        <Sheet
            forceRemoveScrollEnabled={true}
            modal={true}
            open={open}
            onOpenChange={setOpen}
            snapPoints={[80]}
            dismissOnSnapToBottom
            zIndex={100_000}
            animation="medium"
        >
            <Sheet.Overlay
                animation="lazy"
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />

            <Sheet.Handle/>
            <Sheet.Frame padding="$4" gap="$2">
                <Paragraph fontSize={20} fontWeight={700} textAlign="center">Giới thiệu ứng dụng</Paragraph>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Image
                        source={require('@/assets/images/zentrix_logo.png')}
                        style={{
                            height: 200
                        }}
                        resizeMode="contain"
                    />
                    <Paragraph fontSize={20} fontWeight={700} textAlign="center">{APP_NAME}</Paragraph>
                </View>
                <YStack gap="$8" marginTop={30}>
                    <XStack justifyContent="space-between" alignItems="center" gap="$2">
                        <Paragraph fontSize={16} fontWeight={700}>Tên App</Paragraph>
                        <Paragraph fontSize={16} fontWeight={500} color={DefaultColor.slate[400]}>{APP_INFO.name}</Paragraph>
                    </XStack>
                    <XStack justifyContent="space-between" alignItems="center" gap="$2">
                        <Paragraph fontSize={16} fontWeight={700}>Phiên bản</Paragraph>
                        <Paragraph fontSize={16} fontWeight={500} color={DefaultColor.slate[400]}>{APP_INFO.version}</Paragraph>
                    </XStack>
                    <XStack justifyContent="space-between" alignItems="center" gap="$2">
                        <Paragraph fontSize={16} fontWeight={700} >Số hiệu phiên bản</Paragraph>
                        <Paragraph fontSize={16} fontWeight={500} color={DefaultColor.slate[400]}>{APP_INFO.number_version}</Paragraph>
                    </XStack>
                </YStack>

            </Sheet.Frame>
        </Sheet>
    )
}
export default InfoAppCanvas;