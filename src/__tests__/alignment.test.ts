import { computeContainerStyle, computeItemStyle } from '../calculator';
import { parseGridClasses, parseItemClasses } from '../parser';

describe('Grid Alignment Parity', () => {

    // 1. Justify Content (Container - Main Axis Distribution)
    // Controls how "tracks" are positioned if they don't fill the row width.
    describe('justify-content (Main Axis Distribution)', () => {
        test('justify-start', () => {
            const spec = parseGridClasses('justify-start');
            const style = computeContainerStyle(spec);
            expect(style.justifyContent).toBe('flex-start');
        });
        test('justify-center', () => {
            const spec = parseGridClasses('justify-center');
            const style = computeContainerStyle(spec);
            expect(style.justifyContent).toBe('center');
        });
        test('justify-between', () => {
            const spec = parseGridClasses('justify-between');
            const style = computeContainerStyle(spec);
            expect(style.justifyContent).toBe('space-between');
        });
    });

    // 2. Align Content (Container - Cross Axis Distribution)
    // Controls how "rows" are positioned if they don't fill the container height.
    describe('align-content (Cross Axis Distribution)', () => {
        test('content-start', () => {
            const spec = parseGridClasses('content-start');
            const style = computeContainerStyle(spec);
            expect(style.alignContent).toBe('flex-start');
        });
        test('content-center', () => {
            const spec = parseGridClasses('content-center');
            const style = computeContainerStyle(spec);
            expect(style.alignContent).toBe('center');
        });
        test('content-between', () => {
            const spec = parseGridClasses('content-between');
            const style = computeContainerStyle(spec);
            expect(style.alignContent).toBe('space-between');
        });
        test('place-content-center (Shorthand)', () => {
            // place-content: align-content justify-content
            const spec = parseGridClasses('place-content-center');
            const style = computeContainerStyle(spec);
            expect(style.alignContent).toBe('center');
            expect(style.justifyContent).toBe('center');
        });
    });

    // 3. Justify Items (Inline/Horizontal Axis of Item)
    // In React Native Flex-Col Wrapper: Cross Axis (alignItems)
    describe('justify-items (Inline Axis)', () => {
        test('justify-items-start', () => {
            const gridSpec = parseGridClasses('justify-items-start');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.alignItems).toBe('flex-start');
        });
        test('justify-items-center', () => {
            const gridSpec = parseGridClasses('justify-items-center');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.alignItems).toBe('center');
        });
        test('justify-items-end', () => {
            const gridSpec = parseGridClasses('justify-items-end');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.alignItems).toBe('flex-end');
        });
        test('justify-items-stretch', () => {
            const gridSpec = parseGridClasses('justify-items-stretch');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            // Default behavior for flex-col wrapper cross-axis
            expect(style.alignItems).toBe('stretch');
        });
    });

    // 4. Align Items (Block/Vertical Axis of Item)
    // In React Native Flex-Col Wrapper: Main Axis (justifyContent)
    describe('align-items (Block Axis)', () => {
        // ... start/center/end ...
        test('items-stretch', () => { // Implicit test via absence of class or explicit class
            const gridSpec = parseGridClasses('items-stretch');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.justifyContent).toBe('flex-start'); // We map stretch to flex-start for wrapper main axis
        });
        test('items-start', () => {
            const gridSpec = parseGridClasses('items-start');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.justifyContent).toBe('flex-start');
        });
        test('items-center', () => {
            const gridSpec = parseGridClasses('items-center');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.justifyContent).toBe('center');
        });
        test('items-end', () => {
            const gridSpec = parseGridClasses('items-end');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.justifyContent).toBe('flex-end');
        });
        test('place-items-center (Shorthand)', () => {
            const gridSpec = parseGridClasses('place-items-center');
            const itemSpec = parseItemClasses('');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.alignItems).toBe('center'); // Justify (Inline)
            expect(style.justifyContent).toBe('center'); // Align (Block)
        });
    });

    // 5. Justify Self (Override Inline)
    describe('justify-self (Override Inline)', () => {
        test('justify-self-end overrides justify-items-start', () => {
            const gridSpec = parseGridClasses('justify-items-start');
            const itemSpec = parseItemClasses('justify-self-end');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.alignItems).toBe('flex-end');
        });
    });

    // 6. Align Self (Override Block)
    describe('align-self (Override Block)', () => {
        test('self-end overrides items-start', () => {
            const gridSpec = parseGridClasses('items-start');
            const itemSpec = parseItemClasses('self-end');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.justifyContent).toBe('flex-end');
        });
        test('place-self-center', () => {
            const gridSpec = parseGridClasses('items-start justify-items-start');
            const itemSpec = parseItemClasses('place-self-center');
            const style = computeItemStyle(gridSpec, itemSpec);
            expect(style.alignItems).toBe('center'); // Inline
            expect(style.justifyContent).toBe('center'); // Block
        });
    });

});
