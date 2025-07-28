import SuccessView from "@/components/SuccessView";
import {router} from "expo-router";


export default function RegisterSuccessScreen() {

    return (
        <SuccessView
            title="Đăng ký thành công!"
            messages={[
                'Tài khoản của bạn đã được tạo.',
                'Vui lòng kiểm tra email để xác minh email.',
            ]}
            buttonText="Quay trở lại"
            onButtonPress={() => router.replace('/(auth)')}
        />
    )
}