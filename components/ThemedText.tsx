import React from 'react';
import { Text, TextProps } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'title' | 'subtitle' | 'body' | 'caption';
}

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'body', ...otherProps } = props;
  const colorScheme = useColorScheme();

  const color = colorScheme === 'dark'
    ? darkColor ?? Colors.dark.text
    : lightColor ?? Colors.light.text;

  let fontSize = 14;
  let fontWeight: 'normal' | 'bold' | '500' = 'normal';
  
  switch (type) {
    case 'title':
      fontSize = 20;
      fontWeight = 'bold';
      break;
    case 'subtitle':
      fontSize = 16;
      fontWeight = '500';
      break;
    case 'caption':
      fontSize = 12;
      break;
    default:
      break;
  }

  return <Text style={[{ color, fontSize, fontWeight }, style]} {...otherProps} />;
}
