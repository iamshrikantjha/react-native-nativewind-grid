# React Native NativeWind Grid 🚀

A robust, specification-compliant Grid layout system for React Native, built on top of [NativeWind v4](https://www.nativewind.dev/).

Unlike other grid libraries that just wrap Flexbox, this library implements a **true 2D grid algorithms** capable of handling complex layouts, masonry, and virtualization, all controllable via standard Tailwind CSS classes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![NativeWind](https://img.shields.io/badge/NativeWind-v4-cyan)

## ✨ Features (Working Now)

- **Standard Grid**: Full support for `grid-cols-N`, `grid-rows-N`, `gap-N`, `gap-x/y-N`.
- **Complex Tracks**: Support for arbitrary values: `grid-cols-[100px_1fr_auto]`.
- **Grid Areas**: Named grid areas for semantic layouts: `grid-areas-['header_header', 'sidebar_content']`.
- **Spanning**: `col-span-N`, `row-span-N`, `col-span-full`, `row-span-full`.
- **Masonry Layout**: True Pinterest-style masonry layout (`<Grid masonry />`) that packs items based on height.
- **Visual Subgrid**: Nested grids that visually align with parent column tracks (`grid-cols-subgrid`).
- **Virtualization**: `<VirtualGrid />` component for rendering thousands of items efficiently (uses `FlatList` internally).
- **Alignment**: `justify-items`, `align-items`, `place-items`, `justify-self`, `align-self`.
- **Dense Packing**: `grid-flow-row-dense` to fill holes in the grid automatically.
- **Sticky Headers**: Sticky positioning support within Grids (and `stickyHeaderIndices` in VirtualGrid).

## 📦 Installation

```bash
yarn add react-native-nativewind-grid
# or
npm install react-native-nativewind-grid
```

### ⚙️ Configuration (Crucial)

You **must** update your `tailwind.config.js` to scan this library's source files. If you skip this, no styles will apply.

```js filename="tailwind.config.js" {5}
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-native-nativewind-grid/src/**/*.{ts,tsx}" // <--- Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🚀 Basic Usage

```tsx
import { Grid } from 'react-native-nativewind-grid';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <Grid className="grid-cols-3 gap-4 p-4">
      <View className="bg-red-500 h-24 rounded" />
      <View className="bg-green-500 h-24 rounded" />
      <View className="bg-blue-500 h-24 rounded" />
      {/* Spanning Item */}
      <View className="col-span-3 bg-purple-500 h-24 rounded flex items-center justify-center">
        <Text className="text-white font-bold">I span 3 columns</Text>
      </View>
    </Grid>
  );
}
```

## 📚 Advanced Features

### 1. Complex Track Sizing
Mix fixed pixels, fractions (`fr`), percentages, and `auto` sizing.

```tsx
/* Column 1: Fixed 100px
   Column 2: Takes remaining space (1fr)
   Column 3: Fixed 20% of container */
<Grid className="grid-cols-[100px_1fr_20%] gap-2">
  <View className="bg-red-200" />
  <View className="bg-green-200" />
  <View className="bg-blue-200" />
</Grid>
```

### 2. Grid Areas
Name your areas for readability.

```tsx
<Grid 
  className="grid-cols-2 gap-4 grid-areas-['header_header', 'sidebar_content', 'footer_footer']"
>
  <View className="area-header bg-red-400 h-20" />
  <View className="area-sidebar bg-blue-400 h-40" />
  <View className="area-content bg-green-400 h-40" />
  <View className="area-footer bg-yellow-400 h-20" />
</Grid>
```

### 3. Masonry Layout
Pinterest-style layout where items stack based on height rather than strict rows.

```tsx
<Grid masonry className="grid-cols-2 gap-2">
  {items.map(item => (
     <View key={item.id} style={{ height: item.randomHeight }} className="bg-slate-200 rounded" />
  ))}
</Grid>
```

### 4. Visual Subgrid
Allow nested children to align to the parent's grid tracks.

```tsx
<Grid className="grid-cols-4 gap-4 bg-gray-100 p-2">
  <View className="col-span-1 bg-white" />
  
  {/* Nested grid inheriting the last 3 columns of the parent */}
  <Grid className="col-span-3 grid-cols-subgrid gap-2 bg-blue-50">
      <View className="bg-blue-200" /> {/* Aligns with Parent Col 2 */}
      <View className="bg-blue-200" /> {/* Aligns with Parent Col 3 */}
      <View className="bg-blue-200" /> {/* Aligns with Parent Col 4 */}
  </Grid>
</Grid>
```

### 5. Virtual Grid (Performance)
Use `<VirtualGrid />` for long lists to maintain 60fps. It chunks items into rows and uses a `FlatList` under the hood.

```tsx
import { VirtualGrid } from 'react-native-nativewind-grid';

<VirtualGrid
  className="grid-cols-3 gap-2"
  data={largeData}
  renderItem={({ item }) => <Card item={item} />}
  keyExtractor={(item) => item.id}
  stickyHeaderIndices={[0]} // Optional sticky headers
/>
```

## ⚠️ Known Limitations

We aim for honest adherence to the spec, but React Native has differences from the web.

1.  **Auto-Placement (Dense)**: `grid-flow-row-dense` is supported, but `grid-flow-column` logic is currently **experimental**.
2.  **Subgrid**: `grid-cols-subgrid` is fully supported. `grid-rows-subgrid` is **not yet supported**.
3.  **Explicit Tracks**: You must define tracks. `minmax(100px, 1fr)` syntax is **not yet supported** (planned). Use `auto` or `fr` instead.
4.  **Placement Ends**: `col-start` and `row-start` work perfectly. `col-end` and `row-end` are parsed but **currently ignored** by the layout engine (spans must be defined via `col-span`).
5.  **VirtualGrid Limitations**: `<VirtualGrid>` optimizes by pre-grouping items into rows. It assumes items mainly span 1 column. Complex variable spanning logic inside a virtualization context is restricted. Use standard `<Grid>` for highly irregular layouts with fewer (<100) items.
6.  **Percentage Tracks**: Deeply nested percentage tracks sometimes resolve against the screen width rather than the immediate parent if the parent has no explicit width.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.