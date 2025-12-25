import LayoutScrollApp from "@/components/LayoutScrollApp";
import TransactionTabs from "@/components/TransactionTabs";
import { AccountCard } from "@/components/account/Layer";
import DefaultColor from "@/components/ui/DefaultColor";
import { useGetAccountActive } from "@/services/account/hook";
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";

export default function AccountTabScreen() {
  const queryAccountActive = useGetAccountActive();

  useEffect(() => {
    if (queryAccountActive.error) {
      showMessage({
        message: "Không thể lấy thông tin tài khoản hoạt động",
        description: "Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.",
        type: "danger",
        duration: 3000,
      });
    }
  }, [queryAccountActive.error]);

  const activeAccount = queryAccountActive.account;
  return (
    <LayoutScrollApp
      title="Tài khoản"
      style={{ backgroundColor: DefaultColor.white }}
    >
      <AccountCard
        account={activeAccount}
        loading={queryAccountActive.loading}
      />
      <TransactionTabs account={queryAccountActive.account} showTotal={true} />
    </LayoutScrollApp>
  );
}
