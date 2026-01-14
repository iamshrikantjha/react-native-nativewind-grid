export interface GridSpec {
  cols: number;
  rows?: number;
  gap: number;
  gapX?: number;
  gapY?: number;
  autoFlow: 'row' | 'column';
  // Alignment (Container)
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
}

export interface ItemSpec {
  colSpan: number;
  rowSpan: number;
  colStart?: number;
  rowStart?: number;
  colEnd?: number;
  rowEnd?: number;
  order?: number;
  // Alignment (Item)
  justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
}

// Helpers
const parseArbitrary = (cls: string, prefix: string): number | undefined => {
  if (cls.startsWith(`${prefix}[`) && cls.endsWith(']')) {
    const val = cls.slice(prefix.length + 1, -1);
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
};

const parseValue = (cls: string, prefix: string): number | undefined => {
  // Check arbitrary first: prefix-[123]
  const arb = parseArbitrary(cls, prefix);
  if (arb !== undefined) return arb;

  // Check standard: prefix-12
  if (cls.startsWith(prefix)) {
    const val = cls.replace(prefix, '');
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
};

// Map tailwind classes to flexbox values
const mapJustifyContent = (val: string) => {
  switch (val) {
    case 'start': return 'flex-start';
    case 'end': return 'flex-end';
    case 'center': return 'center';
    case 'between': return 'space-between';
    case 'around': return 'space-around';
    case 'evenly': return 'space-evenly';
    default: return undefined;
  }
};

const mapAlignContent = (val: string) => {
  switch (val) {
    case 'start': return 'flex-start';
    case 'end': return 'flex-end';
    case 'center': return 'center';
    case 'between': return 'space-between';
    case 'around': return 'space-around';
    case 'stretch': return 'stretch';
    default: return undefined;
  }
};

const mapAlignItems = (val: string) => {
  switch (val) {
    case 'start': return 'flex-start';
    case 'end': return 'flex-end';
    case 'center': return 'center';
    case 'baseline': return 'baseline';
    case 'stretch': return 'stretch';
    default: return undefined;
  }
};

const mapAlignSelf = (val: string) => {
  switch (val) {
    case 'auto': return 'auto';
    case 'start': return 'flex-start';
    case 'end': return 'flex-end';
    case 'center': return 'center';
    case 'stretch': return 'stretch';
    case 'baseline': return 'baseline';
    default: return undefined;
  }
};

export function parseGridClasses(className?: string): GridSpec {
  const spec: GridSpec = {
    cols: 1,
    rows: undefined,
    gap: 0,
    autoFlow: 'row',
  };

  if (!className) return spec;

  const classes = className.split(/\s+/);

  classes.forEach((cls) => {
    // grid-cols
    if (cls === 'grid-cols-none') {
      spec.cols = 0; // Signal to calculator to use auto width
    } else {
      const cols = parseValue(cls, 'grid-cols-');
      if (cols !== undefined) spec.cols = cols;
    }

    // grid-rows
    const rows = parseValue(cls, 'grid-rows-');
    if (rows !== undefined) spec.rows = rows;

    // gap
    // Note: Arbitrary values like gap-[20px] will be parsed as 20.
    // Standard gap-{n} is n * 4.
    if (cls.startsWith('gap-')) {
      // Check arbitrary first: gap-[10px]
      if (cls.includes('[')) {
        const arb = parseArbitrary(cls, 'gap-');
        if (arb !== undefined) {
          spec.gap = arb;
          return; // Skip standard check
        }
        // X/Y arbitrary
        const arbX = parseArbitrary(cls, 'gap-x-');
        if (arbX !== undefined) {
          spec.gapX = arbX;
          return;
        }
        const arbY = parseArbitrary(cls, 'gap-y-');
        if (arbY !== undefined) {
          spec.gapY = arbY;
          return;
        }
      }

      // Standard logic
      if (cls.startsWith('gap-x-')) {
        const val = parseInt(cls.replace('gap-x-', ''), 10);
        if (!isNaN(val)) spec.gapX = val * 4;
      } else if (cls.startsWith('gap-y-')) {
        const val = parseInt(cls.replace('gap-y-', ''), 10);
        if (!isNaN(val)) spec.gapY = val * 4;
      } else {
        // Standard gap-
        const val = parseInt(cls.replace('gap-', ''), 10);
        if (!isNaN(val)) spec.gap = val * 4;
      }
    }

    // Flow
    if (cls === 'grid-flow-col') spec.autoFlow = 'column';

    // Alignment
    if (cls.startsWith('justify-content-') || cls.startsWith('justify-')) { // loose match for content
      const val = cls.replace(/^justify-(content-)?/, '');
      const mapped = mapJustifyContent(val);
      if (mapped) spec.justifyContent = mapped as any;
    }
    if (cls.startsWith('align-content-')) {
      const val = cls.replace('align-content-', '');
      const mapped = mapAlignContent(val);
      if (mapped) spec.alignContent = mapped as any;
    }
    if (cls.startsWith('items-') || cls.startsWith('align-items-')) {
      const val = cls.replace(/^(items-|align-items-)/, '');
      const mapped = mapAlignItems(val);
      if (mapped) spec.alignItems = mapped as any;
    }
    if (cls.startsWith('justify-items-')) {
      const val = cls.replace('justify-items-', '');
      if (['start', 'end', 'center', 'stretch'].includes(val)) {
        spec.justifyItems = val as any;
      }
    }
    // place-content: {align-content} {justify-content}
    if (cls.startsWith('place-content-')) {
      const val = cls.replace('place-content-', '');
      const mappedJustify = mapJustifyContent(val);
      const mappedAlign = mapAlignContent(val);
      if (mappedJustify) spec.justifyContent = mappedJustify as any;
      if (mappedAlign) spec.alignContent = mappedAlign as any;
    }
    // place-items: {align-items} {justify-items}
    if (cls.startsWith('place-items-')) {
      const val = cls.replace('place-items-', '');
      // Mapping for items is slightly disparate (align-items vs justify-items)
      // align-items supports baseline/flex-start... justify supports start/end...

      // Handle safe subsets
      if (['center', 'stretch'].includes(val)) {
        spec.alignItems = val as any;
        spec.justifyItems = val as any;
      }
      if (val === 'start') {
        spec.alignItems = 'flex-start';
        spec.justifyItems = 'start';
      }
      if (val === 'end') {
        spec.alignItems = 'flex-end';
        spec.justifyItems = 'end';
      }
    }
  });

  return spec;
}

export function parseItemClasses(className?: string): ItemSpec {
  const spec: ItemSpec = {
    colSpan: 1,
    rowSpan: 1,
  };

  if (!className) return spec;
  const classes = className.split(/\s+/);

  classes.forEach((cls) => {
    // Spans
    const colSpan = parseValue(cls, 'col-span-');
    if (colSpan !== undefined) spec.colSpan = colSpan;

    const rowSpan = parseValue(cls, 'row-span-');
    if (rowSpan !== undefined) spec.rowSpan = rowSpan;

    // Starts
    const colStart = parseValue(cls, 'col-start-');
    if (colStart !== undefined) spec.colStart = colStart;

    const rowStart = parseValue(cls, 'row-start-');
    if (rowStart !== undefined) spec.rowStart = rowStart;

    // Ends
    const colEnd = parseValue(cls, 'col-end-');
    if (colEnd !== undefined) spec.colEnd = colEnd;

    const rowEnd = parseValue(cls, 'row-end-');
    if (rowEnd !== undefined) spec.rowEnd = rowEnd;

    // Order
    const order = parseValue(cls, 'order-');
    if (order !== undefined) spec.order = order;
    // first/last/none
    if (cls === 'order-first') spec.order = -9999;
    if (cls === 'order-last') spec.order = 9999;
    if (cls === 'order-none') spec.order = 0;

    // Alignment Self
    if (cls.startsWith('self-') || cls.startsWith('align-self-')) {
      const val = cls.replace(/^(self-|align-self-)/, '');
      const mapped = mapAlignSelf(val);
      if (mapped) spec.alignSelf = mapped as any;
    }
    if (cls.startsWith('justify-self-')) {
      const val = cls.replace('justify-self-', '');
      if (['auto', 'start', 'end', 'center', 'stretch'].includes(val)) {
        spec.justifySelf = val as any;
      }
    }
    // place-self: {align-self} {justify-self}? 
    // Tailwind shortcuts: place-self-center -> align-self: center, justify-self: center
    // place-self-start -> start start
    if (cls.startsWith('place-self-')) {
      const val = cls.replace('place-self-', '');
      // Common values shortcut
      if (['auto', 'start', 'end', 'center', 'stretch'].includes(val)) {
        spec.alignSelf = mapAlignSelf(val) as any;
        spec.justifySelf = val as any;
      }
    }
  });

  return spec;
}
