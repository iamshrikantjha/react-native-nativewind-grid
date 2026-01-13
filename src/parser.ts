export interface GridSpec {
  cols: number;
  rows?: number; // Optional for now, main use case is cols
  gap: number;
  gapX?: number;
  gapY?: number;
  autoFlow: 'row' | 'column';
  autoCols?: string;
  autoRows?: string;
}

export interface ItemSpec {
  colSpan: number;
  rowSpan: number;
  colStart?: number;
  rowStart?: number;
  colEnd?: number;
  rowEnd?: number;
}

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
    // grid-cols-{n}
    if (cls.startsWith('grid-cols-')) {
      const val = cls.replace('grid-cols-', '');
      const num = parseInt(val, 10);
      if (!isNaN(num)) spec.cols = num;
    }

    // grid-rows-{n}
    if (cls.startsWith('grid-rows-')) {
      const val = cls.replace('grid-rows-', '');
      const num = parseInt(val, 10);
      if (!isNaN(num)) spec.rows = num;
    }

    // gap-{n}
    // Note: In Tailwind, gap-1 is 0.25rem (4px). We assume standard 4px base.
    // If users use arbitrary values or config, this simple parser might drift,
    // but for now we follow standard multiplier.
    if (cls.startsWith('gap-')) {
      if (cls.startsWith('gap-x-')) {
        const val = cls.replace('gap-x-', '');
        const num = parseInt(val, 10);
        if (!isNaN(num)) spec.gapX = num * 4;
      } else if (cls.startsWith('gap-y-')) {
        const val = cls.replace('gap-y-', '');
        const num = parseInt(val, 10);
        if (!isNaN(num)) spec.gapY = num * 4;
      } else {
        const val = cls.replace('gap-', '');
        const num = parseInt(val, 10);
        if (!isNaN(num)) spec.gap = num * 4;
      }
    }

    // grid-flow-col
    if (cls === 'grid-flow-col') {
      spec.autoFlow = 'column';
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
    // col-span-{n}
    if (cls.startsWith('col-span-')) {
      const val = cls.replace('col-span-', '');
      const num = parseInt(val, 10);
      if (!isNaN(num)) spec.colSpan = num;
    }

    // row-span-{n}
    if (cls.startsWith('row-span-')) {
      const val = cls.replace('row-span-', '');
      const num = parseInt(val, 10);
      if (!isNaN(num)) spec.rowSpan = num;
    }

    // col-start-{n}
    if (cls.startsWith('col-start-')) {
      const val = cls.replace('col-start-', '');
      const num = parseInt(val, 10);
      if (!isNaN(num)) spec.colStart = num;
    }

    // row-start-{n}
    if (cls.startsWith('row-start-')) {
      const val = cls.replace('row-start-', '');
      const num = parseInt(val, 10);
      if (!isNaN(num)) spec.rowStart = num;
    }
  });

  return spec;
}
