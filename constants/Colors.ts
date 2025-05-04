/**
 * ONE Albania SME Dashboard colors for the mobile app.
 * These colors match the web application's color scheme.
 */

import { OneAlbaniaColors } from './OneAlbaniaColors';

const tintColorLight = OneAlbaniaColors.primary;
const tintColorDark = OneAlbaniaColors.primaryLight;

export const Colors = {
  light: {
    text: OneAlbaniaColors.text.light.primary,
    background: OneAlbaniaColors.background.light,
    tint: tintColorLight,
    icon: OneAlbaniaColors.grey[600],
    tabIconDefault: OneAlbaniaColors.grey[600],
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: OneAlbaniaColors.text.dark.primary,
    background: OneAlbaniaColors.background.dark,
    tint: tintColorDark,
    icon: OneAlbaniaColors.grey[400],
    tabIconDefault: OneAlbaniaColors.grey[400],
    tabIconSelected: tintColorDark,
  },
};
