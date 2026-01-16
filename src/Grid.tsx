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
                <View
                    style={[style, {
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
        // We use strict layout if complex, dense, OR if explicit rows are defined (Column Layout trigger)
        const shouldUseStrictLayout = isComplex || isDense || gridSpec.rows !== undefined || gridSpec.autoFlow?.includes('column');

        let placementMap: Record<string, PlacedGridItem> = {};
        let layoutResult: ReturnType<typeof computeGridLayout> | undefined;

        if (shouldUseStrictLayout) {
            const layoutItems: GridItem[] = parsedChildren.map((item, idx) => ({
                id: (item.child as any).key || idx.toString(),
                order: item.order,
                spec: item.itemSpec || { colSpan: 1, rowSpan: 1 },
                originalIndex: idx
            }));

            // Force debug=true if column flow to inspect
            layoutResult = computeGridLayout(layoutItems, gridSpec, debug);
            layoutResult.placedItems.forEach(p => {
                placementMap[p.id] = p;
            });
        }

        // --- NEW: COLUMN LAYOUT MODE ---
        // Used when 'grid-flow-col' is set OR 'grid-rows-N' is set. 
        // This allows vertical stacking without fixed container height.
        if (gridSpec.autoFlow?.includes('column') || gridSpec.rows !== undefined) {
            const rowsCount = typeof gridSpec.rows === 'number' ? gridSpec.rows : (layoutResult?.totalRows || 1);
            // Determine columns count dynamically from placements
            let maxCol = typeof gridSpec.cols === 'number' ? gridSpec.cols : 1;
            if (layoutResult) {
                layoutResult.placedItems.forEach(p => {
                    maxCol = Math.max(maxCol, p.colStart + p.colSpan - 1);
                });
            }

            const gap = gridSpec.gap ?? 0;
            const gapX = gridSpec.gapX ?? gap;
            const gapY = gridSpec.gapY ?? gap;

            // Generate Columns
            const columns: React.ReactNode[] = [];
            for (let c = 1; c <= maxCol; c++) {
                const colItems: React.ReactNode[] = [];
                // Track where we are in the column to handle row-spans
                let r = 1;
                while (r <= rowsCount) {
                    // Check if an item starts here
                    const item = Object.values(placementMap).find(p => p.colStart === c && p.rowStart === r);

                    if (item) {
                        // We need the actual child element
                        // layoutItems built id from key || idx.
                        // Let's find the original child object.
                        const childData = parsedChildren.find((p, idx) => {
                            const k = (p.child as any).key || idx.toString();
                            return k === item.id;
                        });

                        if (childData && React.isValidElement(childData.child)) {
                            // Compute Style overrides
                            // Width: If colSpan > 1, we force width > 100%
                            const isColSpan = item.colSpan > 1;
                            const widthPercent = isColSpan ? `${item.colSpan * 100}%` : '100%';
                            // Add gap allowance to width? (span - 1) * gap
                            // NativeWidhtGrid lacks calc(), but simple % is close enough for now.

                            const style = {
                                flex: item.rowSpan, // Grow to fill rows
                                width: widthPercent,
                                zIndex: isColSpan ? 10 : 1,
                                // Adjust margins for gaps if needed?
                                // Actually computeItemStyle handles padding.
                                // We just need layout props.
                            };

                            // Pass context
                            // Simplified subgrid logic (omitted for revamp speed)

                            // Alignment Check (Column Mode)
                            // We don't have itemSpec easily available here (it's in parsedChildren but we have 'childData').
                            // childData has itemSpec!
                            const cItemSpec = childData.itemSpec || { colSpan: 1, rowSpan: 1 };

                            // Inline Axis (Width)
                            const justify = cItemSpec.justifySelf !== 'auto' ? cItemSpec.justifySelf : (gridSpec.justifyItems || 'stretch');
                            const shouldStretchWidth = justify === 'stretch';

                            // Block Axis (Height)
                            const align = cItemSpec.alignSelf !== 'auto' ? cItemSpec.alignSelf : (gridSpec.alignItems || 'stretch');
                            const shouldStretchHeight = align === 'stretch';

                            // Clone child
                            const childStyle = (childData.child.props as any).style;
                            const overrideStyle: any = {};
                            if (shouldStretchWidth) overrideStyle.width = '100%';
                            if (shouldStretchHeight) {
                                overrideStyle.flex = 1;
                                overrideStyle.height = '100%';
                            }

                            const styledChild = React.cloneElement(childData.child as React.ReactElement<{ style?: any }>, {
                                style: [overrideStyle, childStyle]
                            });

                            colItems.push(
                                <View key={item.id} style={[style, {
                                    // Ensure full fill
                                    alignSelf: 'stretch'
                                }]}>
                                    {/* Reuse computeItemStyle for inner padding/alignment */}
                                    {/* Note: computeItemStyle expects a spec. We might need to manually apply it or strip width/height */}
                                    {/* Inner wrapper ensures padding (gap) is respected before child stretches */}
                                    <View style={{ flex: 1, paddingHorizontal: gapX / 2, paddingVertical: gapY / 2 }}>
                                        {styledChild}
                                    </View>
                                </View>
                            );
                        }
                        // Advance r by rowSpan
                        r += item.rowSpan;
                    } else {
                        // Check if this slot is occupied by a col-span from left?
                        // If yes, render Spacer.
                        // Check if occupied by row-span from above?
                        // In this loop, 'item' handles row-span skip.
                        // So we are at a slot that is NOT the start of an item.

                        // Is it occupied by a col-span from left?
                        const occupiedByLeft = Object.values(placementMap).find(p =>
                            p.colStart < c && (p.colStart + p.colSpan) > c &&
                            p.rowStart <= r && (p.rowStart + p.rowSpan) > r
                        );

                        if (occupiedByLeft) {
                            // Occupied by left item. Render Spacer to hold vertical space.
                            colItems.push(<View key={`spacer-${c}-${r}`} style={{ flex: 1 }} />);
                        } else {
                            // Empty slot. Render Empty Spacer.
                            colItems.push(<View key={`empty-${c}-${r}`} style={{ flex: 1 }} />);
                        }
                        r++;
                    }
                }

                // Compute Column Z-Index
                // If this column has items that span to the right, it should potentially be above subsequent columns?
                // Actually, if an item spans right, it enters the space of the next column.
                // We need to ensure it's not covered by the background of the next column.
                // Higher columns (index) usually draw on top.
                // If Col 2 spans to Col 3, Col 2 is drawn BEFORE Col 3.
                // So Col 3 covers Col 2's overflow.
                // WE MUST REVERSE Z-INDEX or explicit set it.
                // Standard: Left columns (start) with spans should be higher?
                // Let's give explicit ZIndex to the Column Container based on 'does it span'?
                // Simple hack: ZIndex = maxCol - c. (Earlier columns on top).
                // This ensures Col 2 (zIndex 2) draws on top of Col 3 (zIndex 1).

                columns.push(
                    <View key={`col-${c}`} style={{
                        flexDirection: 'column',
                        flex: 1,
                        width: gridSpec.autoFlow?.includes('column') ? `${100 / maxCol}%` : (typeof gridSpec.cols === 'number' ? `${100 / gridSpec.cols}%` : 'auto'),
                        gap: 0,
                        zIndex: maxCol - c, // Stack earlier columns on top of later ones to allow right-overflow
                        overflow: 'visible' // Critical for spans
                    }}>
                        {colItems}
                    </View>
                );
            }

            return (
                <View
                    style={[style, containerStyle, {
                        flexDirection: 'row',
                        flexWrap: 'nowrap', // Columns side by side
                        alignItems: 'stretch'
                    }]}
                    {...props as any}
                >
                    {columns}
                </View>
            );
        } // End Column Layout

        // 4. Render (Standard Flex Wrap Mode - Fallback)
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
                placement ? {
                    colStart: placement.colStart,
                    colSpan: placement.colSpan,
                    rowStart: placement.rowStart,
                    rowSpan: placement.rowSpan
                } : undefined
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

            // Alignment Check for Auto-Stretch
            // If align/justify is 'start', 'end', or 'center', we should NOT force stretch.

            // Inline Axis (Width)
            const justify = itemSpec.justifySelf !== 'auto' ? itemSpec.justifySelf : (gridSpec.justifyItems || 'stretch');
            const shouldStretchWidth = justify === 'stretch';

            // Block Axis (Height/Flex)
            const align = itemSpec.alignSelf !== 'auto' ? itemSpec.alignSelf : (gridSpec.alignItems || 'stretch');
            const shouldStretchHeight = align === 'stretch';

            // Clone child to force it to fill the cell IF STRETCH IS ACTIVE
            const childStyle = (child.props as any).style;
            const overrideStyle: any = {};

            if (shouldStretchWidth) overrideStyle.width = '100%';
            if (shouldStretchHeight) {
                overrideStyle.flex = 1;
                overrideStyle.height = '100%';
            }

            const styledChild = React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ style?: any }>, {
                style: [overrideStyle, childStyle]
            }) : child;

            return (
                <View key={id} style={[itemWrapperStyle]}>
                    <GridContext.Provider value={subgridContextValue}>
                        {styledChild}
                    </GridContext.Provider>
                </View>
            );
        });

        // 5. Final Sort for Visual Layout
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
                style={[style, containerStyle, { gap: 0, rowGap: 0, columnGap: 0 }]}
                {...props as any}
            >
                {enhancedChildren}
            </View>
        );

    }, [children, gridSpec, debug, masonry, containerStyle, style, props]); // Depend on props/style for masonry return

    return <>{content}</>;
}
