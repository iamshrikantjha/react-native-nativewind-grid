import type { ViewStyle, DimensionValue } from 'react-native';
import type { GridSpec, ItemSpec } from './parser';

export function computeContainerStyle(spec: GridSpec): ViewStyle {
  const gap = spec.gap ?? 0;
  const gapX = spec.gapX ?? gap;
  const gapY = spec.gapY ?? gap;

  // Map Grid Alignment to Flexbox Container Alignment
  // justify-content (Grid) -> Main Axis Distribution
  // align-content (Grid) -> Cross Axis Distribution (Lines)
  // align-items (Grid) -> Cross Axis Item Alignment (Note: We handle 'justify-items' on the child wrapper)

  return {
    flexDirection: spec.autoFlow === 'column' ? 'column' : 'row',
    flexWrap: 'wrap',
    marginHorizontal: -gapX / 2,
    marginVertical: -gapY / 2,

    // Explicit Alignment mapping
    // Explicit Alignment mapping
    justifyContent: spec.justifyContent, // e.g. 'center', 'space-between'
    // alignContent is handled below to avoid duplication errors if previously added incorrectly

    // alignItems: spec.alignItems,      // Not usually used on the Grid container itself for cells, but maybe? 
    // Actually, 'align-items' in Grid affects Direct Children.
    // Since our Direct Children are Wrappers, this aligns the Wrappers in the row.
    // 'stretch' is default. 'center' would center the wrapper vertically in the row.
    alignContent: spec.alignContent,     // e.g. 'center', 'space-around'

    // CRITICAL FIX: Decouple item alignment from container alignment.
    // In Grid, align-items aligns items *inside* their area.
    // In Flexbox, align-items aligns the areas (wrappers) in the line.
    // We must ensure wrappers stretch to fill the line so internal alignment works.
    alignItems: 'stretch',

    // We explicitly reset strict gap properties to 0 because NativeWind might
    // translate 'gap-X' classes into native gap styles. We handle gaps manually via padding.
    gap: 0,
    rowGap: 0,
    columnGap: 0,
  };
}

export function computeItemStyle(
  gridSpec: GridSpec,
  itemSpec: ItemSpec,
  resolvedPlacement?: { colStart: number; colSpan: number }
): ViewStyle {
  const gap = gridSpec.gap ?? 0;
  const gapX = gridSpec.gapX ?? gap;
  const gapY = gridSpec.gapY ?? gap;

  // determine effective colSpan
  let colSpan = itemSpec.colSpan || 1;
  if (resolvedPlacement) {
    colSpan = resolvedPlacement.colSpan;
  } else if (itemSpec.colEnd && itemSpec.colStart) {
    colSpan = itemSpec.colEnd - itemSpec.colStart;
  }

  const cols = gridSpec.cols;

  // Width Calculation
  let widthStyle: ViewStyle | undefined;

  // Complex Tracks Logic
  if (Array.isArray(cols)) {
    if (resolvedPlacement) {
      // calculate width based on specific tracks
      // resolvedPlacement.colStart is 1-based
      const startIdx = resolvedPlacement.colStart - 1;
      const endIdx = startIdx + colSpan;

      let flexGrow = 0;
      let pixelWidth = 0;
      let isPercent = false;
      let percentTotal = 0;

      for (let i = startIdx; i < endIdx; i++) {
        if (i >= cols.length) break;
        const track = cols[i];
        if (!track) continue; // Safety check

        if (track.type === 'fraction') {
          flexGrow += track.value;
        } else if (track.type === 'fixed') {
          pixelWidth += track.value;
        } else if (track.type === 'percent') {
          isPercent = true;
          percentTotal += track.value;
        } else if (track.type === 'auto') {
          // auto logic
        }
      }

      if (flexGrow > 0) {
        widthStyle = { flexGrow, flexBasis: pixelWidth > 0 ? pixelWidth : 0 };
      } else if (isPercent) {
        widthStyle = { width: `${percentTotal}%` as DimensionValue };
      } else if (pixelWidth > 0) {
        widthStyle = { width: pixelWidth };
      } else {
        // auto fallback
      }

    } else {
      // Fallback if no placement (shouldn't happen in strict mode)
      widthStyle = { width: 'auto' };
    }
  }
  // Simple Number Logic
  else if (typeof cols === 'number' && cols > 0) {
    const widthPercentage = (100 / cols) * colSpan;
    widthStyle = { width: `${widthPercentage}%` as DimensionValue };
  }


  // Alignment (Item Wrapper Internal Alignment)
  // Grid 'justify-items' (Inline Axis) -> Wrapper 'alignItems' (Cross Axis of Column Flex)
  // Grid 'align-items' (Block Axis)   -> Wrapper 'justifyContent' (Main Axis of Column Flex)

  // Resolve effective values (Self overrides Container)

  // Inline Axis (Horizontal)
  const justify = itemSpec.justifySelf && itemSpec.justifySelf !== 'auto'
    ? itemSpec.justifySelf
    : gridSpec.justifyItems; // Inherit container justify-items

  // Block Axis (Vertical)
  const align = itemSpec.alignSelf && itemSpec.alignSelf !== 'auto'
    ? itemSpec.alignSelf
    : undefined;

  // Let's implement Inner Alignment on Wrapper:
  // Wrapper is Flex Column.
  // Horizontal Center = alignItems: center
  // Vertical Center   = justifyContent: center

  let wrapperAlignItems: ViewStyle['alignItems']; // Horizontal
  switch (justify) {
    case 'start': wrapperAlignItems = 'flex-start'; break;
    case 'end': wrapperAlignItems = 'flex-end'; break;
    case 'center': wrapperAlignItems = 'center'; break;
    case 'stretch': wrapperAlignItems = 'stretch'; break;
  }

  let wrapperJustifyContent: ViewStyle['justifyContent']; // Vertical

  const effectiveAlign = align || gridSpec.alignItems; // Fallback to container items
  switch (effectiveAlign) {
    case 'flex-start': wrapperJustifyContent = 'flex-start'; break;
    case 'flex-end': wrapperJustifyContent = 'flex-end'; break;
    case 'center': wrapperJustifyContent = 'center'; break;
    case 'stretch': wrapperJustifyContent = 'space-between'; break;
  }

  let heightStyle: ViewStyle | undefined;
  // Backward Compatibility: Only calculate height if explicit rows are defined.
  // Otherwise, default to content-based height (flex behavior).

  // Checking rows type safely
  const rows = gridSpec.rows;
  if (typeof rows === 'number' && rows > 0) {
    const rowSpan = itemSpec.rowSpan || 1;
    // Calculate percentage height based on total explicit rows
    const heightPercentage = (100 / rows) * rowSpan;
    heightStyle = { height: `${heightPercentage}%` as DimensionValue };
  }

  // Inner Alignment
  // ... (rest of logic)

  return {
    ...widthStyle,
    ...heightStyle,
    paddingHorizontal: gapX / 2,
    paddingVertical: gapY / 2,

    // Inner Alignment
    alignItems: wrapperAlignItems,
    justifyContent: wrapperJustifyContent,
  };
}
