import { useCameraPermissions } from 'expo-camera';
import {Alert, View} from "react-native";
import {router} from "expo-router";
import DefaultColor from "@/components/ui/DefaultColor";
import {Button, H6, Paragraph, XStack, YStack, Image} from 'tamagui';
import {FontAwesome} from "@expo/vector-icons";


export default function StepTwoScreen() {
    const [permission, requestPermission] = useCameraPermissions();

    // Hàm xử lý khi người dùng nhấn nút "Xác nhận và tiếp tục"
    const handleContinue = async () => {
        // Nếu chưa có quyền, yêu cầu
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert(
                    'Yêu cầu quyền truy cập camera',
                    'Ứng dụng cần quyền truy cập camera để chụp ảnh CCCD.'
                );
                return;
            }
        }else{
            router.push('/(app)/(info)/verify_user/stepThree');
        }
    };

    return (
        <View style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: DefaultColor.white,
            gap: 20,
            padding: 20
        }}>
            <YStack gap="$2" justifyContent="center">
                <Image
                    source={require('@/assets/images/cccd.png')}
                    style={{
                        width: 350,
                        height: 200
                    }}
                    objectFit={"contain"}
                />
                <H6 textAlign="center" fontWeight={700} marginBottom={20}>Vui lòng chụp ảnh CCCD rõ nét để xác minh thông tin cá nhân</H6>
                <YStack gap="$2" justifyContent="center" alignItems="flex-start" flexWrap={"wrap"}>
                    <Paragraph theme="alt2" fontWeight={500} fontSize={16}>Ảnh chụp cần đảm bảo</Paragraph>
                    <XStack gap="$2" alignItems="center">
                        <FontAwesome name="check" size={16} color="green" />
                        <Paragraph theme="alt2" >Không bị lóa sáng, mờ, hoặc mất góc</Paragraph>
                    </XStack>
                    <XStack gap="$2" alignItems="center">
                        <FontAwesome name="check" size={16} color="green" />
                        <Paragraph theme="alt2" >Hiển thị đầy đủ thông tin và số CCCD</Paragraph>
                    </XStack>
                    <XStack gap="$2" alignItems="center">
                        <FontAwesome name="check" size={16} color="green" />
                        <Paragraph theme="alt2" >Không bị che bởi ngón tay, vật khác</Paragraph>
                    </XStack>
                    <XStack gap="$2" alignItems="center">
                        <FontAwesome name="check" size={16} color="green" />
                        <Paragraph theme="alt2" >Không chụp màn hình, bản photo</Paragraph>
                    </XStack>
                </YStack>
            </YStack>
            <Button width="100%"  theme="yellow" fontWeight={500} onPress={handleContinue}>
                Xác nhận và tiếp tục
            </Button>
        </View>
    );
}