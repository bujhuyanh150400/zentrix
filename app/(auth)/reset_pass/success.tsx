import SuccessView from "@/components/SuccessView";
import {router} from "expo-router";
import useDisableBackGesture from "@/hooks/useDisableBackGesture";


export default function ResetPasswordSuccessScreen() {
    // chặn hành vi vuốt về
    useDisableBackGesture();
    return (
        <SuccessView
            title="Thay mật khẩu thành công!"
            messages={[
                'Tài khoản của bạn đã thay mật khẩu.',
                'Vui lòng đăng nhập lại tài khoản với mật khẩu mới.',
            ]}
            buttonText="Quay trở lại"
            onButtonPress={() => router.replace('/(auth)')}
        />
    )
}