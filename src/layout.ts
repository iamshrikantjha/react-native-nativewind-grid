import type { GridSpec, ItemSpec } from './parser';

export interface GridItem {
    id: string; // key or index
    order: number;
    spec: ItemSpec;
    originalIndex: number;
}

export interface PlacedGridItem {
    id: string;
    spec: ItemSpec;

    // Resolved position in grid units (1-based)
    rowStart: number;
    colStart: number;
    rowSpan: number;
    colSpan: number;

    // For Debug
    isImplicit?: boolean;
}

export type PlacedItem = PlacedGridItem;

/**
 * Core Grid Placement Algorithm
 * 
 * 1. Normalize items
 * 2. Sort items
 * 3. Initialize Grid Map
 * 4. Place items one by one
 *    - Explicit placement
 *    - Auto placement
 */
export function computeGridLayout(
    items: GridItem[],
    gridSpec: GridSpec,
    debug: boolean = false
): { placedItems: PlacedItem[], totalRows: number, droppedItems: GridItem[] } {

    const totalCols = (Array.isArray(gridSpec.cols))
        ? gridSpec.cols.length
        : (typeof gridSpec.cols === 'number' ? gridSpec.cols : (gridSpec.autoFlow?.includes('column') ? 1000 : 1));
    const autoFlow = gridSpec.autoFlow || 'row';
    const isDense = autoFlow.includes('dense');

    // Grid Map: grid[row][col] = occupied?
    // We use 0-based internal indexing for the map, but 1-based for the spec output
    const gridMap: boolean[][] = [];

    const placedItems: PlacedItem[] = [];
    const droppedItems: GridItem[] = [];

    // Helper to check occupancy
    const isOccupied = (r: number, c: number, rSpan: number, cSpan: number): boolean => {
        for (let i = 0; i < rSpan; i++) {
            const row = gridMap[r + i];
            if (!row) continue; // Row empty means slots empty
            for (let j = 0; j < cSpan; j++) {
                if (row[c + j]) {
                    return true;
                }
            }
        }
        return false;
    };

    // Helper to mark occupancy
    const markOccupied = (r: number, c: number, rSpan: number, cSpan: number) => {
        for (let i = 0; i < rSpan; i++) {
            let row = gridMap[r + i];
            if (!row) {
                row = [];
                gridMap[r + i] = row;
            }
            for (let j = 0; j < cSpan; j++) {
                row[c + j] = true;
            }
        }
    };

    // Cursors for auto-placement
    let autoRow = 0;
    let autoCol = 0;

    // Process items
    items.forEach(item => {
        const { spec } = item;

        // Resolve Grid Area override
        if (spec.gridArea && gridSpec.areas) {
            const area = gridSpec.areas[spec.gridArea];
            if (area) {
                spec.rowStart = area.rowStart;
                spec.colStart = area.colStart;
                spec.rowSpan = area.rowSpan;
                spec.colSpan = area.colSpan;
            }
        }

        // Default spans
        // Default spans (initial read)
        let colSpan = Math.min(spec.colSpan || 1, totalCols);
        let rowSpan = spec.rowSpan || 1;

        let targetRow = -1;
        let targetCol = -1;

        // --- RESOLVE SPANS & STARTS FROM ENDS ---
        // 1. Column Logic
        if (spec.colEnd !== undefined) {
            if (spec.colStart !== undefined) {
                // Both Start & End -> Explicit Span
                // defined: col-start-2 col-end-5
                // span = 5 - 2 = 3
                const s = spec.colStart - 1; // 0-based
                const e = spec.colEnd - 1;   // 0-based
                if (e > s) {
                    item.spec.colSpan = e - s;     // Overwrite span
                }
            } else {
                // End only -> Back calc Start
                // valid: col-end-4 col-span-2 -> start = 4 - 2 = 2
                // valid: col-end-4 (default span 1) -> start = 3
                const e = spec.colEnd - 1;
                const span = item.spec.colSpan || 1;
                item.spec.colStart = (e - span) + 1; // Convert back to 1-based for consistent logic below
            }
        }

        // 2. Row Logic
        if (spec.rowEnd !== undefined) {
            if (spec.rowStart !== undefined) {
                // Both
                const s = spec.rowStart - 1;
                const e = spec.rowEnd - 1;
                if (e > s) {
                    item.spec.rowSpan = e - s;
                }
            } else {
                // End only
                const e = spec.rowEnd - 1;
                const span = item.spec.rowSpan || 1;
                item.spec.rowStart = (e - span) + 1;
            }
        }

        // Re-read potentially updated values
        colSpan = Math.min(item.spec.colSpan || 1, totalCols);
        rowSpan = item.spec.rowSpan || 1;

        // CASE 1: Explicit Placement (Both defined)
        if (spec.rowStart !== undefined && spec.colStart !== undefined) {
            targetRow = spec.rowStart - 1;
            targetCol = spec.colStart - 1;
        }
        // CASE 1b: Explicit Row Only
        else if (spec.rowStart !== undefined) {
            targetRow = spec.rowStart - 1;
            // We need to find a column in this specific row
            let c = 0;
            while (true) {
                // Check bounds
                if (c + colSpan > totalCols) {
                    // Cannot fit in this row anymore? 
                    // In CSS grid, if row is explicit, it usually forces placement. 
                    // If it doesn't fit, it might overflow or overlap. 
                    // For now, we search for first available slot in that row.
                    // If we strictly follow CSS, it might create implicit rows?
                    // Let's stick to: find first slot in this row.
                    // If we exceed cols, we might have to wrap to next row? No, row is fixed.
                    break;
                }
                if (!isOccupied(targetRow, c, rowSpan, colSpan)) {
                    targetCol = c;
                    break;
                }
                c++;
                if (c > totalCols * 2) break; // safety break
            }

            if (targetCol === -1) {
                // Could not place in defined row?
                // Fallback: Just place at start? Or log warning?
                if (debug) console.warn(`[Grid] Could not find slot for explicit row item ${item.id} on row ${spec.rowStart}`);
                targetCol = 0; // Force overlap or overflow
            }
        }
        // CASE 1c: Explicit Col Only
        else if (spec.colStart !== undefined) {
            targetCol = spec.colStart - 1;
            // Find first available row for this column
            let r = 0;
            while (true) {
                if (!isOccupied(r, targetCol, rowSpan, colSpan)) {
                    targetRow = r;
                    break;
                }
                r++;
            }
        }
        // CASE 2: Auto Placement
        else {
            const isColumnFlow = autoFlow.includes('column');

            if (isDense) {
                // Dense Packing
                if (!isColumnFlow) {
                    // Row-Major Scan (Original)
                    let placed = false;
                    // Scan Rows then Cols
                    // Note: We scan potentially infinite rows if sparse, but for dense we usually fill holes.
                    // If strict rows defined, we limit. If not, proceed until placed.
                    let r = 0;
                    let c = 0;
                    while (!placed) {
                        if (c + colSpan <= totalCols) {
                            if (!isOccupied(r, c, rowSpan, colSpan)) {
                                targetRow = r;
                                targetCol = c;
                                placed = true;
                            }
                        }
                        c++;
                        if (c >= totalCols) {
                            c = 0;
                            r++;
                        }
                        if (r > 1000) break; // safety
                    }
                } else {
                    // Column-Major Scan (New)
                    // San Columns then Rows
                    let placed = false;
                    let c = 0;
                    let r = 0; // Scan r=0..totalRows
                    while (!placed) {
                        // Check logic: 
                        // Check if we fit in current slot (c, r)
                        // Ensure rowSpan fits in totalRows (if strictly defined?)
                        // If totalRows is explicit (grid-rows-3), item cannot exceed it?
                        // Actually CSS Grid: if item is taller than explicit rows, it creates implicit rows?
                        // But for column flow wrapping, we wrap when we hit explicit boundary.

                        const rowsLimit = (typeof gridSpec.rows === 'number')
                            ? gridSpec.rows
                            : (Array.isArray(gridSpec.rows) ? gridSpec.rows.length : 10000);

                        // Check if item fits vertically
                        if (r + rowSpan <= rowsLimit) {
                            if (!isOccupied(r, c, rowSpan, colSpan)) {
                                targetRow = r;
                                targetCol = c;
                                placed = true;
                            }
                        }

                        // Advance
                        r++;
                        if (r >= rowsLimit) { // Or effectively "end of track"
                            r = 0;
                            c++;
                        }

                        if (c > 1000) break; // safety
                    }
                }
            } else {
                // Sparce (Standard) Packing
                if (!isColumnFlow) {
                    // Row-Major Cursor
                    while (true) {
                        if (autoCol + colSpan > totalCols) {
                            autoCol = 0;
                            autoRow++;
                        }
                        if (!isOccupied(autoRow, autoCol, rowSpan, colSpan)) {
                            targetRow = autoRow;
                            targetCol = autoCol;
                            // Update Cursor: Move past item
                            // Spec says: cursor follows item.
                            // In standard, next item starts after this one.
                            autoCol += colSpan;
                            break;
                        }
                        autoCol++;
                    }
                } else {
                    // Column-Major Cursor
                    const rowsLimit = (typeof gridSpec.rows === 'number')
                        ? gridSpec.rows
                        : (Array.isArray(gridSpec.rows) ? gridSpec.rows.length : 10000);

                    while (true) {
                        // Wrap if we hit row limit
                        // Wait, if item doesn't fit vertically, we wrap.
                        if (autoRow + rowSpan > rowsLimit) {
                            autoRow = 0;
                            autoCol++;
                        }

                        if (!isOccupied(autoRow, autoCol, rowSpan, colSpan)) {
                            targetRow = autoRow;
                            targetCol = autoCol;
                            // Update Cursor
                            // Advance vertically
                            autoRow += rowSpan;
                            break;
                        }
                        autoRow++;
                    }
                }
            }
        }

        if (targetRow !== -1 && targetCol !== -1) {
            markOccupied(targetRow, targetCol, rowSpan, colSpan);
            placedItems.push({
                id: item.id,
                spec,
                rowStart: targetRow + 1,
                colStart: targetCol + 1,
                rowSpan,
                colSpan
            });
        } else {
            droppedItems.push(item);
        }
    });

    return {
        placedItems,
        totalRows: gridMap.length,
        droppedItems
    };
}

/**
 * Masonry Layout Algorithm
 * Distributes items into N columns based on shortest column height.
 */
export interface MasonryItem {
    id: string;
    child: any;
    column: number;     // Assigned column index (0-based)
}

export function computeMasonryLayout(
    children: any[],
    cols: number
): MasonryItem[] {
    // 1. Initialize columns height tracker
    // We assume 0 height initially. We track 'count' or 'height'?
    // Since we don't know pixel heights of children without measure, 
    // the best we can do in pure CSS/Flexbox native is:
    // A) Simple Round Robin (index % cols)
    // B) Nothing (User wants pure masonry packing).
    //
    // WITHOUT MEASUREMENTS (Zero Runtime):
    // We CANNOT do true specific-height masonry packing.
    // We CAN only do Column-Order distribution (Masonry CSS usage).
    // Behaving like `columns: 3`. Items flow down col 1, then col 2...
    // BUT React Native doesn't support that easily.
    //
    // Best Approach for Native (Zero-Runtime):
    // Render N Columns.
    // Distribute children into columns using Round Robin?
    // User expects: Item 1 -> Col 1, Item 2 -> Col 2, Item 3 -> Col 3, Item 4 -> Col 1?
    // Yes, this is "Pinterest" style visual balance approximation.

    const distributedItems: MasonryItem[] = [];

    // We just assign column index carefully.
    // React Native will render Columns 0..N side-by-side.
    // We just fill them. 

    children.forEach((child, index) => {
        // Simple distribution: index % cols
        // This ensures DOM order is preserved left-to-right visually.
        const columnIndex = index % cols;

        distributedItems.push({
            id: (child as any).key || index.toString(),
            child,
            column: columnIndex
        });
    });

    return distributedItems;
}
