# React Native NativeWind Grid 🚀

A robust, feature-rich Grid layout system for React Native, designed to work seamlessly with [NativeWind](https://www.nativewind.dev/).

Bring the power of CSS Grid to your mobile apps with a familiar API: `grid-cols`, `gap`, `col-span`, `grid-areas`, and even `masonry`.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![NativeWind](https://img.shields.io/badge/NativeWind-v4/v2-cyan)

## ✨ Features

- **Standard Grid**: `grid-cols-N`, `gap-N`, `gap-x/y-N`.
- **Complex Tracks**: Arbitrary values like `grid-cols-[100px_1fr_auto]`.
- **Spanning**: `col-span-N`, `row-span-N`.
- **Grid Areas**: Named areas with `grid-areas-['header_header','sidebar_main']`.
- **Masonry Layout**: True masonry support via `<Grid masonry />`.
- **Visual Subgrid**: Nested grids inheriting parent tracks via `grid-cols-subgrid`.
- **Virtualization**: `<VirtualGrid />` for large datasets (chunked rendering).
- **Sticky Headers**: Sticky rows support within `VirtualGrid`.
- **Alignment**: Full support for `justify-items`, `align-items`, `place-items`, etc.
- **Dense Packing**: `grid-flow-row-dense` support.

## 📦 Installation

```bash
yarn add react-native-nativewind-grid
# or
npm install react-native-nativewind-grid
```

> **Note**: This library depends on `nativewind` being set up in your project.

## 🚀 Usage

### 1. Basic Grid
```tsx
import { Grid } from 'react-native-nativewind-grid';
import { View, Text } from 'react-native';

export function Example() {
  return (
    <Grid className="grid-cols-3 gap-4">
      <View className="bg-red-500 h-20" />
      <View className="bg-green-500 h-20" />
      <View className="bg-blue-500 h-20" />
    </Grid>
  );
}
```

### 2. Spans & Placement
```tsx
<Grid className="grid-cols-3 gap-2">
  <View className="col-span-2 bg-indigo-500 h-20" />
  <View className="bg-pink-500 h-20" />
  <View className="col-span-3 bg-slate-500 h-20" />
</Grid>
```

### 3. Complex Tracks (Arbitrary Values)
Use pixel values, fractions (`fr`), percentages (`%`), or `auto`.
```tsx
<Grid className="grid-cols-[100px_1fr_2fr] gap-2">
  <View className="bg-red-200"><Text>Fixed 100px</Text></View>
  <View className="bg-green-200"><Text>1fr</Text></View>
  <View className="bg-blue-200"><Text>2fr</Text></View>
</Grid>
```

### 4. Grid Areas
Define named areas and assign items to them.
```tsx
<Grid 
  className="grid-cols-[100px_1fr] gap-2"
  // Note: Pass areas via arbitrary class syntax
  // Format: 'row1_col1 row1_col2','row2_col1 row2_col2'
  className="grid-areas-['sidebar_header','sidebar_content']"
>
  <View className="area-header bg-blue-500 h-16" />
  <View className="area-sidebar bg-slate-800" />
  <View className="area-content bg-white h-full" />
</Grid>
```

### 5. Masonry Layout 🧱
Pinterest-style layout. Items are placed in the shortest column.
```tsx
<Grid masonry className="grid-cols-2 gap-2">
  {items.map((item) => (
    <View key={item.id} style={{ height: item.randomHeight }} className="bg-slate-200" />
  ))}
</Grid>
```

### 6. Subgrid (Visual)
Inherit column tracks from the parent grid.
```tsx
<Grid className="grid-cols-4 gap-4">
  <View className="col-span-1 bg-red-500" />
  {/* This nested grid will align perfectly with the parent's last 3 columns */}
  <Grid className="col-span-3 grid-cols-subgrid gap-4">
      <View className="bg-blue-500" /> {/* Aligns with col 2 */}
      <View className="bg-blue-500" /> {/* Aligns with col 3 */}
      <View className="bg-blue-500" /> {/* Aligns with col 4 */}
  </Grid>
</Grid>
```

### 7. VirtualGrid (Performance)
For lists with 100+ items, use `VirtualGrid`. It chunks items into rows and renders them in a `FlatList`.
```tsx
import { VirtualGrid } from 'react-native-nativewind-grid';

<VirtualGrid
  className="grid-cols-3 gap-2"
  data={largeDataArray}
  renderItem={({ item }) => <Card item={item} />}
  itemClassName="h-32 bg-white rounded"
  stickyHeaderIndices={[0]} // Optional: Sticky rows
/>
```

## ⚠️ Current Limitations (Missing Features)

As of v1.0, the following CSS Grid features are **not yet supported**:

- **`minmax()` and `repeat()`**: Track sizing supports explicit values only (e.g., `1fr`, `20%`, `100px`). `repeat(auto-fill, ...)` is not supported.
- **Auto-Fit / Auto-Fill**: Column count must be explicit (number or array of tracks). True responsive column counting based on container width is manual (via specific media queries like `md:grid-cols-4`).
- **Implicit Rows Sizing**: `grid-auto-rows` is not fully supported. Rows currently default to `auto` (content height).
- **RTL**: RTL layouts logic is not explicitly enforced beyond React Native's default behavior.

## 🛠 Debugging

Pass the `debug` prop to see console logs about layout calculation, grid spec parsing, and placement.

```tsx
<Grid debug className="..." />
```

## 🤝 Contributing

1. Clone the repo
2. Run `yarn install`
3. Run `yarn example android` or `yarn example ios` to see the `GridDemo`.

## 📄 License

MIT