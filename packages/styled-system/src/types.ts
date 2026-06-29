// First-class TypeScript types — the public surface that replaces @types/styled-system.
// Foundation types (Theme, ResponsiveValue, ThemeValue, ObjectOrArray) and the
// generic, theme-scale-aware prop interfaces mirror @types/styled-system@5.1.25 so this
// package is a drop-in replacement. The one deviation: ThemeValue's inference helper
// uses `unknown` instead of the original's `any`.
import type * as CSS from 'csstype'

export type ObjectOrArray<T, K extends keyof never = keyof never> =
  | T[]
  | Record<K, T | Record<K, T> | T[]>

export type Scale = ObjectOrArray<number | string>

export type TLengthStyledSystem = string | 0 | number

export interface Theme<TLength = TLengthStyledSystem> {
  breakpoints?: ObjectOrArray<number | string | symbol>
  mediaQueries?: { [size: string]: string }
  space?: ObjectOrArray<CSS.Property.Margin<number | string>>
  fontSizes?: ObjectOrArray<CSS.Property.FontSize<number>>
  colors?: ObjectOrArray<CSS.Property.Color>
  fonts?: ObjectOrArray<CSS.Property.FontFamily>
  fontWeights?: ObjectOrArray<CSS.Property.FontWeight>
  lineHeights?: ObjectOrArray<CSS.Property.LineHeight<TLength>>
  letterSpacings?: ObjectOrArray<CSS.Property.LetterSpacing<TLength>>
  sizes?: ObjectOrArray<CSS.Property.Height<object> | CSS.Property.Width<object>>
  borders?: ObjectOrArray<CSS.Property.Border<object>>
  borderStyles?: ObjectOrArray<CSS.Property.Border<object>>
  borderWidths?: ObjectOrArray<CSS.Property.BorderWidth<TLength>>
  radii?: ObjectOrArray<CSS.Property.BorderRadius<TLength>>
  shadows?: ObjectOrArray<CSS.Property.BoxShadow>
  zIndices?: ObjectOrArray<CSS.Property.ZIndex>
  buttons?: ObjectOrArray<CSS.StandardProperties>
  colorStyles?: ObjectOrArray<CSS.StandardProperties>
  textStyles?: ObjectOrArray<CSS.StandardProperties>
}

export type RequiredTheme = Required<Theme>

export type ThemeValue<K extends keyof ThemeType, ThemeType, TVal = unknown> =
  NonNullable<ThemeType[K]> extends TVal[]
    ? number
    : NonNullable<ThemeType[K]> extends Record<infer E, TVal>
      ? E
      : NonNullable<ThemeType[K]> extends ObjectOrArray<infer F>
        ? F
        : never

export type ResponsiveValue<T, ThemeType extends Theme = RequiredTheme> =
  | T
  | null
  | Array<T | null>
  | { [key in (ThemeValue<'breakpoints', ThemeType> & string) | number]?: T }

type L = TLengthStyledSystem

export interface SpaceProps<
  ThemeType extends Theme = RequiredTheme,
  TVal = ThemeValue<'space', ThemeType>,
> {
  m?: ResponsiveValue<TVal, ThemeType>
  margin?: ResponsiveValue<TVal, ThemeType>
  mt?: ResponsiveValue<TVal, ThemeType>
  marginTop?: ResponsiveValue<TVal, ThemeType>
  mr?: ResponsiveValue<TVal, ThemeType>
  marginRight?: ResponsiveValue<TVal, ThemeType>
  mb?: ResponsiveValue<TVal, ThemeType>
  marginBottom?: ResponsiveValue<TVal, ThemeType>
  ml?: ResponsiveValue<TVal, ThemeType>
  marginLeft?: ResponsiveValue<TVal, ThemeType>
  mx?: ResponsiveValue<TVal, ThemeType>
  marginX?: ResponsiveValue<TVal, ThemeType>
  my?: ResponsiveValue<TVal, ThemeType>
  marginY?: ResponsiveValue<TVal, ThemeType>
  p?: ResponsiveValue<TVal, ThemeType>
  padding?: ResponsiveValue<TVal, ThemeType>
  pt?: ResponsiveValue<TVal, ThemeType>
  paddingTop?: ResponsiveValue<TVal, ThemeType>
  pr?: ResponsiveValue<TVal, ThemeType>
  paddingRight?: ResponsiveValue<TVal, ThemeType>
  pb?: ResponsiveValue<TVal, ThemeType>
  paddingBottom?: ResponsiveValue<TVal, ThemeType>
  pl?: ResponsiveValue<TVal, ThemeType>
  paddingLeft?: ResponsiveValue<TVal, ThemeType>
  px?: ResponsiveValue<TVal, ThemeType>
  paddingX?: ResponsiveValue<TVal, ThemeType>
  py?: ResponsiveValue<TVal, ThemeType>
  paddingY?: ResponsiveValue<TVal, ThemeType>
}

export interface MarginProps<
  ThemeType extends Theme = RequiredTheme,
  TVal = ThemeValue<'space', ThemeType>,
> {
  m?: ResponsiveValue<TVal, ThemeType>
  margin?: ResponsiveValue<TVal, ThemeType>
  mt?: ResponsiveValue<TVal, ThemeType>
  marginTop?: ResponsiveValue<TVal, ThemeType>
  mr?: ResponsiveValue<TVal, ThemeType>
  marginRight?: ResponsiveValue<TVal, ThemeType>
  mb?: ResponsiveValue<TVal, ThemeType>
  marginBottom?: ResponsiveValue<TVal, ThemeType>
  ml?: ResponsiveValue<TVal, ThemeType>
  marginLeft?: ResponsiveValue<TVal, ThemeType>
  mx?: ResponsiveValue<TVal, ThemeType>
  marginX?: ResponsiveValue<TVal, ThemeType>
  my?: ResponsiveValue<TVal, ThemeType>
  marginY?: ResponsiveValue<TVal, ThemeType>
}

export interface PaddingProps<
  ThemeType extends Theme = RequiredTheme,
  TVal = ThemeValue<'space', ThemeType>,
> {
  p?: ResponsiveValue<TVal, ThemeType>
  padding?: ResponsiveValue<TVal, ThemeType>
  pt?: ResponsiveValue<TVal, ThemeType>
  paddingTop?: ResponsiveValue<TVal, ThemeType>
  pr?: ResponsiveValue<TVal, ThemeType>
  paddingRight?: ResponsiveValue<TVal, ThemeType>
  pb?: ResponsiveValue<TVal, ThemeType>
  paddingBottom?: ResponsiveValue<TVal, ThemeType>
  pl?: ResponsiveValue<TVal, ThemeType>
  paddingLeft?: ResponsiveValue<TVal, ThemeType>
  px?: ResponsiveValue<TVal, ThemeType>
  paddingX?: ResponsiveValue<TVal, ThemeType>
  py?: ResponsiveValue<TVal, ThemeType>
  paddingY?: ResponsiveValue<TVal, ThemeType>
}

export interface LayoutProps<ThemeType extends Theme = RequiredTheme> {
  width?: ResponsiveValue<CSS.Property.Width<L>, ThemeType>
  height?: ResponsiveValue<CSS.Property.Height<L>, ThemeType>
  minWidth?: ResponsiveValue<CSS.Property.MinWidth<L>, ThemeType>
  minHeight?: ResponsiveValue<CSS.Property.MinHeight<L>, ThemeType>
  maxWidth?: ResponsiveValue<CSS.Property.MaxWidth<L>, ThemeType>
  maxHeight?: ResponsiveValue<CSS.Property.MaxHeight<L>, ThemeType>
  size?: ResponsiveValue<CSS.Property.Width<L>, ThemeType>
  overflow?: ResponsiveValue<CSS.Property.Overflow, ThemeType>
  overflowX?: ResponsiveValue<CSS.Property.OverflowX, ThemeType>
  overflowY?: ResponsiveValue<CSS.Property.OverflowY, ThemeType>
  display?: ResponsiveValue<CSS.Property.Display, ThemeType>
  verticalAlign?: ResponsiveValue<CSS.Property.VerticalAlign<L>, ThemeType>
}

export interface TypographyProps<ThemeType extends Theme = RequiredTheme> {
  fontFamily?: ResponsiveValue<CSS.Property.FontFamily, ThemeType>
  fontSize?: ResponsiveValue<ThemeValue<'fontSizes', ThemeType>, ThemeType>
  fontWeight?: ResponsiveValue<ThemeValue<'fontWeights', ThemeType> | string, ThemeType>
  lineHeight?: ResponsiveValue<ThemeValue<'lineHeights', ThemeType>, ThemeType>
  letterSpacing?: ResponsiveValue<CSS.Property.LetterSpacing<L>, ThemeType>
  textAlign?: ResponsiveValue<CSS.Property.TextAlign, ThemeType>
  fontStyle?: ResponsiveValue<CSS.Property.FontStyle, ThemeType>
}

export interface FlexboxProps<ThemeType extends Theme = RequiredTheme> {
  alignItems?: ResponsiveValue<CSS.Property.AlignItems, ThemeType>
  alignContent?: ResponsiveValue<CSS.Property.AlignContent, ThemeType>
  justifyItems?: ResponsiveValue<CSS.Property.JustifyItems, ThemeType>
  justifyContent?: ResponsiveValue<CSS.Property.JustifyContent, ThemeType>
  flexWrap?: ResponsiveValue<CSS.Property.FlexWrap, ThemeType>
  flexDirection?: ResponsiveValue<CSS.Property.FlexDirection, ThemeType>
  flex?: ResponsiveValue<CSS.Property.Flex<L>, ThemeType>
  flexGrow?: ResponsiveValue<CSS.Property.FlexGrow, ThemeType>
  flexShrink?: ResponsiveValue<CSS.Property.FlexShrink, ThemeType>
  flexBasis?: ResponsiveValue<CSS.Property.FlexBasis<L>, ThemeType>
  justifySelf?: ResponsiveValue<CSS.Property.JustifySelf, ThemeType>
  alignSelf?: ResponsiveValue<CSS.Property.AlignSelf, ThemeType>
  order?: ResponsiveValue<CSS.Property.Order, ThemeType>
}

export interface PositionProps<ThemeType extends Theme = RequiredTheme> {
  position?: ResponsiveValue<CSS.Property.Position, ThemeType>
  zIndex?: ResponsiveValue<CSS.Property.ZIndex, ThemeType>
  top?: ResponsiveValue<CSS.Property.Top<L>, ThemeType>
  right?: ResponsiveValue<CSS.Property.Right<L>, ThemeType>
  bottom?: ResponsiveValue<CSS.Property.Bottom<L>, ThemeType>
  left?: ResponsiveValue<CSS.Property.Left<L>, ThemeType>
}

export interface ColorProps<
  ThemeType extends Theme = RequiredTheme,
  TVal = ThemeValue<'colors', ThemeType>,
> {
  color?: ResponsiveValue<TVal, ThemeType>
  backgroundColor?: ResponsiveValue<TVal, ThemeType>
  bg?: ResponsiveValue<TVal, ThemeType>
  opacity?: ResponsiveValue<CSS.Property.Opacity, ThemeType>
}

export interface BorderProps<ThemeType extends Theme = RequiredTheme> {
  border?: ResponsiveValue<CSS.Property.Border<L>, ThemeType>
  borderWidth?: ResponsiveValue<CSS.Property.BorderWidth<L>, ThemeType>
  borderStyle?: ResponsiveValue<CSS.Property.BorderStyle, ThemeType>
  borderColor?: ResponsiveValue<ThemeValue<'colors', ThemeType>, ThemeType>
  borderRadius?: ResponsiveValue<ThemeValue<'radii', ThemeType>, ThemeType>
  borderTop?: ResponsiveValue<CSS.Property.BorderTop<L>, ThemeType>
  borderRight?: ResponsiveValue<CSS.Property.BorderRight<L>, ThemeType>
  borderBottom?: ResponsiveValue<CSS.Property.BorderBottom<L>, ThemeType>
  borderLeft?: ResponsiveValue<CSS.Property.BorderLeft<L>, ThemeType>
}

export interface BackgroundProps<ThemeType extends Theme = RequiredTheme> {
  background?: ResponsiveValue<CSS.Property.Background<L>, ThemeType>
  backgroundImage?: ResponsiveValue<CSS.Property.BackgroundImage, ThemeType>
  backgroundSize?: ResponsiveValue<CSS.Property.BackgroundSize<L>, ThemeType>
  backgroundPosition?: ResponsiveValue<CSS.Property.BackgroundPosition<L>, ThemeType>
  backgroundRepeat?: ResponsiveValue<CSS.Property.BackgroundRepeat, ThemeType>
}

export interface GridProps<ThemeType extends Theme = RequiredTheme> {
  gridGap?: ResponsiveValue<CSS.Property.GridGap<L>, ThemeType>
  gridColumnGap?: ResponsiveValue<CSS.Property.GridColumnGap<L>, ThemeType>
  gridRowGap?: ResponsiveValue<CSS.Property.GridRowGap<L>, ThemeType>
  gridColumn?: ResponsiveValue<CSS.Property.GridColumn, ThemeType>
  gridRow?: ResponsiveValue<CSS.Property.GridRow, ThemeType>
  gridAutoFlow?: ResponsiveValue<CSS.Property.GridAutoFlow, ThemeType>
  gridAutoColumns?: ResponsiveValue<CSS.Property.GridAutoColumns<L>, ThemeType>
  gridAutoRows?: ResponsiveValue<CSS.Property.GridAutoRows<L>, ThemeType>
  gridTemplateColumns?: ResponsiveValue<CSS.Property.GridTemplateColumns<L>, ThemeType>
  gridTemplateRows?: ResponsiveValue<CSS.Property.GridTemplateRows<L>, ThemeType>
  gridTemplateAreas?: ResponsiveValue<CSS.Property.GridTemplateAreas, ThemeType>
  gridArea?: ResponsiveValue<CSS.Property.GridArea, ThemeType>
}

export interface ShadowProps<ThemeType extends Theme = RequiredTheme> {
  boxShadow?: ResponsiveValue<CSS.Property.BoxShadow | string, ThemeType>
  textShadow?: ResponsiveValue<CSS.Property.TextShadow | string, ThemeType>
}
