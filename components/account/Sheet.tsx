import {Dispatch, forwardRef, ReactNode, SetStateAction, useEffect, useImperativeHandle, useRef} from "react";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {useNavigation} from "expo-router";


type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode
}

const AccountSheet = forwardRef<BottomSheet, Props>(({ open, setOpen, children }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const navigation = useNavigation();

    useImperativeHandle(ref, () => bottomSheetRef.current!, []);

    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: open ? { display: 'none' } : undefined,
        });
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    return (
        <BottomSheet
            index={-1}
            containerStyle={{
                zIndex: 100_000,
            }}
            ref={bottomSheetRef}
            onClose={() => {
                setOpen(false)
            }}
            handleComponent={() => null}
            enablePanDownToClose={false}
            enableContentPanningGesture={false}
            enableHandlePanningGesture={false}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.5}
                    pressBehavior="close"
                />
            )}
        >
            <BottomSheetView style={{ flex: 1}}>
                {children}
            </BottomSheetView>
        </BottomSheet>
    );
});
AccountSheet.displayName = 'AccountSheet';

export default AccountSheet;