import { useQueryGetUserProfile } from "@/services/auth/hook";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React, { FC, useCallback } from "react";
import {
  Alert,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IUserProfile {
  referral_code?: string;
}

const AffiliateScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const { data } = useQueryGetUserProfile();
  const userProfile = data as IUserProfile | null;

  const referralCode = userProfile?.referral_code ?? "";

  // Copy vào clipboard
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert("Thành công", `Đã sao chép ${label} vào bộ nhớ tạm!`);
  }, []);

  // Chia sẻ
  const onShare = useCallback(async () => {
    if (!referralCode) return;

    try {
      await Share.share({
        message: `Tham gia cùng tôi trên ứng dụng này! Sử dụng mã: ${referralCode}`,
      });
    } catch (error: any) {
      console.log(error?.message);
    }
  }, [referralCode]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giới thiệu bạn bè</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Banner */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/affliate1.jpg")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Giới thiệu bạn bè</Text>
      <Text style={styles.subtitle}>
        Chia sẻ mã giới thiệu của bạn để nhận những phần quà hấp dẫn từ chúng
        tôi.
      </Text>

      {/* Card mã giới thiệu */}
      <View style={styles.card}>
        <Text style={styles.label}>Mã giới thiệu của bạn</Text>
        <View style={styles.row}>
          <Text style={styles.codeText}>{referralCode || "---"}</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(referralCode, "mã giới thiệu")}
          >
            <Ionicons name="copy-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Share button */}
      <TouchableOpacity style={styles.shareButton} onPress={onShare}>
        <Ionicons name="share-social-outline" size={18} color="#fff" />
        <Text style={styles.shareButtonText}>Chia sẻ ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AffiliateScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  image: {
    width: 300,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  shareButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 30,
    gap: 8,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
