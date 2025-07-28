import {useFocusEffect, useNavigation} from "expo-router";
import {useCallback} from "react";

/**
 * Ngăn hành vi vuốt về
 * @param enabled
 */
export default function useDisableBackGesture(enabled = true) {
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({ gestureEnabled: !enabled });

            return () => {
                navigation.setOptions({ gestureEnabled: true });
            };
        }, [navigation, enabled])
    );
}
