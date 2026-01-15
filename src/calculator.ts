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
  itemSpec: ItemSpec
): ViewStyle {
  const gap = gridSpec.gap ?? 0;
  const gapX = gridSpec.gapX ?? gap;
  const gapY = gridSpec.gapY ?? gap;

  const cols = gridSpec.cols || 1;

  // Span Logic: Support col-end/row-end
  // If colEnd is present, span = colEnd - colStart (or 1 if no start)
  let colSpan = itemSpec.colSpan || 1;
  if (itemSpec.colEnd) {
    if (itemSpec.colStart) {
      colSpan = itemSpec.colEnd - itemSpec.colStart;
    }
    // Else ignore end without start for now or assume start=1? 
    // Simplified logic: strict grid usually requires explicit placement.
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

  let widthStyle: ViewStyle | undefined;
  if (cols > 0) {
    const widthPercentage = (100 / cols) * colSpan;
    widthStyle = { width: `${widthPercentage}%` as DimensionValue };
  }

  let heightStyle: ViewStyle | undefined;
  // Backward Compatibility: Only calculate height if explicit rows are defined.
  // Otherwise, default to content-based height (flex behavior).
  if (gridSpec.rows && gridSpec.rows > 0) {
    const rowSpan = itemSpec.rowSpan || 1;
    // Calculate percentage height based on total explicit rows
    const heightPercentage = (100 / gridSpec.rows) * rowSpan;
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
