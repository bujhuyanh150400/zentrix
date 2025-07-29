import React from 'react';
import { Image, ImageStyle, View  } from 'react-native';
import DefaultColor from "@/components/ui/DefaultColor";



const ICONS: Record<string, any> = {
    btc: require('@/assets/images/symbol/bitcoin.png'),
    bitcoin: require('@/assets/images/symbol/bitcoin.png'),
    eth: require('@/assets/images/symbol/eth.png'),
    ethereum: require('@/assets/images/symbol/eth.png'),
    xau: require('@/assets/images/symbol/xau.png'),
    gold: require('@/assets/images/symbol/xau.png'),
    xag: require('@/assets/images/symbol/xag.png'),
    silver: require('@/assets/images/symbol/xag.png'),
    tether: require('@/assets/images/symbol/tether.png'),
    usdt: require('@/assets/images/symbol/tether.png'),
    usd: require('@/assets/images/symbol/united-states.png'),
    'united states': require('@/assets/images/symbol/united-states.png'),
    vnd: require('@/assets/images/symbol/vietnam-flag-icon.png'),
    vietnam: require('@/assets/images/symbol/vietnam-flag-icon.png'),
    aud: require('@/assets/images/symbol/australia.png'),
    australia: require('@/assets/images/symbol/australia.png'),
    gbp: require('@/assets/images/symbol/brit.png'),
    brit: require('@/assets/images/symbol/brit.png'),
    'united kingdom': require('@/assets/images/symbol/brit.png'),
    cad: require('@/assets/images/symbol/canada.png'),
    canada: require('@/assets/images/symbol/canada.png'),
    cny: require('@/assets/images/symbol/china.png'),
    china: require('@/assets/images/symbol/china.png'),
    eu: require('@/assets/images/symbol/eu.png'),
    euro: require('@/assets/images/symbol/eu.png'),
    jpy: require('@/assets/images/symbol/jpy.png'),
    japan: require('@/assets/images/symbol/jpy.png'),
    thb: require('@/assets/images/symbol/thailand.png'),
    thailand: require('@/assets/images/symbol/thailand.png'),
    oil: require('@/assets/images/symbol/oil-barrel.png'),
    gas: require('@/assets/images/symbol/gas-fuel.png'),
    bnb: require('@/assets/images/symbol/bnb.png'),
};

const KEYWORD_MAP: Record<string, string> = {
    'crudeoil': 'oil',
    'brent': 'oil',
    'naturalgas': 'gas',
    'gasoline':'gas',
    'gas': 'gas',
    'gold': 'xau',
    'gau': 'xau',
    'xagg':'xag',
    'silver': 'xag',
    'bitcoin': 'btc',
    'ethereum': 'eth',
    'tether': 'usdt',
    'usdt': 'usdt',
    'usdc': 'usdt',
    'bnb':'bnb',
    'usd': 'usd',
    'us dollar': 'usd',
    'unitedstates': 'usd',
    'vnd': 'vnd',
    'vietnam': 'vnd',
    'aud': 'aus',
    'australia': 'aus',
    'cad': 'canada',
    'canadian dollar': 'canada',
    'canada': 'canada',
    'gbp': 'brit',
    'unitedkingdom': 'brit',
    'britishpound': 'brit',
    'eur': 'eu',
    'euro': 'eu',
    'cny': 'china',
    'china': 'china',
    'jpy': 'jpy',
    'japanese yen': 'jpy',
    'thb': 'thailand',
    'thailand': 'thailand',
};


type PropsSymbolIcon= {
    keyword?: string;
    keywordOptions?: (string | undefined)[];
    size?: number;
    style?: ImageStyle;
};

const normalize = (str: string): string =>
    str.trim().toLowerCase();

const getIconFromKeywords = (keywords: (string | undefined)[]): any => {
    for (const k of keywords) {
        if (!k) continue;
        // Normalize và split thành các từ nhỏ
        const words = normalize(k).split(/[\s\-]+/); // tách theo dấu cách/gạch ngang
        for (const word of words) {
            const mapped = KEYWORD_MAP[word] || word;
            if (ICONS[mapped]) return ICONS[mapped];
        }

        // Nếu nguyên cụm map được thì vẫn thử lần cuối
        const mappedFull = KEYWORD_MAP[normalize(k)] || normalize(k);
        if (ICONS[mappedFull]) return ICONS[mappedFull];
    }

    return null;
};
const SymbolIcon: React.FC<PropsSymbolIcon> = ({ keyword, keywordOptions, size = 24, style }) => {
    const icon = getIconFromKeywords(keywordOptions ?? [keyword]);

    return (
        <>
            {icon ?
                <Image
                    source={icon}
                    style={[
                        {
                            width: size,
                            height: size,
                            resizeMode: 'cover',
                            borderRadius: size / 2,
                        },
                        style,
                    ]}
                />
                : <View
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: DefaultColor.slate[300],
                        borderWidth: 1,
                        borderColor: DefaultColor.slate[200],
                    }}
                />
            }
        </>

    );
};


type PropsAssetIcons = {
    symbol: string;
    currency_base?: string;
    currency_quote?: string;
    size?: number;
};

const parseSymbol = (symbol: string): { base: string; quote: string } => {
    const [base, quote] = symbol.toUpperCase().split(/[\/\-]/);
    return { base, quote };
};

const SymbolAssetIcons: React.FC<PropsAssetIcons> = ({ symbol, currency_base, currency_quote, size = 20 }) => {
    const { base, quote } = parseSymbol(symbol);
    return (
        <View style={{
            alignItems:"center",
            justifyContent:"center"
        }}>
            <View style={{ position: 'relative', width: size + 10, height: size + 4 }}>
                <View style={{
                    position: 'absolute',
                    top: 0, left: 0, zIndex: 1
                }}>
                    <SymbolIcon keywordOptions={[base, currency_base]} size={size} />
                </View>
                <View style={{
                    position: 'absolute',
                    top: "50%", left: 13, zIndex: 2
                }}>
                    <SymbolIcon keywordOptions={[quote, currency_quote]} size={size} />
                </View>
            </View>
        </View>
    );
};

export default SymbolAssetIcons;
