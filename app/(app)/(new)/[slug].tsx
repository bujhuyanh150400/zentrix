import { useLocalSearchParams} from "expo-router";
import {useNewDetailQuery} from "@/services/new/hook";
import {useEffect, useMemo, useState} from "react";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {Paragraph, Separator, XStack, YStack} from "tamagui";
import {Image, Text, useWindowDimensions} from "react-native";
import {useAppStore} from "@/services/app/store";
import RenderHtml from 'react-native-render-html';
import {sizeDefault} from "@/components/ui/DefaultStyle";
import DefaultColor from "@/components/ui/DefaultColor";


export default function SlugScreen(){
    const { slug } = useLocalSearchParams<{slug?:string}>();
    const query = useNewDetailQuery({slug: slug || ''});
    const [imageError, setImageError] = useState(false);
    const setLoading = useAppStore(state => state.setLoading);

    useEffect(() => {
        setLoading(query.isLoading || query.isRefetching);
    }, [query.isLoading, query.isRefetching]);

    useEffect(() => {
        if (slug){
            query.refetch();
        }
    }, [slug]);

    const item = useMemo(() => query.data,[query.data]);

    const imageSource = useMemo(() => imageError || !item?.image ? require('@/assets/images/no_image.png') : { uri: item.image }, [item]);


    return (
        <LayoutScrollApp>
            <>
                {item &&
                    <YStack gap={"$2"}>
                        <Text
                            style={{
                                fontSize: sizeDefault["4xl"],
                                fontWeight: 700
                            }}
                        >{item.title}</Text>
                        <Image
                            source={imageSource}
                            style={{
                                width: "100%",
                                height: 200,
                                borderRadius: 8
                            }}
                            resizeMode={"cover"}
                            onError={() => {
                                setImageError(true);
                            }}
                        />
                        <XStack gap={"$1"}>
                            <Paragraph color={DefaultColor.slate[500]}>{new Date(item.published_at).toLocaleDateString()}, </Paragraph>
                            <Paragraph color={DefaultColor.slate[500]}>Bởi {item.author}</Paragraph>
                        </XStack>
                        <RenderHtml
                            source={{ html: item.summary }}
                        />
                        <Separator marginVertical={20}/>
                        <RenderHtml
                            source={{ html: item.content }}
                        />
                    </YStack>
                }
            </>

        </LayoutScrollApp>
    )
}