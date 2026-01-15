import type { GridSpec, ItemSpec } from './parser';

export interface GridItem {
    id: string; // key or index
    order: number;
    spec: ItemSpec;
    originalIndex: number;
}

export interface PlacedItem {
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

    const totalCols = gridSpec.cols || 1;
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

        // Default spans
        const colSpan = Math.min(spec.colSpan || 1, totalCols); // Cap span at max cols
        const rowSpan = spec.rowSpan || 1;

        let targetRow = -1;
        let targetCol = -1;

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
            if (isDense) {
                // Dense: Reset cursors to start to fill gaps
                // But actually, for 'dense', we scan from start of grid 
                // every time? Or maintain a separate cursor?
                // Standard dense auto-flow scans from 0,0 items.
                let r = 0;
                let c = 0;
                let placed = false;
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
                // Spare (Standard): Use cursor
                // Check if item fits at current cursor
                while (true) {
                    // Wrap if needed
                    if (autoCol + colSpan > totalCols) {
                        autoCol = 0;
                        autoRow++;
                    }

                    if (!isOccupied(autoRow, autoCol, rowSpan, colSpan)) {
                        targetRow = autoRow;
                        targetCol = autoCol;
                        // Update cursor for next item
                        // Move cursor past this item
                        // autoCol += colSpan; // No, next item might start at next slot?
                        // Actually, CSS grid moves cursor??
                        // "The auto-placement cursor is advanced..."
                        // Usually it moves to the end of the placed item.
                        // autoCol = targetCol + colSpan;
                        break;
                    }

                    // If occupied, advance cursor
                    autoCol++;
                }

                // Advance cursor for next time (Sparse mode doesn't backtrack)
                autoCol = targetCol + colSpan;
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
