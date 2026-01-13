# NativeWind Grid Library Handover Instructions

These instructions contain the full source code and context for the `react-native-nativewind-grid` library. Use this to restore the library state in your new workspace.

## 1. Project Context
- **Goal**: A standalone React Native library for Masonry Grid layouts, designed to work seamlessly with NativeWind.
- **Current State**: The logic has been extracted from `apps/mobile` and corrected for identifying strict null checks in TypeScript.
- **Dependencies**: The logic relies on standard React/RectNative. `NativeWind` is used by the *consumer* (the app using the grid) to style the items, but the grid logic itself is style-agnostic (it only manages layout).

## 2. File Contents

### `src/masonry.tsx`
*Contains the core Masonry layout logic and component. Fixed TypeScript strict null check errors.*

```tsx
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export interface MasonryColumn {
  items: number[]; // Item indices
  height: number;
}

/**
 * Distributes items across columns to balance height
 */
export function calculateMasonryLayout(
  itemHeights: number[],
  cols: number
): MasonryColumn[] {
  const columns: MasonryColumn[] = Array.from({ length: cols }, () => ({
    items: [],
    height: 0,
  }));

  // Greedy algorithm: always add to shortest column
  itemHeights.forEach((height, index) => {
    // Find shortest column
    let shortestCol = 0;
    let minHeight = columns[0]!.height;

    for (let i = 1; i < cols; i++) {
        const col = columns[i];
      if (col && col.height < minHeight) {
        minHeight = col.height;
        shortestCol = i;
      }
    }

    // Add item to shortest column
    const targetCol = columns[shortestCol];
    if (targetCol) {
        targetCol.items.push(index);
        targetCol.height += height;
    }
  });

  return columns;
}

/**
 * Masonry Grid component
 */
export function MasonryGrid({
  children,
  cols = 2,
  gap = 16
}: {
  children: React.ReactElement[];
  cols?: number;
  gap?: number;
}) {
  const [layout, setLayout] = useState<MasonryColumn[]>([]);
  const [itemHeights, setItemHeights] = useState<number[]>([]);

  useEffect(() => {
    if (itemHeights.length === children.length) {
      setLayout(calculateMasonryLayout(itemHeights, cols));
    }
  }, [itemHeights, cols, children.length]);

  const handleItemLayout = (index: number, height: number) => {
    setItemHeights(prev => {
      const next = [...prev];
      next[index] = height;
      return next;
    });
  };

  return (
    <View style={{ flexDirection: 'row', gap }}>
      {layout.length > 0 ? (
        // Render distributed layout once calculated
        layout.map((column, colIndex) => (
          <View key={colIndex} style={{ flex: 1, gap }}>
            {column.items.map(itemIndex => (
              <View key={itemIndex}>
                {children[itemIndex]}
              </View>
            ))}
          </View>
        ))
      ) : (
        // Initial render: Render all items invisibly to measure their heights
        <View style={{ position: 'absolute', opacity: 0, width: '100%' }}>
          {children.map((child, index) => (
            <View
              key={index}
              onLayout={(e) => handleItemLayout(index, e.nativeEvent.layout.height)}
            >
              {child}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
```

### `src/measurements.tsx`
*Helper utilities for content measurement. No major changes, just copied.*

```tsx
import { View } from 'react-native';
import React from 'react';

export interface MeasurementResult {
  width: number;
  height: number;
}

/**
 * Measures content size by rendering offscreen
 */
export function measureContent(
  child: React.ReactElement,
  maxWidth: number
): Promise<MeasurementResult> {
  return new Promise((resolve) => {
    // Create offscreen measurement view
    const MeasurementView = () => {
      const [size, setSize] = React.useState<MeasurementResult | null>(null);

      React.useEffect(() => {
        if (size) resolve(size);
      }, [size]);

      return (
        <View
          style={{
            position: 'absolute',
            opacity: 0,
            maxWidth,
          }}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setSize({ width, height });
          }}
        >
          {child}
        </View>
      );
    };

    // Render and measure (happens in single frame)
    return <MeasurementView />;
  });
}

/**
 * Calculates column widths based on content
 */
export async function calculateAutoColumns(
  children: React.ReactNode[],
  cols: number,
  mode: 'min' | 'max' | 'auto'
): Promise<number[]> {
  const measurements = await Promise.all(
    children.map(child =>
      measureContent(child as React.ReactElement, Infinity)
    )
  );

  const columnWidths: number[] = [];

  for (let col = 0; col < cols; col++) {
    const itemsInColumn = children.filter((_, i) => i % cols === col);
    const widthsInColumn = itemsInColumn.map((_, i) =>
      measurements[col + i * cols]?.width || 0
    );

    switch (mode) {
      case 'min':
        columnWidths.push(Math.min(...widthsInColumn));
        break;
      case 'max':
        columnWidths.push(Math.max(...widthsInColumn));
        break;
      case 'auto':
        // Average of min and max
        columnWidths.push(
          (Math.min(...widthsInColumn) + Math.max(...widthsInColumn)) / 2
        );
        break;
    }
  }

  return columnWidths;
}
```

### `src/index.tsx`
*Exports.*

```tsx
export * from './masonry';
export * from './measurements';
```

### `example/src/App.tsx`
*Example usage. Note: `react-native-nativewind-grid` import refers to the local package.*

```tsx
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { MasonryGrid } from 'react-native-nativewind-grid';


export default function App() {
  const items = Array.from({ length: 10 }, (_, i) => i);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Masonry Grid Example</Text>
      <MasonryGrid cols={2} gap={10}>
        {items.map(i => (
          <View key={i} style={[styles.item, { height: 100 + (i % 3) * 50 }]}>
            <Text>Item {i}</Text>
          </View>
        ))}
      </MasonryGrid>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});
```

## 3. Setup in New Workspace

1.  **Dependencies**:
    Running `yarn install` in the new repo should suffice as the heavy lifting was creating the files.
    
2.  **NativeWind**:
    If you intend to use `nativewind` *inside* the library components (e.g. to style default containers), you must:
    - Add `nativewind` and `tailwindcss` as `devDependencies` and potentially `peerDependencies`.
    - Configure `tailwind.config.js` in the library root.
    - However, the current code **does not** import `nativewind`. It accepts standard RN `View` components. This is cleaner as it allows the *user* of the library to style their items however they want (NativeWind, StyleSheet, etc.).
    - If you want the *library itself* to be "NativeWind enhanced" (e.g. accepting `className` props), you would need to wrap components with `cssInterop` from `nativewind`.

    *Example of enabling className support if desired:*
    ```tsx
    import { cssInterop } from "nativewind";
    // ... MasonryGrid definition
    cssInterop(MasonryGrid, { className: "style" });
    ```
