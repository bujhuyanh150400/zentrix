import useNestedState from "@/hooks/useNestedState";
import {_TypeNewContent, NewContent, NewListRequest} from "@/services/new/@types";
import {useInfiniteNewsContentQuery} from "@/services/new/hook";
import { H6, Paragraph,  YStack} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import HorizontalTabBar from "@/components/HorizontalTabBar";
import {ActivityIndicator, FlatList, TouchableOpacity, View, Image, StyleSheet, Text} from "react-native";
import {RefreshControl} from "react-native-gesture-handler";
import {FC, useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {removeHTMLTags} from "@/libs/utils";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import {router} from "expo-router";

export default function NewScreen() {
    const insets = useSafeAreaInsets();

    const [filter, setFilter] = useNestedState<NewListRequest>({
        type: _TypeNewContent.NEWS,
        page: 1,
    })

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useInfiniteNewsContentQuery(filter);

    const flatData = data?.pages.flatMap((page) => page.data) || [];

    return (
        <YStack flex={1} gap={"$2"} paddingHorizontal={"$4"} paddingTop={insets.top}>
            <H6 paddingVertical={12} fontWeight={700}>Tin tức</H6>
            <View style={{marginBottom: 12}}>
                <HorizontalTabBar<_TypeNewContent>
                    tabs={[
                        {
                            key: _TypeNewContent.NEWS,
                            item: (isActive) => (
                                <Paragraph
                                    style={{
                                        color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                        fontWeight: isActive ? 700 : 'normal'
                                    }}
                                >
                                    Tin tức
                                </Paragraph>
                            ),
                        },
                        {
                            key: _TypeNewContent.POST,
                            item: (isActive) => (
                                <Paragraph
                                    style={{
                                        color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                        fontWeight: isActive ? 700 : 'normal'
                                    }}
                                >
                                    Bài viết
                                </Paragraph>
                            ),
                        },
                        {
                            key: _TypeNewContent.POLICY,
                            item: (isActive) => (
                                <Paragraph
                                    style={{
                                        color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                        fontWeight: isActive ? 700 : 'normal'
                                    }}
                                >
                                    Chính sách
                                </Paragraph>
                            ),
                        },
                    ]}
                    activeKey={filter.type}
                    onTabPress={(type) => {
                        setFilter({type: type});
                        refetch();
                    }}
                />
            </View>
            <View style={{flex: 1}}>
                <FlatList
                    style={{
                        flex: 1,
                        paddingBottom:insets.bottom + 40
                    }}
                    data={flatData}
                    keyExtractor={(item) => String(item.id)}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => {
                        if (!isFetchingNextPage) return null;
                        return <ActivityIndicator style={{marginVertical: 10}}/>;
                    }}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}/>
                    }
                    renderItem={({item, index}) => (
                        <>
                            <CardNewContent item={item} key={index} />
                        </>
                    )}
                    ListEmptyComponent={() => (
                        <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center"
                                justifyContent="center" gap="$4">
                            <Paragraph fontWeight="bold" theme="alt2">Không có bài viết mới nào</Paragraph>
                            <Paragraph textAlign="center" theme="alt2">Tìm hiểu tin tức thị trường thông qua những bài viết, tin tức mới nhất</Paragraph>
                        </YStack>
                    )}
                />
            </View>
        </YStack>
    )
}

const CardNewContent: FC<{ item: NewContent }> = ({item}) => {
    const [imageError, setImageError] = useState(false);

    const fallbackImage = require('@/assets/images/no_image.png');

    const imageSource = imageError || !item.image ? fallbackImage : { uri: item.image };

    return (
        <TouchableOpacity style={styles.card} onPress={() => {
            router.push(`/(app)/(new)/${item.slug}`)
        }}>
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode={"cover"}
                onError={() => {
                    setImageError(true);
                }}
            />
            <YStack gap={"$2"} style={styles.textContainer}>
                <Paragraph style={styles.title} numberOfLines={1}>{item.title}</Paragraph>
                <Paragraph style={styles.summary} numberOfLines={1}>{removeHTMLTags(item.summary).slice(0, 50)}</Paragraph>
                <Paragraph style={styles.date} numberOfLines={1}>{new Date(item.published_at).toLocaleDateString()}</Paragraph>
            </YStack>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 0.5,
        borderRadius: 10,
        marginBottom: 10,
        padding: 8,
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        maxWidth: '100%',  // Ensure card doesn't exceed screen width
    },
    image: {
        flex: 0,  // Ensure image stays within its container
        height: 80,
        width: 80,
        borderRadius: 8,
        borderWidth: 1
    },
    textContainer: {
        flex: 1,
        flexShrink: 1,
    },
    title: {
        fontSize: sizeDefault.lg,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    summary: {
        fontSize: sizeDefault.sm,
        color: DefaultColor.slate[500],
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    date: {
        fontSize: sizeDefault.sm,
        color: DefaultColor.slate[400],
    },
});