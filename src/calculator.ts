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
    // 'stretch' is default. 'center' would center the wrapper vertically in the row.
    alignContent: spec.alignContent || 'stretch',     // Default to stretch to mimic Grid Track behavior (filling container)

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
  resolvedPlacement?: { colStart: number; colSpan: number; rowStart: number; rowSpan: number }
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

  // Complex Tracks Logic (Columns/Width)
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
        // Determine track definition
        let track: any = null;
        if (i < cols.length) {
          track = cols[i];
        } else {
          // Implicit column -> use autoCols
          // autoCols can be single or array (cyclic)? Spec says TrackSizing[] | TrackSizing.
          // Parser mostly produces single TrackSizing.
          if (gridSpec.autoCols) {
            if (Array.isArray(gridSpec.autoCols)) {
              // Cycle if array? Or just 0? CSS Grid usually repeats the pattern.
              // For now assume single or simplistic.
              track = gridSpec.autoCols[(i - cols.length) % gridSpec.autoCols.length];
            } else {
              track = gridSpec.autoCols;
            }
          } else {
            track = { type: 'auto' }; // Default implicit
          }
        }

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
  else if (typeof cols === 'number' || cols === undefined) {
    const colCount = typeof cols === 'number' ? cols : 1;
    if (colCount > 0) {
      const widthPercentage = (100 / colCount) * colSpan;
      widthStyle = { width: `${widthPercentage}%` as DimensionValue };
    }
  }


  // Alignment (Item Wrapper Internal Alignment)
  // Grid 'justify-items' (Inline Axis) -> Wrapper 'alignItems' (Cross Axis of Column Flex)
  // Grid 'align-items' (Block Axis)   -> Wrapper 'justifyContent' (Main Axis of Column Flex)

  // Resolve effective values (Self overrides Container)

  // Inline Axis (Horizontal)
  // Default to 'stretch' if not specified, matching CSS Grid default behavior for normal flow
  const justify = (itemSpec.justifySelf && itemSpec.justifySelf !== 'auto')
    ? itemSpec.justifySelf
    : (gridSpec.justifyItems || 'stretch');

  // Block Axis (Vertical)
  const align = (itemSpec.alignSelf && itemSpec.alignSelf !== 'auto')
    ? itemSpec.alignSelf
    : (gridSpec.alignItems || 'stretch');


  // Wrapper is Flex Column.
  // Horizontal Alignment (Grid Justify) -> alignItems
  let wrapperAlignItems: ViewStyle['alignItems'];
  switch (justify) {
    case 'start': wrapperAlignItems = 'flex-start'; break;
    case 'end': wrapperAlignItems = 'flex-end'; break;
    case 'center': wrapperAlignItems = 'center'; break;
    case 'stretch': wrapperAlignItems = 'stretch'; break;
    default: wrapperAlignItems = 'stretch'; break;
  }

  // Vertical Alignment (Grid Align) -> justifyContent
  let wrapperJustifyContent: ViewStyle['justifyContent'];
  switch (align) {
    case 'flex-start': wrapperJustifyContent = 'flex-start'; break;
    case 'flex-end': wrapperJustifyContent = 'flex-end'; break;
    case 'center': wrapperJustifyContent = 'center'; break;
    case 'stretch': wrapperJustifyContent = 'flex-start'; break; // Default to start for vertical stretch (content expands via height/flex-grow)
    case 'baseline': wrapperJustifyContent = 'flex-start'; break;
    default: wrapperJustifyContent = 'flex-start';
  }

  // ... (Rows logic omitted for brevity, keeping existing) ...
  // [Rows Logic Block would be here, but using MultiReplace might miss context if I don't include it. 
  // I will just return the object update since I can't easily include the huge rows block in a reliable replace without context errors.]

  // Actually, I can replace the return statement block safely.
  // But I need to preserve the `heightStyle` logic.
  // I will only replace the top block and the return block separately if possible.
  // Or just replace the top block (calculation) and rely on existing return uses `wrapperAlignItems`.

  // Wait, I need to add `flexDirection: 'column'` to the return. 
  // So I should replace the return usage too.


  let heightStyle: ViewStyle | undefined;

  // ROWS LOGIC
  const rows = gridSpec.rows;

  // 1. Array-based Rows (Arbitrary)
  if (Array.isArray(rows)) {
    if (resolvedPlacement) {
      const startIdx = resolvedPlacement.rowStart - 1;
      const endIdx = startIdx + (itemSpec.rowSpan || 1);

      let flexGrow = 0;
      let pixelHeight = 0;
      let isPercent = false;
      let percentTotal = 0;

      for (let i = startIdx; i < endIdx; i++) {
        let track: any = null;
        if (i < rows.length) {
          track = rows[i];
        } else {
          // Implicit row -> autoRows
          if (gridSpec.autoRows) {
            if (Array.isArray(gridSpec.autoRows)) {
              track = gridSpec.autoRows[(i - rows.length) % gridSpec.autoRows.length];
            } else {
              track = gridSpec.autoRows;
            }
          } else {
            track = { type: 'auto' };
          }
        }

        if (!track) continue;

        if (track.type === 'fraction') {
          flexGrow += track.value;
        } else if (track.type === 'fixed') {
          pixelHeight += track.value;
        } else if (track.type === 'percent') {
          isPercent = true;
          percentTotal += track.value;
        }
      }

      if (flexGrow > 0) {
        heightStyle = { flexGrow, flexBasis: pixelHeight > 0 ? pixelHeight : 0 };
      } else if (isPercent) {
        heightStyle = { height: `${percentTotal}%` as DimensionValue };
      } else if (pixelHeight > 0) {
        heightStyle = { height: pixelHeight };
      }
    }
  }
  // 2. Number-based Rows (Explicit)
  else if (typeof rows === 'number' && rows > 0) {
    const rowSpan = itemSpec.rowSpan || 1;
    // Calculate percentage height based on total explicit rows
    const heightPercentage = (100 / rows) * rowSpan;
    // We must ensure the container has height for this to work, 
    // usually handled by flex: 1 on container or fixed height.
    heightStyle = { height: `${heightPercentage}%` as DimensionValue };
  }

  return {
    ...widthStyle,
    ...heightStyle,
    paddingHorizontal: gapX / 2,
    paddingVertical: gapY / 2,

    // Inner Alignment
    display: 'flex',
    flexDirection: 'column',
    alignItems: wrapperAlignItems,
    justifyContent: wrapperJustifyContent,
  };
}
