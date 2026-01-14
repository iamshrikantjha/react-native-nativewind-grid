# React Native NativeWind Grid

A high-performance, Flexbox-based Grid system for React Native, designed to work seamlessly with **NativeWind v4**.

It mimics CSS Grid behavior using efficient React Native primitives without runtime layout measurements (no double-renders).

## Features

- **High Performance**: Zero double-renders, percentage-based layout, and memoized calculations.
- **NativeWind Integrated**: Supports standard `className` utilities (`bg-*`, `border-*`, `shadow-*`).
- **Complete Grid Support**:
  - `grid-cols-{n}` / `grid-cols-[n]`
  - `gap-{n}` / `gap-[n]`
  - `col-span-{n}` / `row-span-{n}`
  - `col-start-{n}` / `col-end-{n}`
  - `order-{n}` / `order-first` / `order-last`
- **Alignment (Box Alignment)**:
  - Container: `justify-*`, `items-*`, `content-*`
  - Item: `self-*`
- **Gap Support**: True visual gaps using padding wrappers (works with child backgrounds).

## Installation

```bash
yarn add react-native-nativewind-grid
```

## Usage

```tsx
import { Grid } from 'react-native-nativewind-grid';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <Grid className="grid grid-cols-3 gap-4">
      {/* Span 2 Columns */}
      <View className="col-span-2 bg-blue-500 h-20" />
      
      {/* Ordinary Cell */}
      <View className="bg-red-500 h-20" />
      
      {/* Arbitrary Value & Placement */}
      <View className="col-start-1 col-end-3 bg-green-500 h-20" />
      
      {/* Ordering */}
      <View className="order-last bg-purple-500 h-20" />
    </Grid>
  );
}
```

## Props

| Prop | Type | Description |
| h--- | --- | --- |
| `className` | `string` | Tailwind classes string. |
| `style` | `ViewStyle` | Standard React Native style object. |
| `debug` | `boolean` | If true, logs parsing and calculation info to console. |
| `children` | `ReactNode` | Grid items. |

## Limitations

- **`row-span`**: In the current Flexbox-based architecture, `row-span` **does not affect height**. Height is determined strictly by content. `row-span` acts as a placeholder for potential future functionality but currently has no visual effect on height.
- **`grid-flow-dense`**: Dense packing is not supported. Items naturally flow in 'row' order.