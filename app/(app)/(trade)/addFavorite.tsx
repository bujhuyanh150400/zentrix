import {useMutationAddFavoriteSymbol} from "@/services/assest_trading/hook";
import {useAppStore} from "@/services/app/store";
import {useEffect} from "react";
import {router} from "expo-router";
import {useShowErrorHandler} from "@/hooks/useHandleError";
import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native";
import {SearchSymbolList} from "@/app/(app)/(trade)/search";


export default function AddFavoriteScreen () {

    const setLoading = useAppStore(state => state.setLoading);

    const {mutate, isPending} = useMutationAddFavoriteSymbol({
        onSuccess: async () => {
            router.replace("/(app)/(trade)/editFavorite")
        },
        onError: (error) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useShowErrorHandler(error);
        }
    });

    useEffect(() => {
        setLoading(isPending);
    }, [isPending, setLoading]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SearchSymbolList onPressItem={(item) => {
                    mutate({asset_trading_id: item.id})
                }}/>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}