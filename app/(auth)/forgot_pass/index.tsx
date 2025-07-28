import {ForgotPasswordRequest} from "@/services/auth/@type";
import {useApiErrorHandler} from "@/hooks/useHandleError";
import {useFormForgotPassword, useMutationForgotPassword} from "@/services/auth/hook";
import {useForgotPassStore} from "@/services/auth/store";
import {router} from "expo-router";


export default function ForgotPasswordScreen() {

    const handleErrorApi = useApiErrorHandler<ForgotPasswordRequest>();

    const {control, handleSubmit, formState: {errors, isSubmitting}, setError, reset, getValues} = useFormForgotPassword();

    const setEmail = useForgotPassStore(s => s.setEmail)

    const { mutate, isPending } = useMutationForgotPassword({
        onSuccess: async () => {
            const form = getValues();
            setEmail(form.email)
            reset();
            router.replace('/(auth)/verifyCodeForgotPass')
        },
        onError: (error) => {
            handleErrorApi({error, setError});
        }
    })

}