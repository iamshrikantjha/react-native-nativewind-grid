import { computeGridLayout, type GridItem } from '../layout';
import type { GridSpec, ItemSpec } from '../parser';

// Helper to create mock items
const createItem = (id: string, spec: Partial<ItemSpec> = {}, order = 0): GridItem => ({
    id,
    order,
    spec: { colSpan: 1, rowSpan: 1, ...spec },
    originalIndex: 0
});

describe('Strict Grid Layout Algorithm', () => {

    test('Basic Auto Flow Row (3 cols)', () => {
        const items = [
            createItem('1'),
            createItem('2'),
            createItem('3'),
            createItem('4'),
        ];
        const spec: GridSpec = { cols: 3, gap: 0, autoFlow: 'row' };

        const result = computeGridLayout(items, spec);

        expect(result.placedItems).toHaveLength(4);
        expect(result.placedItems[0]!.id).toBe('1');
        // Item 2: 1,2
        expect(result.placedItems[1]).toMatchObject({ rowStart: 1, colStart: 2 });
        // Item 3: 1,3
        expect(result.placedItems[2]).toMatchObject({ rowStart: 1, colStart: 3 });
        // Item 4: 2,1 (Wrapped)
        expect(result.placedItems[3]).toMatchObject({ rowStart: 2, colStart: 1 });
    });

    test('Explicit Placement Overrides Auto', () => {
        const items = [
            createItem('1', { colStart: 2, rowStart: 2 }), // Explicit 2,2
            createItem('2'), // Auto should go 1,1
            createItem('3'), // Auto should go 1,2? No, 2,2 occupied?
        ];
        // Sort order in input is '2', '3', '1' usually if no 'order' prop? 
        // Our function consumes generic array, assumed sorted.
        // Let's pass them in order they appear in DOM (render order).
        // 2 (auto), 3 (auto), 1 (explicit)

        // Wait, explicit items are placed *before* auto items in CSS Grid steps?
        // Actually, CSS Grid Algorithm step 1 is placement of fixed items.
        // Step 2 is auto.
        // My implementation processes them in list order.
        // I should probably sort items: Explicit first?
        // The spec in prompt says: "Step D2: Placement loop (for each item)"
        // "CASE 1: Explicit... CASE 2: Auto"
        // This implies processing in order, but checking type.
        // But if Item 3 is explicit at 1,1, and Item 1 is auto.
        // If Item 1 comes first, it takes 1,1. Then Item 3 tries 1,1 -> Overlap!
        // The prompt says: "If overlapping: log warning... No auto conflict resolution".
        // So yes, processing order matters.

        const result = computeGridLayout([items[1]!, items[2]!, items[0]!], { cols: 3, gap: 0, autoFlow: 'row' });

        // Item 2 (Auto) -> 1,1
        expect(result.placedItems[0]!.id).toBe('2');
        expect(result.placedItems[0]).toMatchObject({ rowStart: 1, colStart: 1 });

        // Item 3 (Auto) -> 1,2
        expect(result.placedItems[1]!.id).toBe('3');
        expect(result.placedItems[1]).toMatchObject({ rowStart: 1, colStart: 2 });

        // Item 1 (Explicit) -> 2,2
        expect(result.placedItems[2]!.id).toBe('1');
        expect(result.placedItems[2]).toMatchObject({ rowStart: 2, colStart: 2 });
    });

    test('Big Item Span Wrapping', () => {
        const items = [
            createItem('1', { colSpan: 2 }),
            createItem('2', { colSpan: 2 }),
        ];
        const spec: GridSpec = { cols: 3, gap: 0, autoFlow: 'row' };

        const result = computeGridLayout(items, spec);

        // Item 1: R1, C1-2
        expect(result.placedItems[0]).toMatchObject({ rowStart: 1, colStart: 1, colSpan: 2 });

        // Item 2: Needs 2 cols. Only C3 left on R1. Should wrap to R2.
        // R2, C1-2
        expect(result.placedItems[1]).toMatchObject({ rowStart: 2, colStart: 1, colSpan: 2 });
    });

    test('Holes and Sparse Packing', () => {
        // [1] [1] [ ]
        // [2] [2] [3]
        // Item 3 fits in R1, C3?
        // If item order is 1, 3, 2.

        const items = [
            createItem('1', { colSpan: 2 }),
            createItem('2', { colSpan: 2 }),
            createItem('3'),
        ];
        // 1 takes R1 C1-C2. Cursor at R1 C3.
        // 2 takes 2 cols. Fits at R1 C3? No, only 1 slot. Wraps to R2 C1-C2.
        // Cursor at R2 C3.
        // 3 takes 1 col. Fits at R2 C3.
        // Result:
        // 1 1 .
        // 2 2 3

        // UNLESS we use 'dense'.
        const spec: GridSpec = { cols: 3, gap: 0, autoFlow: 'row' };
        const result = computeGridLayout(items, spec);

        expect(result.placedItems[0]!.id).toBe('1');
        expect(result.placedItems[0]).toMatchObject({ rowStart: 1, colStart: 1 });

        expect(result.placedItems[1]!.id).toBe('2');
        expect(result.placedItems[1]).toMatchObject({ rowStart: 2, colStart: 1 });

        expect(result.placedItems[2]!.id).toBe('3');
        expect(result.placedItems[2]).toMatchObject({ rowStart: 2, colStart: 3 });
    });

    test('Dense Packing', () => {
        // [1] [1] [ ]
        // [2] [2] [3]
        // If dense, and we have Item 3 (size 1) come LAST.
        // 1 takes R1 C1-C2.
        // 2 takes R2 C1-C2.
        // 3 scans from 0,0.
        // R1 C3 is empty. Fits!
        // Result:
        // 1 1 3
        // 2 2 .

        const items = [
            createItem('1', { colSpan: 2 }),
            createItem('2', { colSpan: 2 }),
            createItem('3'),
        ];
        const spec: GridSpec = { cols: 3, gap: 0, autoFlow: 'row dense' };
        const result = computeGridLayout(items, spec);

        expect(result.placedItems[2]!.id).toBe('3');
        expect(result.placedItems[2]).toMatchObject({ rowStart: 1, colStart: 3 });
    });

});
