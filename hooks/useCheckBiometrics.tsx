import {useCallback, useEffect, useState} from "react";
import * as LocalAuthentication from "expo-local-authentication";


const useCheckBiometrics = () => {
    const [hasBiometrics, setHasBiometrics] = useState<boolean>(false);

    const checkBiometrics = useCallback(async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setHasBiometrics(hasHardware && isEnrolled);
    }, []);

    useEffect(() => {
        checkBiometrics().catch();
    }, [checkBiometrics]);

    return hasBiometrics;
}

export default useCheckBiometrics;
