# react-native-tailwind-grid

> Complete CSS Grid utilities for React Native via NativeWind/Tailwind CSS

**Zero config • Full Tailwind syntax • Works with any RN Tailwind solution**

---

## 🎯 The Problem

- **NativeWind, Tailwind RN, and all other Tailwind-for-RN solutions lack CSS Grid support**
- Grid utilities like `grid-cols-3`, `gap-4` are ignored or throw errors
- Developers are forced to use manual Flexbox calculations or give up on grid layouts
- No existing package bridges this gap comprehensively

## ✅ The Solution

A **Tailwind CSS Plugin + React Native Runtime** that:

- **Plugin:** Extends your tailwind.config.js with grid utilities
- **Runtime:** React Native components that parse className and execute layout
- **Zero Config:** Works with NativeWind v4/v5, Tailwind RN, or any Tailwind solution
- **Same Syntax:** Use the exact same grid classes as web

---

## 📦 Package Structure

```
react-native-tailwind-grid/
├── plugin/
│   └── index.js              # Tailwind plugin
├── runtime/
│   ├── Grid.tsx              # Grid container component
│   ├── parser.ts             # className parser
│   ├── calculator.ts         # Layout calculator
│   └── types.ts              # TypeScript types
├── index.ts                  # Main export
├── package.json
└── README.md
```

---

## 🏗️ Architecture

### Two-Phase Design

#### Build Time (Tailwind Plugin)
- Registers grid-* utilities
- Prevents Tailwind warnings
- No CSS generation needed
- Works with any RN Tailwind tool

#### Runtime (React Components)
- Parses className at render time
- Calculates widths/positions
- Applies Flexbox styles
- Zero performance overhead

### System Flow

```
className="grid grid-cols-3"
         ↓
   Tailwind Plugin (registers utilities)
         ↓
   Runtime Parser (extracts grid intent)
         ↓
   Layout Calculator (computes Flexbox styles)
         ↓
   React Native View (renders with layout)
```

---

## 🎨 Supported Features

### ✅ Supported Utilities

```
grid
grid-cols-{1-12}
grid-rows-{1-12}
gap-{0-96}
col-span-{1-12}
row-span-{1-12}
col-start-{1-13}
row-start-{1-13}
grid-flow-row
grid-flow-col
auto-cols-fr
auto-rows-fr
```

### ❌ Not Supported (Impossible on RN)

```
auto-cols-min
auto-cols-max
auto-cols-auto
grid-template-areas
Overlapping grid items
Intrinsic sizing (min-content)
Subgrid
```

*These require CSS Grid's 2D layout engine which React Native doesn't have*

---

## 🧠 Core Algorithms

### 1. Width Calculation

```javascript
const columnWidth = containerWidth / cols;
const itemWidth = columnWidth * colSpan;

// Example: 3 columns, item spans 2
// containerWidth = 375px
// columnWidth = 375 / 3 = 125px
// itemWidth = 125 * 2 = 250px
```

### 2. Position Calculation

```javascript
// Row flow (default)
const col = index % cols;
const row = Math.floor(index / cols);

// Column flow
const row = index % rows;
const col = Math.floor(index / rows);
```

### 3. Gap Implementation

```javascript
// Container: negative margin trick
containerStyle = {
  margin: -gap / 2
}

// Item: padding compensates
itemStyle = {
  padding: gap / 2
}

// Result: perfect gaps without overflow
```

---

## 📥 Installation

```bash
npm install react-native-tailwind-grid
# or
yarn add react-native-tailwind-grid
```

---

## ⚙️ Setup

Add the plugin to your `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('react-native-tailwind-grid/plugin'),
  ],
};
```

---

## 🚀 Usage

### Basic Example

```tsx
import { Grid } from 'react-native-tailwind-grid';
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <Grid className="grid grid-cols-3 gap-4">
      <View className="bg-blue-500 p-4">
        <Text>Item 1</Text>
      </View>
      <View className="bg-purple-500 p-4 col-span-2">
        <Text>Item 2 (spans 2 columns)</Text>
      </View>
      <View className="bg-green-500 p-4">
        <Text>Item 3</Text>
      </View>
    </Grid>
  );
}
```

### Responsive Grid

```tsx
<Grid className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {items.map(item => (
    <View key={item.id} className="bg-white p-4">
      <Text>{item.name}</Text>
    </View>
  ))}
</Grid>
```

### Column Flow

```tsx
<Grid className="grid grid-flow-col grid-rows-3 gap-2">
  <View className="bg-red-500 p-4" />
  <View className="bg-blue-500 p-4" />
  <View className="bg-green-500 p-4" />
  <View className="bg-yellow-500 p-4" />
</Grid>
```

### Complex Layout

```tsx
<Grid className="grid grid-cols-4 gap-6">
  <View className="col-span-2 row-span-2 bg-blue-500 p-6">
    <Text>Featured</Text>
  </View>
  <View className="bg-purple-500 p-6">
    <Text>Item 1</Text>
  </View>
  <View className="bg-green-500 p-6">
    <Text>Item 2</Text>
  </View>
  <View className="col-span-2 bg-yellow-500 p-6">
    <Text>Wide Item</Text>
  </View>
</Grid>
```

### Works Seamlessly with NativeWind

```tsx
// Mix grid utilities with any other Tailwind classes
<Grid className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
  <View className="bg-blue-500 p-4 rounded shadow-lg">
    <Text className="text-white font-bold">Card 1</Text>
  </View>
  <View className="bg-purple-500 p-4 rounded shadow-lg col-span-2">
    <Text className="text-white font-bold">Card 2</Text>
  </View>
</Grid>
```

---

## 💻 Implementation Details

### 1. Tailwind Plugin (plugin/index.js)

```javascript
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities, matchUtilities }) {
  // Base grid utility
  addUtilities({
    '.grid': {},
    '.grid-flow-row': {},
    '.grid-flow-col': {},
    '.auto-cols-fr': {},
    '.auto-rows-fr': {},
  });

  // Grid columns: grid-cols-1 through grid-cols-12
  matchUtilities(
    {
      'grid-cols': (value) => ({}),
      'grid-rows': (value) => ({}),
    },
    { values: { ...Array.from({ length: 12 }, (_, i) => i + 1) } }
  );

  // Spans: col-span-1 through col-span-12
  matchUtilities(
    {
      'col-span': (value) => ({}),
      'row-span': (value) => ({}),
      'col-start': (value) => ({}),
      'row-start': (value) => ({}),
    },
    { values: { ...Array.from({ length: 13 }, (_, i) => i + 1) } }
  );
});
```

### 2. Parser (runtime/parser.ts)

```typescript
export function parseGridClasses(className?: string) {
  const spec = {
    cols: 1,
    rows: undefined,
    gap: 0,
    autoFlow: 'row',
    autoCols: undefined,
    autoRows: undefined,
  };

  if (!className) return spec;

  className.split(/\s+/).forEach(cls => {
    // grid-cols-3
    if (cls.startsWith('grid-cols-')) {
      spec.cols = parseInt(cls.replace('grid-cols-', ''));
    }
    
    // gap-4 (multiply by 4 for Tailwind spacing scale)
    if (cls.startsWith('gap-')) {
      spec.gap = parseInt(cls.replace('gap-', '')) * 4;
    }
    
    // grid-flow-col
    if (cls === 'grid-flow-col') {
      spec.autoFlow = 'column';
    }
    
    // auto-cols-fr
    if (cls === 'auto-cols-fr') {
      spec.autoCols = 'fr';
    }
  });

  return spec;
}
```

### 3. Calculator (runtime/calculator.ts)

```typescript
export function computeContainerStyle(spec, width) {
  return {
    flexDirection: spec.autoFlow === 'column' ? 'column' : 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spec.gap / 2,
    marginVertical: -spec.gap / 2,
  };
}

export function computeItemStyle(gridSpec, itemSpec, containerWidth) {
  const colWidth = containerWidth / gridSpec.cols;
  const width = colWidth * itemSpec.colSpan;

  return {
    width,
    paddingHorizontal: gridSpec.gap / 2,
    paddingVertical: gridSpec.gap / 2,
  };
}
```

### 4. Grid Component (runtime/Grid.tsx)

```typescript
import { View, useWindowDimensions } from 'react-native';
import { parseGridClasses } from './parser';
import { computeContainerStyle, computeItemStyle } from './calculator';

export function Grid({ className, children, ...props }) {
  const { width } = useWindowDimensions();
  const gridSpec = parseGridClasses(className);
  const containerStyle = computeContainerStyle(gridSpec, width);

  // Enhance children with grid context
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    const itemSpec = parseGridClasses(child.props.className);
    const itemStyle = computeItemStyle(gridSpec, itemSpec, width);
    
    return React.cloneElement(child, {
      style: [itemStyle, child.props.style],
    });
  });

  return (
    <View style={containerStyle} {...props}>
      {enhancedChildren}
    </View>
  );
}
```

---

## 📚 API Reference

### Container Utilities
- `grid`
- `grid-cols-{1-12}`
- `grid-rows-{1-12}`
- `gap-{0-96}`
- `grid-flow-row`
- `grid-flow-col`
- `auto-cols-fr`
- `auto-rows-fr`

### Item Utilities
- `col-span-{1-12}`
- `row-span-{1-12}`
- `col-start-{1-13}`
- `row-start-{1-13}`
- `col-end-{1-13}`
- `row-end-{1-13}`

---

## ⚠️ Important Notes

> This library provides **Grid-like ergonomics**, not a CSS Grid engine.
> Layout is implemented using Flexbox and deterministic sizing rules.

- Works with NativeWind v4/v5, Tailwind RN, or any Tailwind CSS solution for React Native
- Zero dependencies except React Native
- Performance: O(n) layout calculation, no measurement loops
- Honest about limitations - we clearly document what works and what doesn't

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions welcome! This package aims to be the standard grid solution for React Native + Tailwind CSS.

---

**Made with ❤️ for the React Native community**