import DefaultColor from "@/components/ui/DefaultColor";
import {Tabs} from "expo-router";
import {BlurView} from "expo-blur";
import {appTabStyle} from "@/components/ui/DefaultStyle";
import {FontAwesome6,  FontAwesome5} from "@expo/vector-icons";

export default function AppTabLayout(){
    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: DefaultColor.primary_color,
                tabBarBackground: () => (
                    <BlurView
                        intensity={100}
                        tint={'extraLight'}
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                        }}
                    />
                ),
                tabBarItemStyle: {
                },
                tabBarLabelStyle: {
                },
                tabBarStyle: appTabStyle.tabBarStyle,
                sceneStyle: {
                    backgroundColor: DefaultColor.white
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: (props) =>
                        <FontAwesome5 name="home" size={props.size} color={props.color} />
                }}
            />
            <Tabs.Screen
                name="trade"
                options={{
                    title: 'Giao dịch',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="money-bill-trend-up" size={props.size} color={props.color} />
                }}
            />
            <Tabs.Screen
                name="new"
                options={{
                    title: 'Ví',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="wallet" size={props.size} color={props.color} />
                }}
            />
            <Tabs.Screen
                name="info"
                options={{
                    title: 'Hồ sơ',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="user-large" size={props.size}  color={props.color} />,
                }}
            />
        </Tabs>
    )
}