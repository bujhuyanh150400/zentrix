import {Alert} from "react-native";


export const maintainWarning = () => {
    Alert.alert(
        "Thông báo",
        "Chức năng này đang được phát triển, vui lòng quay lại sau.",
        [{text: "OK"}]
    );
}