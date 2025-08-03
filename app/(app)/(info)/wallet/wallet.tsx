import { FontAwesome6 } from "@expo/vector-icons";
import { View,  TouchableOpacity } from "react-native";
import {
  Button,
  H4,
  H5,
  Paragraph,
  Separator,
  XStack,
  YStack,
  Sheet,
} from "tamagui";
import dayjs from "dayjs";
import React, { useState } from "react";
import {TransactionStatus, WalletTransaction} from "@/services/wallet/@types";
import DefaultColor from "@/components/ui/DefaultColor";
import LayoutScrollApp from "@/components/LayoutScrollApp";

export default function WalletScreen() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const transactionData: WalletTransaction[] = [
    {
      id: 1,
      amount: 250000,
      type: "withdraw",
      createdAt: "2024-01-15T14:20:00Z",
      status: "success",
      description: "Rút tiền về tài khoản Vietcombank",
      bankName: "Vietcombank",
      accountNumber: "0123456789",
      accountName: "NGUYEN VAN A",
      transactionCode: "WD202401150001",
      fee: 5000,
    },
    {
      id: 2,
      amount: 180000,
      type: "withdraw",
      createdAt: "2024-01-14T11:30:00Z",
      status: "pending",
      description: "Rút tiền về tài khoản BIDV",
      bankName: "BIDV",
      accountNumber: "9876543210",
      accountName: "NGUYEN VAN A",
      transactionCode: "WD202401140002",
      fee: 5000,
    },
    {
      id: 3,
      amount: 500000,
      type: "withdraw",
      createdAt: "2024-01-13T09:15:00Z",
      status: "success",
      description: "Rút tiền về tài khoản Techcombank",
      bankName: "Techcombank",
      accountNumber: "1234567890",
      accountName: "NGUYEN VAN A",
      transactionCode: "WD202401130003",
      fee: 5000,
    },
    {
      id: 4,
      amount: 320000,
      type: "withdraw",
      createdAt: "2024-01-12T16:45:00Z",
      status: "failed",
      description: "Rút tiền thất bại - Thông tin tài khoản không chính xác",
      bankName: "ACB",
      accountNumber: "5555666677",
      accountName: "NGUYEN VAN A",
      transactionCode: "WD202401120004",
      fee: 0,
      failReason: "Thông tin tài khoản ngân hàng không chính xác",
    },
    {
      id: 5,
      amount: 150000,
      type: "withdraw",
      createdAt: "2024-01-11T10:30:00Z",
      status: "success",
      description: "Rút tiền về tài khoản ACB",
      bankName: "ACB",
      accountNumber: "1111222233",
      accountName: "NGUYEN VAN A",
      transactionCode: "WD202401110005",
      fee: 5000,
    },
  ];

  const getTransactionColor = (status: TransactionStatus) => {
    if (status === "success") return DefaultColor.green[500]; // Green for success
    if (status === "failed") return DefaultColor.red[500]; // Red for failed
    if (status === "pending") return DefaultColor.yellow[500]; // Orange for pending
    return "gray"; // Default gray
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case "success":
        return "Thành công";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  const formatAmount = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat("vi-VN").format(amount);
    return `-${formattedAmount} VND`;
  };

  const handleTransactionPress = (item: WalletTransaction) => {
    setSelectedTransaction(item);
    setSheetOpen(true);
  };

  const renderTransactionItem = (item: WalletTransaction) => {
    const iconColor = getTransactionColor(item.status);
    const statusText = getStatusText(item.status);
    const formattedAmount = formatAmount(item.amount);

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleTransactionPress(item)}
        style={{ marginBottom: 12 }}
      >
        <XStack
          alignItems="center"
          backgroundColor="white"
          borderRadius={12}
          padding={16}
          borderWidth={1}
          borderColor="#E5E7EB"
        >
          {/* Icon */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${iconColor}20`,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <FontAwesome6 name="arrow-up" size={20} color={iconColor} />
          </View>

          {/* Content */}
          <YStack flex={1} gap={4}>
            <XStack justifyContent="space-between" alignItems="center">
              <Paragraph fontWeight="600" fontSize={16}>
                Rút tiền
              </Paragraph>
              <Paragraph fontWeight="700" fontSize={16} color={iconColor}>
                {formattedAmount}
              </Paragraph>
            </XStack>

            <Paragraph
              fontSize={14}
              color="gray"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Paragraph>

            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginTop={4}
            >
              <Paragraph fontSize={12} color="#9CA3AF">
                {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
              </Paragraph>
              <XStack alignItems="center" gap={4}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: iconColor,
                  }}
                />
                <Paragraph fontSize={12} color={iconColor} fontWeight="500">
                  {statusText}
                </Paragraph>
              </XStack>
            </XStack>
          </YStack>

          {/* Arrow indicator */}
          <FontAwesome6
            name="chevron-right"
            size={16}
            color="#9CA3AF"
            style={{ marginLeft: 8 }}
          />
        </XStack>
      </TouchableOpacity>
    );
  };
  return (
    <LayoutScrollApp>
      <YStack gap={16} padding={16}>
        {/* Header Section */}
        <XStack alignItems="center" justifyContent="space-between">
          <H4 fontWeight="bold">Ví tiền</H4>
        </XStack>

        {/* Balance Card */}
        <YStack marginTop={16}>
          <Paragraph color="gray" fontSize={16} marginBottom={8}>
            Tổng số dư
          </Paragraph>
          <H5 fontWeight="bold" marginBottom={16}>
            100.000.000 VND
          </H5>

          <Button theme="yellow" size="$4" borderRadius={8}>
            <FontAwesome6 name="money-bill-wave" size={16} />
            <Paragraph fontSize={14} fontWeight="bold">
              Rút tiền
            </Paragraph>
          </Button>
        </YStack>

        <Separator marginVertical={8} />

        {/* Transaction History */}
        <YStack gap={4}>
          <XStack justifyContent="space-between" alignItems="center">
            <Paragraph fontWeight="bold" fontSize={18}>
              Lịch sử giao dịch
            </Paragraph>
          </XStack>
          <YStack gap={0} marginTop={16}>
            {transactionData.map(renderTransactionItem)}
          </YStack>
        </YStack>
      </YStack>

      {/* Transaction Detail Bottom Sheet */}
      <Sheet
        modal
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        snapPoints={[100]}
        position={0}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame padding={0} backgroundColor="white">
          <Sheet.ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack gap={20}>
              {/* Header */}
              <XStack
                alignItems="center"
                justifyContent="space-between"
                marginTop={30}
              >
                <H4 fontWeight="bold">Chi tiết giao dịch</H4>
                <TouchableOpacity onPress={() => setSheetOpen(false)}>
                  <FontAwesome6 name="circle-xmark" size={20} />
                </TouchableOpacity>
              </XStack>

              {selectedTransaction && (
                <>
                  {/* Status Badge */}
                  <XStack alignItems="center" justifyContent="center">
                    <YStack
                      alignItems="center"
                      backgroundColor={`${getTransactionColor(
                        selectedTransaction.status
                      )}20`}
                      padding={16}
                      borderRadius={12}
                      borderWidth={2}
                      borderColor={getTransactionColor(
                        selectedTransaction.status
                      )}
                    >
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          backgroundColor: getTransactionColor(
                            selectedTransaction.status
                          ),
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <FontAwesome6 name="arrow-up" size={24} color="white" />
                      </View>
                      <Paragraph
                        fontWeight="bold"
                        fontSize={18}
                        color={getTransactionColor(selectedTransaction.status)}
                      >
                        {formatAmount(selectedTransaction.amount)}
                      </Paragraph>
                      <Paragraph
                        fontSize={14}
                        color={getTransactionColor(selectedTransaction.status)}
                        fontWeight="500"
                      >
                        {getStatusText(selectedTransaction.status)}
                      </Paragraph>
                    </YStack>
                  </XStack>

                  {/* Transaction Details */}
                  <YStack gap={16}>
                    <YStack gap={8}>
                      <Paragraph color="gray" fontSize={12} fontWeight="500">
                        MÃ GIAO DỊCH
                      </Paragraph>
                      <Paragraph fontSize={16} fontWeight="600">
                        {selectedTransaction.transactionCode}
                      </Paragraph>
                    </YStack>

                    <YStack gap={8}>
                      <Paragraph color="gray" fontSize={12} fontWeight="500">
                        THỜI GIAN
                      </Paragraph>
                      <Paragraph fontSize={16} fontWeight="600">
                        {dayjs(selectedTransaction.createdAt).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )}
                      </Paragraph>
                    </YStack>

                    <YStack gap={8}>
                      <Paragraph color="gray" fontSize={12} fontWeight="500">
                        NGÂN HÀNG
                      </Paragraph>
                      <Paragraph fontSize={16} fontWeight="600">
                        {selectedTransaction.bankName}
                      </Paragraph>
                    </YStack>

                    <YStack gap={8}>
                      <Paragraph color="gray" fontSize={12} fontWeight="500">
                        SỐ TÀI KHOẢN
                      </Paragraph>
                      <Paragraph fontSize={16} fontWeight="600">
                        {selectedTransaction.accountNumber}
                      </Paragraph>
                    </YStack>

                    <YStack gap={8}>
                      <Paragraph color="gray" fontSize={12} fontWeight="500">
                        TÊN TÀI KHOẢN
                      </Paragraph>
                      <Paragraph fontSize={16} fontWeight="600">
                        {selectedTransaction.accountName}
                      </Paragraph>
                    </YStack>

                    <Separator />

                    <XStack justifyContent="space-between" alignItems="center">
                      <Paragraph color="gray" fontSize={14}>
                        Số tiền rút
                      </Paragraph>
                      <Paragraph fontSize={16} fontWeight="600">
                        {new Intl.NumberFormat("vi-VN").format(
                          selectedTransaction.amount
                        )}{" "}
                        VND
                      </Paragraph>
                    </XStack>

                    <XStack justifyContent="space-between" alignItems="center">
                      <Paragraph color="gray" fontSize={14}>
                        Phí giao dịch
                      </Paragraph>
                      <Paragraph
                        fontSize={16}
                        fontWeight="600"
                        color={DefaultColor.red[500]}
                      >
                        {selectedTransaction.fee
                          ? `${new Intl.NumberFormat("vi-VN").format(
                              selectedTransaction.fee
                            )} VND`
                          : "Miễn phí"}
                      </Paragraph>
                    </XStack>

                    <Separator />

                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      marginBottom={30}
                    >
                      <Paragraph fontSize={16} fontWeight="bold">
                        Tổng tiền thực nhận
                      </Paragraph>
                      <Paragraph
                        fontSize={18}
                        fontWeight="bold"
                        color={getTransactionColor(selectedTransaction.status)}
                      >
                        {new Intl.NumberFormat("vi-VN").format(
                          selectedTransaction.amount -
                            (selectedTransaction.fee || 0)
                        )}{" "}
                        VND
                      </Paragraph>
                    </XStack>

                    {selectedTransaction.status === "failed" &&
                      selectedTransaction.failReason && (
                        <YStack
                          gap={8}
                          backgroundColor="#FEF2F2"
                          padding={12}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor="#FECACA"
                          marginBottom={20}
                        >
                          <Paragraph
                            color="#EF4444"
                            fontSize={12}
                            fontWeight="500"
                          >
                            LÝ DO THẤT BẠI
                          </Paragraph>
                          <Paragraph fontSize={14} color="#DC2626">
                            {selectedTransaction.failReason}
                          </Paragraph>
                        </YStack>
                      )}
                  </YStack>
                </>
              )}
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </LayoutScrollApp>
  );
}
