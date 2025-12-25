import DefaultColor from "@/components/ui/DefaultColor";
import { sizeDefault } from "@/components/ui/DefaultStyle";
import useDisableBackGesture from "@/hooks/useDisableBackGesture";
import { APP_NAME } from "@/libs/constant_env";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { Paragraph } from "tamagui";

export default function OnboardScreen() {
  // chặn hành vi vuốt về
  useDisableBackGesture();

  return (
    <View style={styles.container}>
      <Image
        style={styles.video}
        source={require("@/assets/images/backgroud.jpg")}
        resizeMode="cover"
      />
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.app_name}>{APP_NAME}</Text>
        <Text style={styles.header}>
          Sẵn sàng để thay đổi cách bạn kiếm tiền?
        </Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: DefaultColor.primary_color,
            },
          ]}
          onPress={() => {
            router.push("/(auth)/login");
          }}
        >
          <Paragraph
            style={{
              fontSize: sizeDefault["lg"],
              fontWeight: 500,
              color: DefaultColor.white,
            }}
          >
            Đăng nhập
          </Paragraph>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: DefaultColor.white,
            },
          ]}
          onPress={() => {
            router.push("/(auth)/register");
          }}
        >
          <Paragraph style={{ fontSize: sizeDefault["lg"], fontWeight: 500 }}>
            Đăng ký
          </Paragraph>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  app_name: {
    fontSize: sizeDefault["3xl"],
    fontWeight: "900",
    textTransform: "uppercase",
    color: "white",
    marginBottom: 20,
  },
  header: {
    fontSize: sizeDefault["4xl"],
    fontWeight: "900",
    textTransform: "uppercase",
    color: "white",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  button: {
    padding: 10,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
