import {Card, Image, Paragraph, View, XStack, YStack} from "tamagui";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {APP_NAME} from "@/libs/constant_env";
import DefaultColor from "@/components/ui/DefaultColor";
import {Dimensions, TouchableOpacity, ImageBackground, Text} from "react-native";
import {FontAwesome, FontAwesome5} from '@expo/vector-icons';
import Carousel, {Pagination} from "react-native-reanimated-carousel";
import {useSharedValue} from "react-native-reanimated";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import {useQueryListAssetTradingParams} from "@/services/assest_trading/hook";
import CardTrade from "@/components/trade/CardTrade";
import SkeletonFade from "@/components/SkeletonFade";
import {useNewsListQuery} from "@/services/new/hook";
import CardNews from "@/components/news/CardNews";
import {router} from "expo-router";
import {maintainWarning} from "@/hooks/reuseFunc";

const {width} = Dimensions.get('window');


const bannersTest = [
    {title: 'Banner'},
    {title: 'Banner'},
    {title: 'Banner'},
    {title: 'Banner'},
    {title: 'Banner'},
    {title: 'Banner'},
]

export default function HomeTabScreen() {
    const progress = useSharedValue<number>(0);
    const queryAssetTrading = useQueryListAssetTradingParams({
        limit: 5
    });
    const queryNewList = useNewsListQuery({
        limit: 5
    })
    const AssetTradingData = queryAssetTrading.data?.data
    const newsData = queryNewList.data

    return (
        <LayoutScrollApp>
            {/*Header*/}
            <XStack justifyContent={"space-between"} alignItems={"center"} marginBottom={16}>
                <XStack alignItems={"center"}>
                    <Image
                        source={require('@/assets/images/zentrix_logo.png')}
                        width={80}
                        height={80}
                        objectFit={"cover"}
                    />
                    <YStack>
                        <Paragraph textTransform={"uppercase"} fontWeight={700} fontSize={20}
                                   color={DefaultColor.primary_color}>{APP_NAME}</Paragraph>
                        <Paragraph textTransform={"uppercase"} fontWeight={700} fontSize={12}
                                   color={DefaultColor.black}>Giao dịch không giới hạn</Paragraph>
                    </YStack>
                </XStack>
                <XStack alignItems={"center"} gap="$4">
                    <TouchableOpacity
                        onPress={() => maintainWarning()}
                        style={{
                            position: "relative"
                        }}
                    >
                        <FontAwesome name="bell" size={25} color={DefaultColor.red["500"]}/>
                        <View position={"absolute"} width={24} height={24} alignItems={"center"}
                              padding={1}
                              justifyContent={"center"} top={-12} right={-8} backgroundColor={DefaultColor.green["500"]}
                              borderRadius={"100%"}>
                            <Paragraph color={DefaultColor.white} fontSize={12}>0</Paragraph>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            router.push("/(app)/(info)/support/create/stepOne");
                        }}
                        style={{
                            position: "relative"
                        }}
                    >
                        <FontAwesome5 name="headset" size={25} color={DefaultColor.slate["500"]}/>
                    </TouchableOpacity>

                </XStack>
            </XStack>

            {/* Banner */}
            <View alignItems={"center"} justifyContent={"center"} position={"relative"} height={"fit"}
                  marginBottom={16}>
                <Carousel
                    loop={true}
                    autoPlay={true}
                    autoPlayInterval={10000}
                    width={width}
                    height={145}
                    data={bannersTest}
                    scrollAnimationDuration={200}
                    onProgressChange={progress}
                    renderItem={({item}) => (
                        <View flex={1} alignItems={"center"} justifyContent={"center"}>
                            <Image
                                source={require('@/assets/images/demo-banner.png')}
                                width={width - 32}
                                height={145}
                                borderRadius={12}
                                objectFit={"cover"}
                            />
                        </View>
                    )}
                />
                <Pagination.Basic
                    progress={progress}
                    data={bannersTest}
                    size={8}
                    dotStyle={{
                        borderRadius: 100,
                        backgroundColor: DefaultColor.slate[200],
                    }}
                    activeDotStyle={{
                        borderRadius: 100,
                        overflow: "hidden",
                        backgroundColor: DefaultColor.primary_color,
                    }}
                    containerStyle={{
                        gap: 5,
                        marginBottom: 10,
                        position: "absolute",
                        bottom: 0
                    }}
                    horizontal
                />
            </View>

            {/*Action*/}
            <Card flexDirection={"row"} marginBottom={20} alignItems={"center"} justifyContent={"space-between"}
                  paddingHorizontal={17} paddingVertical={15} backgroundColor={DefaultColor.white} style={{
                elevation: 8,
                shadowColor: '#CCCCCC',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 1,
                shadowRadius: 5,
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderTopColor: DefaultColor.slate["100"],
                borderRightColor: DefaultColor.slate["100"],
            }}
            >
                <TouchableOpacity
                    onPress={() => {
                        router.push('/(tab)/trade')
                    }}
                    style={{
                        alignItems: "center", justifyContent: "center", gap: 6
                    }}
                >
                    <Image
                        source={require('@/assets/images/logo/giao-dich.png')}
                        width={32}
                        height={32}
                        objectFit={"cover"}
                    />
                    <Paragraph>Giao dịch</Paragraph>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => maintainWarning()}
                    style={{
                        alignItems: "center", justifyContent: "center", gap: 6
                    }}
                >
                    <Image
                        source={require('@/assets/images/logo/can-ban.png')}
                        width={32}
                        height={32}
                        objectFit={"contain"}
                    />
                    <Paragraph>Căn bản</Paragraph>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => maintainWarning()}
                    style={{
                        alignItems: "center", justifyContent: "center", gap: 6
                    }}
                >
                    <Image
                        source={require('@/assets/images/logo/gioi-thieu.png')}
                        width={32}
                        height={32}
                        objectFit={"contain"}
                    />
                    <Paragraph>Giới thiệu</Paragraph>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => maintainWarning()}
                    style={{
                        alignItems: "center", justifyContent: "center", gap: 6
                    }}
                >
                    <Image
                        source={require('@/assets/images/logo/affiliate.png')}
                        width={32}
                        height={32}
                        objectFit={"contain"}
                    />
                    <Paragraph>Affiliate</Paragraph>
                </TouchableOpacity>
            </Card>

            {/*Giao dịch*/}
            <Card flex={1} marginBottom={20} paddingHorizontal={17} paddingVertical={15}
                  backgroundColor={DefaultColor.white} style={{
                elevation: 8,
                shadowColor: '#CCCCCC',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 1,
                shadowRadius: 5,
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderTopColor: DefaultColor.slate["100"],
                borderRightColor: DefaultColor.slate["100"],
            }}
            >
                <XStack justifyContent={"space-between"} alignItems={"center"} marginBottom={16}>
                    <Paragraph fontWeight={700} fontSize={sizeDefault.md}>Đề xuất</Paragraph>
                    <TouchableOpacity
                        onPress={() => {
                            queryAssetTrading.refetch();
                        }}
                        disabled={queryAssetTrading.isLoading || queryAssetTrading.isRefetching}
                        style={{
                            alignItems: "center",
                            gap: 10,
                            flexDirection: "row"
                        }}
                    >
                        {queryAssetTrading.isLoading || queryAssetTrading.isRefetching ?
                            <SkeletonFade/>
                            : <>
                                <FontAwesome name="repeat" size={sizeDefault.md} color={DefaultColor.slate["400"]}/>
                                <Paragraph fontWeight={700} color={DefaultColor.slate["400"]}
                                           fontSize={sizeDefault.base}>Reload</Paragraph>
                            </>
                        }
                    </TouchableOpacity>
                </XStack>

                <YStack gap={"$4"}>
                    {(queryAssetTrading.isLoading || queryAssetTrading.isRefetching) ?
                        <>
                            <CardTrade/>
                            <CardTrade/>
                            <CardTrade/>
                            <CardTrade/>
                        </>
                        : (AssetTradingData && AssetTradingData.length > 0 && AssetTradingData.map((symbol, index) => (
                            <CardTrade symbol={symbol} key={index} showChart={true}/>
                        )))
                    }
                </YStack>
            </Card>

            {/* banner aff */}
            <ImageBackground
                source={require('@/assets/images/bg_aff.png')}
                style={{
                    paddingHorizontal: 36,
                    paddingVertical: 24,
                    borderRadius: 10,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 10,
                    zIndex: 1,
                }}/>
                <View style={{
                    position: 'relative',
                    backgroundColor: "transparent",
                    zIndex: 2,
                }}
                >
                    <Text
                        style={{
                            color: DefaultColor.white,
                            fontSize: sizeDefault.md,
                            fontWeight: 700
                        }}
                    >
                        Thưởng khi mời bạn bè
                    </Text>
                    <XStack gap="$2" alignItems={"flex-end"} marginTop={16}>
                        <Text
                            style={{
                                color: DefaultColor.primary_color,
                                fontSize: sizeDefault["2xl"],
                                fontWeight: 700
                            }}
                        >
                            Lên tới
                        </Text>
                        <Text
                            style={{
                                color: DefaultColor.white,
                                fontSize: 40,
                                fontWeight: 700
                            }}
                        >
                            30%
                        </Text>
                        <Text
                            style={{
                                color: DefaultColor.white,
                                fontSize: sizeDefault["2xl"],
                                fontWeight: 700
                            }}
                        >
                            hoa hồng
                        </Text>
                    </XStack>
                    <TouchableOpacity
                        style={{
                            borderRadius: 12,
                            backgroundColor: DefaultColor.white,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            alignSelf: 'flex-start',
                            marginTop: 16
                        }}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={{
                                color: DefaultColor.primary_color,
                                fontSize: sizeDefault.base,
                            }}
                        >
                            Mời bạn bè ngay
                        </Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>

            {/* tin tức */}
            <YStack marginTop={20} gap={26}>
                <Text style={{fontSize: sizeDefault['3xl'], fontWeight: 700}}>Tin tức thị trường</Text>

                <Card flex={1} marginBottom={20} paddingHorizontal={17} paddingVertical={15}
                      backgroundColor={DefaultColor.white} style={{
                    elevation: 8,
                    shadowColor: '#CCCCCC',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 1,
                    shadowRadius: 5,
                    borderTopWidth: 1,
                    borderRightWidth: 1,
                    borderTopColor: DefaultColor.slate["100"],
                    borderRightColor: DefaultColor.slate["100"],
                }}>
                    {(queryNewList.isLoading || queryNewList.isRefetching) ?
                        <>
                            <CardNews/>
                            <CardNews/>
                            <CardNews/>
                            <CardNews/>
                        </>
                        : <>
                            {newsData && newsData.length > 0 && newsData.map((item, index) => (
                                <CardNews item={item} key={index}/>
                            ))}

                        </>
                    }
                </Card>
            </YStack>
        </LayoutScrollApp>
    )
}