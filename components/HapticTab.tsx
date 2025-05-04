import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticTabProps extends PressableProps {
  focused?: boolean;
}

export function HapticTab(props: HapticTabProps) {
  const { onPress, ...otherProps } = props;

  const handlePress = React.useCallback(
    (e: any) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(e);
    },
    [onPress]
  );

  return <Pressable {...otherProps} onPress={handlePress} />;
}
