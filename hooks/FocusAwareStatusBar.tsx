import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {Platform} from 'react-native';
import {SystemBars} from 'react-native-edge-to-edge';


export const FocusAwareStatusBar = ({hidden = false}: { hidden?: boolean }) => {
    const isFocused = useIsFocused();

    if (Platform.OS === 'web') return null;

    return isFocused ? <SystemBars hidden={hidden}/> : null;
};
