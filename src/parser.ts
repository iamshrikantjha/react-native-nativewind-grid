export type TrackSizing =
  | { type: 'fixed', value: number } // px (default for raw numbers in arbitrary)
  | { type: 'fraction', value: number } // fr
  | { type: 'percent', value: number } // %
  | { type: 'auto' };

export interface GridSpec {
  cols: number | TrackSizing[] | 'subgrid' | undefined;
  rows?: number | TrackSizing[]; // Supported arbitrary rows
  autoCols?: TrackSizing[] | TrackSizing;
  autoRows?: TrackSizing[] | TrackSizing;
  gap: number;
  gapX?: number;
  gapY?: number;
  autoFlow: 'row' | 'column' | 'row dense' | 'column dense';
  // Alignment (Container)
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  areas?: Record<string, { rowStart: number, colStart: number, rowSpan: number, colSpan: number }>;
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
  gridArea?: string;
}

// Helpers
const parseTrackString = (str: string): TrackSizing[] => {
  // Split by underscore or space (common standard in Tailwind arbitrary)
  const parts = str.split(/_| /).filter(Boolean);

  return parts.map(part => {
    if (part === 'auto') return { type: 'auto' };
    if (part === 'min') return { type: 'auto' }; // min-content roughly auto for this
    if (part === 'max') return { type: 'auto' }; // max-content roughly auto for this
    if (part.endsWith('fr')) return { type: 'fraction', value: parseFloat(part) };
    if (part.endsWith('%')) return { type: 'percent', value: parseFloat(part) };
    if (part.endsWith('px')) return { type: 'fixed', value: parseFloat(part) };

    const num = parseFloat(part);
    return isNaN(num) ? { type: 'auto' } : { type: 'fixed', value: num };
  });
};

const parseArbitrary = (cls: string, prefix: string): number | undefined => {
  if (cls.startsWith(`${prefix}[`) && cls.endsWith(']')) {
    const val = cls.slice(prefix.length + 1, -1);
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
};

// Helper to parse grid-template-areas
const parseGridAreas = (val: string): Record<string, { rowStart: number, colStart: number, rowSpan: number, colSpan: number }> => {
  const clean = val.replace(/['"\[\]]/g, '');
  const rows = clean.split(',').map(r => r.trim());

  const areaMap: Record<string, { rMin: number, rMax: number, cMin: number, cMax: number }> = {};

  rows.forEach((rowStr, rowIndex) => {
    const cols = rowStr.split(/_| /).filter(Boolean);

    cols.forEach((areaName, colIndex) => {
      if (areaName === '.') return;

      if (!areaMap[areaName]) {
        areaMap[areaName] = {
          rMin: rowIndex + 1,
          rMax: rowIndex + 1,
          cMin: colIndex + 1,
          cMax: colIndex + 1
        };
      } else {
        const entry = areaMap[areaName];
        entry.rMin = Math.min(entry.rMin, rowIndex + 1);
        entry.rMax = Math.max(entry.rMax, rowIndex + 1);
        entry.cMin = Math.min(entry.cMin, colIndex + 1);
        entry.cMax = Math.max(entry.cMax, colIndex + 1);
      }
    });
  });

  const result: Record<string, any> = {};
  Object.entries(areaMap).forEach(([name, bounds]) => {
    result[name] = {
      rowStart: bounds.rMin,
      colStart: bounds.cMin,
      rowSpan: bounds.rMax - bounds.rMin + 1,
      colSpan: bounds.cMax - bounds.cMin + 1
    };
  });

  return result;
};

const parseArbitraryTracks = (cls: string, prefix: string): TrackSizing[] | undefined => {
  if (cls.startsWith(`${prefix}[`) && cls.endsWith(']')) {
    const val = cls.slice(prefix.length + 1, -1);
    // If it looks like a complex string (has letters/units), parse as tracks
    if (val.match(/[a-z%]/i) || val.includes('_')) {
      return parseTrackString(val);
    }
  }
  return undefined;
};

const parseAutoTracks = (val: string): TrackSizing | undefined => {
  if (val === 'auto') return { type: 'auto' };
  if (val === 'min') return { type: 'auto' };
  if (val === 'max') return { type: 'auto' };
  if (val === 'fr') return { type: 'fraction', value: 1 };
  if (val.endsWith('fr')) return { type: 'fraction', value: parseFloat(val) };
  if (val.endsWith('%')) return { type: 'percent', value: parseFloat(val) };
  if (val.endsWith('px')) return { type: 'fixed', value: parseFloat(val) };
  // Check arbitrary: auto-cols-[100px] -> val is [100px] in some parsers, but here val is passed clean?
  // Let's assume val is the resolved part.
  const num = parseFloat(val);
  return isNaN(num) ? undefined : { type: 'fixed', value: num };
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

// ... (mappings) ...

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
    cols: undefined, // Default to undefined to distinguish from explicit grid-cols-1
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
    } else if (cls === 'grid-cols-subgrid') {
      spec.cols = 'subgrid';
    } else {
      const complex = parseArbitraryTracks(cls, 'grid-cols-');
      if (complex) {
        spec.cols = complex;
      } else {
        const cols = parseValue(cls, 'grid-cols-');
        if (cols !== undefined) spec.cols = cols;
      }
    }

    // grid-rows
    const complexRows = parseArbitraryTracks(cls, 'grid-rows-');
    if (complexRows) {
      spec.rows = complexRows;
    } else {
      const rows = parseValue(cls, 'grid-rows-');
      if (rows !== undefined) spec.rows = rows;
    }

    // auto-cols
    if (cls.startsWith('auto-cols-')) {
      // Check arbitrary: auto-cols-[100px]
      if (cls.includes('[')) {
        const val = cls.slice(cls.indexOf('[') + 1, -1);
        const track = parseAutoTracks(val);
        if (track) spec.autoCols = track;
      } else {
        const val = cls.replace('auto-cols-', '');
        const track = parseAutoTracks(val);
        if (track) spec.autoCols = track;
      }
    }

    // auto-rows
    if (cls.startsWith('auto-rows-')) {
      if (cls.includes('[')) {
        const val = cls.slice(cls.indexOf('[') + 1, -1);
        const track = parseAutoTracks(val);
        if (track) spec.autoRows = track;
      } else {
        const val = cls.replace('auto-rows-', '');
        const track = parseAutoTracks(val);
        if (track) spec.autoRows = track;
      }
    }

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

    // Grid Areas
    if (cls.startsWith('grid-areas-[')) {
      const val = cls.slice('grid-areas-['.length, -1);
      spec.areas = parseGridAreas(val);
    }

    // Flow
    if (cls === 'grid-flow-col') spec.autoFlow = 'column';
    if (cls === 'grid-flow-row-dense') spec.autoFlow = 'row dense';
    if (cls === 'grid-flow-col-dense') spec.autoFlow = 'column dense';
    if (cls === 'grid-flow-dense') spec.autoFlow = 'row dense'; // Default to row dense

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

    // Grid Area Item
    if (cls.startsWith('area-')) {
      const val = cls.replace('area-', '');
      if (val.startsWith('[') && val.endsWith(']')) {
        spec.gridArea = val.slice(1, -1);
      } else {
        spec.gridArea = val;
      }
    }
    if (cls.startsWith('grid-area-')) {
      const val = cls.replace('grid-area-', '');
      if (val.startsWith('[') && val.endsWith(']')) {
        spec.gridArea = val.slice(1, -1);
      } else {
        spec.gridArea = val;
      }
    }
  });

  return spec;
}
