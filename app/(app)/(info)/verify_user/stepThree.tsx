import useDisableBackGesture from "@/hooks/useDisableBackGesture";
import { CameraView } from "expo-camera";
import {FC, RefObject, useCallback, useRef, useState} from "react";
import {useVerifyAccountUserStore} from "@/services/auth/store";
import {useMutationVerifyAccount} from "@/services/auth/hook";
import {showMessage} from "react-native-flash-message";
import {router} from "expo-router";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {Alert, Dimensions, View, StyleSheet, TouchableOpacity} from "react-native";
import DefaultColor from "@/components/ui/DefaultColor";
import {Paragraph, YStack, Image, XStack, Button, Spinner} from "tamagui";
import { FontAwesome } from "@expo/vector-icons";


enum _Step {
    TAKE_PIC_1 = 0,
    PREVIEW_PIC_1 = 1,
    TAKE_PIC_2 = 2,
    PREVIEW_PIC_2 = 3,
}

const {width} = Dimensions.get('window');
const ID_CARD_WIDTH = width * 0.8;
const ID_CARD_HEIGHT = ID_CARD_WIDTH * 0.63;

export default function StepThreeScreen() {
    // chặn hành vi vuốt về
    useDisableBackGesture();

    // khai báo camera
    const cameraRefFront = useRef<CameraView>(null);
    const cameraRefBack = useRef<CameraView>(null);

    // khai báo state để lưu ảnh chụp
    const [frontIdentityImage, setFrontIdentityImage] = useState<string | null>(null);
    const [backIdentityImage, setBackIdentityImage] = useState<string | null>(null);
    const [step, setStep] = useState<_Step>(_Step.TAKE_PIC_1);

    const {form_step_1, clearStepOne} = useVerifyAccountUserStore()

    const takePictureFront = useCallback(async () => {
        const camera = cameraRefFront.current;
        if (!camera || !camera.takePictureAsync) return;
        if (cameraRefFront.current) {
            const photo = await cameraRefFront.current.takePictureAsync({
                quality: 0.5,
                base64: false,
                exif: false,
            });
            setFrontIdentityImage(photo.uri);
            setStep(_Step.PREVIEW_PIC_1);
        }
    }, []);

    const takePictureBack = useCallback(async () => {
        const camera = cameraRefBack.current;
        if (!camera || !camera.takePictureAsync) return;
        if (cameraRefBack.current) {
            const photo = await cameraRefBack.current.takePictureAsync({
                quality: 0.5,
                base64: false,
                exif: false,
            });
            setBackIdentityImage(photo.uri);
            setStep(_Step.PREVIEW_PIC_2);
        }
    }, []);

    const {mutate, isPending} = useMutationVerifyAccount({
        onSuccess: async () => {
            clearStepOne();
            showMessage({
                type:"success",
                message:"Gửi dữ liệu thành công",
                description: 'Hệ thống sẽ đánh giá thông tin xác thực thông tin của bạn.',
                duration: 3000,
            })
            router.replace('/(app)/(tab)/info')
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error);
            router.replace('/(app)/(tab)/info')
        }
    })

    const submitVerify = () => {
        if (form_step_1 && frontIdentityImage && backIdentityImage) {
            const formData = new FormData();
            formData.append('first_name', form_step_1.first_name);
            formData.append('last_name', form_step_1.last_name);
            formData.append('dob', form_step_1.dob);
            formData.append('gender', form_step_1.gender);
            formData.append('phone_number', form_step_1.phone_number);
            formData.append('address', form_step_1.address);
            formData.append('address', form_step_1.address);
            formData.append('bin_bank', form_step_1.bin_bank);
            formData.append('account_bank', form_step_1.account_bank);
            formData.append('account_bank_name', form_step_1.account_bank_name);
            formData.append("cccd_front_image", {
                uri: frontIdentityImage,
                name: "front.jpg",
                type: "image/jpg",
            } as any);
            formData.append("cccd_back_image", {
                uri: backIdentityImage,
                name: "back.jpg",
                type: "image/jpg",
            } as any);
            mutate(formData);
        } else {
            Alert.alert('Có lỗi xảy ra', 'Có lỗi xảy ra vui lòng thử lại sau')
        }
    };

    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            {step === _Step.TAKE_PIC_1 && <CameraFrontView cameraRef={cameraRefFront} setImage={takePictureFront}
                                                           title="Đặt camera vào khung viền và chụp ảnh mặt trước của CCCD"/>}
            {step === _Step.PREVIEW_PIC_1 && frontIdentityImage &&
                <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: 20}}>
                    <YStack gap="$3" alignItems="center" marginTop={24}>
                        <Paragraph theme="alt2" fontSize={20} fontWeight="bold">Xác nhận ảnh mặt trước CCCD</Paragraph>
                        <Image
                            source={{uri: frontIdentityImage}}
                            style={{
                                width: 350,
                                height: 350
                            }}
                            objectFit={"contain"}
                        />
                        <Paragraph theme="alt2">Vui lòng kiểm tra lại ảnh CCCD bạn vừa chụp. Đảm bảo ảnh rõ nét, không
                            bị lóa, mờ hoặc che khuất thông tin.</Paragraph>
                    </YStack>
                    <XStack gap="$2" alignItems="center">
                        <Button style={{flex: 1}} fontWeight={500} onPress={() => {
                            setStep(_Step.TAKE_PIC_1);
                            setFrontIdentityImage(null);
                        }}>
                            Chụp lại
                        </Button>
                        <Button style={{flex: 1}} theme="green" fontWeight={500} onPress={() => {
                            setStep(_Step.TAKE_PIC_2);
                            setBackIdentityImage(null);
                        }}>
                            Xác nhận
                        </Button>
                    </XStack>
                </View>

            }
            {step === _Step.TAKE_PIC_2 && <CameraFrontView cameraRef={cameraRefBack} setImage={takePictureBack}
                                                           title="Đặt camera vào khung viền và chụp ảnh mặt sau của CCCD"/>}
            {step === _Step.PREVIEW_PIC_2 && frontIdentityImage &&
                <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: 20}}>
                    <YStack gap="$3" alignItems="center" marginTop={24}>
                        <Paragraph theme="alt2" fontSize={20} fontWeight="bold">Xác nhận ảnh mặt sau CCCD</Paragraph>
                        <Image
                            source={{uri: frontIdentityImage}}
                            style={{
                                width: 350,
                                height: 350
                            }}
                            objectFit={"contain"}
                        />
                        <Paragraph theme="alt2">Vui lòng kiểm tra lại ảnh CCCD bạn vừa chụp. Đảm bảo ảnh rõ nét, không bị lóa, mờ hoặc che khuất thông tin.</Paragraph>
                    </YStack>
                    <XStack gap="$2" alignItems="center">
                        {isPending ? <Spinner/> :
                            <>
                                <Button style={{flex: 1}} fontWeight={500} onPress={() => {
                                    setStep(_Step.TAKE_PIC_2);
                                    setBackIdentityImage(null);
                                }}>
                                    Chụp lại
                                </Button>
                                <Button style={{flex: 1}} theme="green" fontWeight={500} onPress={submitVerify}>
                                    Gửi thông tin
                                </Button>
                            </>
                        }
                    </XStack>
                </View>
            }
        </View>
    )
}

const CameraFrontView: FC<{
    cameraRef: RefObject<CameraView | null>;
    setImage: () => void;
    title: string;
}> = (props) => {
    return (
        <CameraView
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            ref={props.cameraRef}
            facing={"back"}
        >
            <Paragraph style={{
                position: 'absolute',
                top: 100,
                left: 20,
                right: 20,
                textAlign: 'center',
                color: 'white',
                fontSize: 16,
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
                {props.title}
            </Paragraph>
            {/* Khung viền CCCD */}
            <View style={styles.overlay}>
                <View style={styles.idCardFrame}/>
            </View>
            <View style={styles.captureButtonContainer}>
                <TouchableOpacity onPress={props.setImage} style={styles.captureButton}>
                    <FontAwesome name="camera" size={28} color="white"/>
                </TouchableOpacity>
            </View>
        </CameraView>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    idCardFrame: {
        width: ID_CARD_WIDTH,
        height: ID_CARD_HEIGHT,
        borderWidth: 2,
        borderColor: DefaultColor.green[200],
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    captureButtonContainer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: DefaultColor.white,
    },
});
