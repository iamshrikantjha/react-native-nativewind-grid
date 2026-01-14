import type { ViewStyle, DimensionValue } from 'react-native';
import type { GridSpec, ItemSpec } from './parser';

export function computeContainerStyle(spec: GridSpec): ViewStyle {
  const gap = spec.gap ?? 0;
  const gapX = spec.gapX ?? gap;
  const gapY = spec.gapY ?? gap;

  // With percentage widths, we still need negative margins on the container
  // to offset the padding on items (which create the gaps).
  return {
    flexDirection: spec.autoFlow === 'column' ? 'column' : 'row',
    flexWrap: 'wrap',
    marginHorizontal: -gapX / 2,
    marginVertical: -gapY / 2,
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
  // Container width is no longer needed!
): ViewStyle {
  const gap = gridSpec.gap ?? 0;
  const gapX = gridSpec.gapX ?? gap;
  const gapY = gridSpec.gapY ?? gap;

  const cols = gridSpec.cols || 1;
  const span = itemSpec.colSpan || 1;

  // Percentage width calculation
  // 100% / cols * span
  // Example: 3 cols, span 1 = 33.333%
  const widthPercentage = (100 / cols) * span;

  return {
    width: `${widthPercentage}%` as DimensionValue,
    paddingHorizontal: gapX / 2,
    paddingVertical: gapY / 2,
  };
}
