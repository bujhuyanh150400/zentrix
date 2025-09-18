import {FC, useState} from "react";
import {NewContent} from "@/services/new/@types";
import {Image, StyleSheet, TouchableOpacity} from "react-native";
import {sizeDefault} from "@/components/ui/DefaultStyle";
import DefaultColor from "@/components/ui/DefaultColor";
import {router} from "expo-router";
import {Paragraph, YStack} from "tamagui";
import {removeHTMLTags} from "@/libs/utils";
import SkeletonFade from "@/components/SkeletonFade";

type Props = {
    item?: NewContent
}

const CardNews: FC<Props> = ({item}) => {
    const [imageError, setImageError] = useState(false);

    const imageSource = imageError || !item?.image ? require('@/assets/images/no_image.png') : {uri: item.image};

    return (
        <TouchableOpacity style={styles.card} onPress={() => {
            if (item) {
                router.push(`/(app)/(new)/${item.slug}`)
            }
        }}>
            <YStack gap={"$2"} style={styles.textContainer}>
                {item ?
                    <>
                        <Paragraph style={styles.title} numberOfLines={1}>{item.title}</Paragraph>
                        <Paragraph style={styles.summary}
                                   numberOfLines={1}>{removeHTMLTags(item.summary).slice(0, 50)}</Paragraph>
                        <Paragraph style={styles.date}
                                   numberOfLines={1}>{new Date(item.published_at).toLocaleDateString()}</Paragraph>
                    </>

                    :
                    <>
                        <SkeletonFade width={150}/>
                        <SkeletonFade/>
                    </>
                }
            </YStack>
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode={"cover"}
                onError={() => {
                    setImageError(true);
                }}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderBottomWidth: 0.5,
        borderBottomColor: DefaultColor.slate[400],
        paddingBottom: 15,
        marginBottom: 15,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        gap: 10,
        maxWidth: '100%',
    },
    image: {
        flex: 0,  // Ensure image stays within its container
        height: 80,
        width: 100,
        borderRadius: 8,
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


export default CardNews;