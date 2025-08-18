import {useAssets} from "expo-asset";
import {useVideoPlayer, VideoView} from "expo-video";
import {StyleSheet, View, Text} from "react-native";
import {APP_NAME} from "@/libs/constant_env";
import {router} from "expo-router";
import {TouchableOpacity} from "@gorhom/bottom-sheet";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import useDisableBackGesture from "@/hooks/useDisableBackGesture";
import DefaultColor from "@/components/ui/DefaultColor";
import {Paragraph} from "tamagui";


export default function OnboardScreen() {
    // chặn hành vi vuốt về
    useDisableBackGesture();

    const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);

    const player = useVideoPlayer({
        uri: assets && assets.length > 0 ? assets[0].uri : undefined
    }, player => {
        player.play()
        player.loop = true;
        player.muted = true;
    });

    return (
        <View style={styles.container}>
            {assets && (
                <VideoView
                    contentFit="cover"
                    player={player}
                    style={styles.video}
                    nativeControls={false}
                />
            )}
            <View style={{ marginTop: 80, padding: 20 }}>
                <Text style={styles.app_name}>{APP_NAME}</Text>
                <Text style={styles.header}>Sẵn sàng để thay đổi cách bạn kiếm tiền?</Text>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.button,{
                        backgroundColor: DefaultColor.slate[600]
                    }]}
                    onPress={() => {
                        router.push('/(auth)/login')
                    }}>
                    <Paragraph style={{ fontSize: sizeDefault["lg"], fontWeight: 500 , color: DefaultColor.white}}>
                        Đăng nhập
                    </Paragraph>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button,{
                        backgroundColor: DefaultColor.white
                    }]}
                    onPress={() => {
                        router.push('/(auth)/register')
                    }}>
                    <Paragraph style={{ fontSize: sizeDefault["lg"], fontWeight: 500 }}>Đăng ký</Paragraph>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    app_name: {
        fontSize: sizeDefault["3xl"],
        fontWeight: '900',
        textTransform: 'uppercase',
        color: 'white',
        marginBottom: 20
    },
    header: {
        fontSize: sizeDefault["4xl"],
        fontWeight: '900',
        textTransform: 'uppercase',
        color: 'white',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 60,
        paddingHorizontal: 20,
    },
    button: {
        padding: 10,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});