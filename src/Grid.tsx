/// <reference types="nativewind/types" />
import React from 'react';
import { View } from 'react-native';
import { parseGridClasses, parseItemClasses } from './parser';
import { computeContainerStyle, computeItemStyle } from './calculator';
import { computeMasonryLayout, computeGridLayout, type GridItem, type PlacedGridItem } from './layout';

import { GridContext } from './context';

export type GridProps = React.ComponentProps<typeof View> & {
    className?: string;
    debug?: boolean;
    masonry?: boolean;
};

export function Grid({
    className,
    children,
    style,
    debug,
    masonry,
    ...props
}: GridProps) {
    const { parentTracks } = React.useContext(GridContext);

    // Memoize the grid spec parsing so it only runs when className changes
    const gridSpec = React.useMemo(() => {
        const spec = parseGridClasses(className);
        // Subgrid Resolution
        if (spec.cols === 'subgrid' && parentTracks) {
            spec.cols = parentTracks;
        }
        return spec;
    }, [className, parentTracks]);

    const containerStyle = React.useMemo(() => computeContainerStyle(gridSpec), [gridSpec]);

    // Enhance children with grid context OR Masonry context
    const content = React.useMemo(() => {
        // --- MASONRY MODE ---
        if (masonry) {
            const rawCols = gridSpec.cols || 1;
            // Handle 'subgrid' (rare but possible if masonry nested in strict grid)
            const cols = (rawCols === 'subgrid')
                ? (Array.isArray(parentTracks) ? parentTracks.length : 1)
                : (Array.isArray(rawCols) ? rawCols.length : rawCols);

            const gap = gridSpec.gap ?? 0;
            const gapX = gridSpec.gapX ?? gap;
            const gapY = gridSpec.gapY ?? gap;

            // Distribute children into columns
            const childrenArray = React.Children.toArray(children);
            const distributed = computeMasonryLayout(childrenArray, cols);

            // Render Columns Side-by-Side
            // We create an array of arrays for the columns
            const columns: any[][] = Array.from({ length: cols }, () => []);

            distributed.forEach((item) => {
                columns[item.column]!.push(item.child);
            });

            return (
                <View style={[style, {
                    flexDirection: 'row',
                    flexWrap: 'nowrap', // Critical: Columns must not wrap
                    alignItems: 'stretch',
                    // Apply Gaps Explicitly
                    gap: gapX,
                    columnGap: gapX,
                    // Reset standard legacy margins if passed in style
                    marginHorizontal: 0,
                    marginVertical: 0
                }]}>
                    {columns.map((colItems, colIndex) => (
                        // Column Wrapper
                        <View key={`col-${colIndex}`} style={{ flex: 1, gap: gapY }}>
                            {colItems.map((child: any, idx) => (
                                <View key={child.key || idx}>
                                    {child}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            );
        }

        // --- STANDARD GRID MODE ---
        // 1. Prepare Items
        const parsedChildren = React.Children.toArray(children).map((child) => {
            if (!React.isValidElement(child)) return { child, order: 0, itemSpec: null };
            const props = child.props as { className?: string; style?: any };
            const itemSpec = parseItemClasses(props.className);
            return {
                child,
                order: itemSpec.order ?? 0,
                itemSpec
            };
        });

        // 2. Sort
        parsedChildren.sort((a, b) => a.order - b.order);

        // Debug
        if (debug) {
            console.log('[NativeWindGrid] Debug Info:');
            console.log('GridSpec:', JSON.stringify(gridSpec, null, 2));
            console.log('Children Count:', parsedChildren.length);
        }

        // 3. Determine Layout Mode
        const isComplex = Array.isArray(gridSpec.cols);
        const isDense = gridSpec.autoFlow?.includes('dense');
        const shouldUseStrictLayout = isComplex || isDense || gridSpec.rows !== undefined;

        let placementMap: Record<string, PlacedGridItem> = {};

        if (shouldUseStrictLayout) {
            const layoutItems: GridItem[] = parsedChildren.map((item, idx) => ({
                id: (item.child as any).key || idx.toString(),
                order: item.order,
                spec: item.itemSpec || { colSpan: 1, rowSpan: 1 },
                originalIndex: idx
            }));

            const layoutResult = computeGridLayout(layoutItems, gridSpec, debug);
            layoutResult.placedItems.forEach(p => {
                placementMap[p.id] = p;
            });
        }

        // 4. Render
        const enhancedChildren = parsedChildren.map((item, index) => {
            const { child, itemSpec } = item;
            if (!itemSpec || !React.isValidElement(child)) return child;

            // Get resolved placement if available
            const id = child.key || index.toString();
            const placement = placementMap[id];

            // Compute Style
            // We pass placement info to calculator if it exists
            const itemWrapperStyle = computeItemStyle(
                gridSpec,
                itemSpec,
                placement ? { colStart: placement.colStart, colSpan: placement.colSpan } : undefined
            );

            if (debug) {
                console.log(`Item ${index}:`, JSON.stringify({ spec: itemSpec, style: itemWrapperStyle, placement }, null, 2));
            }

            // Subgrid Provider Logic
            let subgridContextValue = {};
            if (Array.isArray(gridSpec.cols) && placement) {
                const start = placement.colStart - 1; // 0-based
                const end = start + placement.colSpan;
                const slicedTracks = gridSpec.cols.slice(start, end);
                subgridContextValue = { parentTracks: slicedTracks };
            }

            return (
                <View key={id} style={[itemWrapperStyle]}>
                    <GridContext.Provider value={subgridContextValue}>
                        {child}
                    </GridContext.Provider>
                </View>
            );
        });

        // 5. Final Sort for Visual Layout (Critical for Dense & Start/End reordering)
        // We must re-order the views themselves so Flexbox lays them out in the correct Grid order.
        enhancedChildren.sort((a: any, b: any) => {
            const idA = a.key;
            const idB = b.key;
            const pA = placementMap[idA];
            const pB = placementMap[idB];

            if (!pA || !pB) return 0;

            // Row major order
            if (pA.rowStart !== pB.rowStart) return pA.rowStart - pB.rowStart;
            return pA.colStart - pB.colStart;
        });

        return (
            <View
                style={[containerStyle, style, { gap: 0, rowGap: 0, columnGap: 0 }]}
                {...props as any}
            >
                {enhancedChildren}
            </View>
        );

    }, [children, gridSpec, debug, masonry, containerStyle, style, props]); // Depend on props/style for masonry return

    return <>{content}</>;
}
