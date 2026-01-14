/// <reference types="nativewind/types" />
import React from 'react';
import { View } from 'react-native';
import { parseGridClasses, parseItemClasses } from './parser';
import { computeContainerStyle, computeItemStyle } from './calculator';

export type GridProps = React.ComponentProps<typeof View> & {
    className?: string;
    debug?: boolean;
};

export function Grid({
    className,
    children,
    style,
    debug,
    ...props
}: GridProps) {
    // Memoize the grid spec parsing so it only runs when className changes
    const gridSpec = React.useMemo(() => parseGridClasses(className), [className]);

    const containerStyle = React.useMemo(() => computeContainerStyle(gridSpec), [gridSpec]);

    // Enhance children with grid context
    const enhancedChildren = React.useMemo(() => {
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
        return parsedChildren.map((item, index) => {
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
    }, [children, gridSpec, debug]);

    return (
        <View
            style={[containerStyle, style]}
            {...props as any}
        >
            {enhancedChildren}
        </View>
    );
}
