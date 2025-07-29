import {View} from "react-native";
import {useGetAccountActive} from "@/services/account/hook";
import TransactionTabs from "@/components/TransactionTabs";


export default function TransactionScreen () {
    const {account} =  useGetAccountActive();

    return (
        <View style={{flex: 1, padding: 20, paddingTop: 0,}}>
            <TransactionTabs account={account} showTotal={true} allowScroll={true}/>
        </View>
    )
}