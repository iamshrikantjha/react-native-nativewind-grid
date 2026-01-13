# react-native-nativewind-grid

> **The missing Grid system for React Native.**
>
> Bring the power of CSS Grid to your NativeWind projects with zero configuration.

[![npm version](https://img.shields.io/npm/v/react-native-nativewind-grid.svg)](https://www.npmjs.com/package/react-native-nativewind-grid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Why this exists?

React Native relies on Flexbox, which is fantastic for 1D layouts but struggles with 2D grid structures. While Tailwind offers powerful grid utilities (`grid-cols-3`, `gap-4`, etc.), they simply don't work in React Native because the underlying engine doesn't support them.

**react-native-nativewind-grid** solves this by bridging the gap:

- **Full Tailwind Compatibility**: Use standard classes like `grid-cols-3`, `col-span-2`, `gap-4`.
- **Runtime Parsing**: Works with **NativeWind v2 & v4** by parsing `className` props at runtime.
- **smart Layout Engine**: Calculates widths, margins, and padding on the fly using standard Flexbox primitives.
- **Masonry Support**: create complex masonry layouts easily with `col-span` and `row-span`.

---

## 📦 Installation

```bash
yarn add react-native-nativewind-grid
# or
npm install react-native-nativewind-grid
```

### Requirements

- `react-native` >= 0.70
- `nativewind` >= 2.0 (Compatible with v4!)
- `tailwindcss` >= 3.0

---

## ⚙️ Configuration

Add the plugin to your `tailwind.config.js` to ensure the classes are generated and recognized by Tailwind (prevents "unknown class" warnings).

```javascript
// tailwind.config.js
module.exports = {
  // ...
  plugins: [
    require('react-native-nativewind-grid/plugin'),
    // ... other plugins
  ],
};
```

---

## 💡 Usage

### Basic Grid
Create a simple 3-column grid with a gap.

```tsx
import { Grid } from 'react-native-nativewind-grid';
import { View, Text } from 'react-native';

export function Example() {
  return (
    <Grid className="grid-cols-3 gap-4">
      <View className="bg-red-500 h-20" />
      <View className="bg-blue-500 h-20" />
      <View className="bg-green-500 h-20" />
    </Grid>
  );
}
```

### Spanning Items (Bento Grid)
Make items span multiple columns or rows using `col-span-{n}` and `row-span-{n}`.

```tsx
<Grid className="grid-cols-4 gap-4">
  {/* Large Hero Item */}
  <View className="col-span-2 row-span-2 bg-purple-500 h-40">
    <Text className="text-white">Hero</Text>
  </View>
  
  {/* Standard Items */}
  <View className="col-span-1 bg-gray-500 h-20" />
  <View className="col-span-1 bg-gray-500 h-20" />
  
  {/* Wide Item */}
  <View className="col-span-2 bg-indigo-500 h-20" />
</Grid>
```

### Keypad / Masonry Flow using `style` forwarding
**Important**: If you use custom components as children, you **must** pass the `style` prop to the underlying `View`. This library injects calculated widths via the `style` prop.

```tsx
// ✅ Correct: Forward the style prop
const Key = ({ style, label }) => (
  <View style={[styles.baseKey, style]}>
    <Text>{label}</Text>
  </View>
);

// usage
<Grid className="grid-cols-4 gap-2">
  <Key label="1" />
  <Key label="2" />
  <Key label="0" className="col-span-2" /> {/* Spans 2 cols */}
</Grid>
```

---

## 📚 API Reference

### Grid Container Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Tailwind classes (`grid-cols-*`, `gap-*`, `grid-flow-*`) |
| `style` | `ViewStyle` | Standard React Native style object |
| `children` | `ReactNode` | Grid items |

### Supported Tailwind Classes

#### Container
- `grid-cols-{n}`: Define columns (1-12)
- `gap-{n}`: Gap between items property (all axes)
- `gap-x-{n}`: Horizontal gap
- `gap-y-{n}`: Vertical gap
- `grid-flow-row`: (Default) Items fill rows first
- `grid-flow-col`: Items fill columns first

#### Items (Children)
- `col-span-{n}`: Span n columns
- `row-span-{n}`: Span n rows (visual only, driven by height)
- `col-start-{n}`: Start placement (1-13)
- `row-start-{n}`: Start placement (1-13)

---

## ⚠️ Limitations & Good to Know

1.  **Flexbox-based**: This is not a CSS Grid engine implementation. It mimics the *layout* of CSS Grid using calculated Flexbox widths and margins.
2.  **`row-span`**: In the web, `row-span` implies the item takes up multiple explicit grid tracks. In this library, `row-span` is primarily supported via `grid-flow-dense` logic emulation if you provide height. For standard usage, it acts as a semantic marker, but you usually control the height of your item manually (e.g., `h-40`).
3.  **Explicit Widths**: The grid calculates `width` percentages. Avoid overriding `width` on children unless you know what you are doing.

---

## 🤝 Contributing

We welcome contributions! Please follow the standard PR flow.

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

MIT © [Shrikant Jha](https://github.com/iamshrikantjha)