import type { ViewStyle, DimensionValue } from 'react-native';
import type { GridSpec, ItemSpec } from './parser';

export function computeContainerStyle(spec: GridSpec): ViewStyle {
  const gap = spec.gap ?? 0;
  const gapX = spec.gapX ?? gap;
  const gapY = spec.gapY ?? gap;

  return {
    flexDirection: spec.autoFlow === 'column' ? 'column' : 'row',
    flexWrap: 'wrap',
    // We use negative margin on the container to offset the padding on items
    // This allows us to have perfect gaps without overflow issues
    marginHorizontal: -gapX / 2,
    marginVertical: -gapY / 2,
  };
}

export function computeItemStyle(
  gridSpec: GridSpec,
  itemSpec: ItemSpec,
  containerWidth: number
): ViewStyle {
  // Defensive check for container width (e.g. init render)
  if (!containerWidth || containerWidth <= 0) {
    return { width: 0, height: 0, opacity: 0 };
  }

  const gap = gridSpec.gap ?? 0;
  const gapX = gridSpec.gapX ?? gap;
  const gapY = gridSpec.gapY ?? gap;

  const cols = gridSpec.cols || 1;

  // Basic column width calculation
  // (Container Width / Cols) gives the visual slot size.
  // BUT: Our container has negative margins, and items have padding.
  // The 'effective' width available is the passed containerWidth (which ideally matches the parent's available width).
  // Because we added negative margins to the container, the container is actually wider than the parent.
  // However, useWindowDimensions().width is the screen width.
  // If we are strictly passed the "available content width", we might need to adjust.
  // For now, let's assume `containerWidth` is the full width the grid should inhabit.

  // Since we use padding for gaps, the item width includes the gap space.
  const columnWidth = containerWidth / cols;

  const width = columnWidth * (itemSpec.colSpan || 1);

  return {
    width: width as DimensionValue, // Explicit cast
    paddingHorizontal: gapX / 2,
    paddingVertical: gapY / 2,
  };
}
