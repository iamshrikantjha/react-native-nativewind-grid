/// <reference types="nativewind/types" />
import React from 'react';
import { View } from 'react-native';
import { parseGridClasses, parseItemClasses } from './parser';
import { computeContainerStyle, computeItemStyle } from './calculator';
import { computeMasonryLayout } from './layout';

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
    // Memoize the grid spec parsing so it only runs when className changes
    const gridSpec = React.useMemo(() => parseGridClasses(className), [className]);

    const containerStyle = React.useMemo(() => computeContainerStyle(gridSpec), [gridSpec]);

    // Enhance children with grid context OR Masonry context
    const content = React.useMemo(() => {
        // --- MASONRY MODE ---
        if (masonry) {
            const cols = gridSpec.cols || 1;
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
        // First Pass: Parse all children to get their specs (needed for sorting)
        const parsedChildren = React.Children.toArray(children).map((child) => {
            if (!React.isValidElement(child)) return { child, order: 0, itemSpec: null };

            const props = child.props as { className?: string; style?: any };
            const itemClassName = props.className;

            const itemSpec = parseItemClasses(itemClassName);
            return {
                child,
                order: itemSpec.order ?? 0,
                itemSpec
            };
        });

        // Sort by Order
        parsedChildren.sort((a, b) => a.order - b.order);

        // Debug Logging
        if (debug) {
            console.log('[NativeWindGrid] Debug Info:');
            console.log('GridSpec:', JSON.stringify(gridSpec, null, 2));
            console.log('Children Count:', parsedChildren.length);
        }

        // Second Pass: Compute Styles and Render
        const enhancedChildren = parsedChildren.map((item, index) => {
            const { child, itemSpec } = item;

            // Non-element children (text/strings/null) just pass through
            if (!itemSpec || !React.isValidElement(child)) return child;

            // The Wrapper handles the Width and the Padding (Gap)
            const itemWrapperStyle = computeItemStyle(gridSpec, itemSpec);

            if (debug) {
                console.log(`Item ${index}:`, JSON.stringify({ spec: itemSpec, style: itemWrapperStyle }, null, 2));
            }

            // The Child is rendered INSIDE the wrapper.
            // This ensures that background colors on the child do not bleed into the gap (padding).
            // We use 'fragment' key or just index key since order might have changed.
            return (
                <View key={child.key || index} style={[itemWrapperStyle]}>
                    {child}
                </View>
            );
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
