/// <reference types="nativewind/types" />
import React from 'react';
import { View } from 'react-native';
import { parseGridClasses, parseItemClasses } from './parser';
import { computeContainerStyle, computeItemStyle } from './calculator';

export type GridProps = React.ComponentProps<typeof View> & {
    className?: string;
};

export function Grid({
    className,
    children,
    style,
    ...props
}: GridProps) {
    // Memoize the grid spec parsing so it only runs when className changes
    const gridSpec = React.useMemo(() => parseGridClasses(className), [className]);

    const containerStyle = React.useMemo(() => computeContainerStyle(gridSpec), [gridSpec]);

    // Enhance children with grid context, memoizing to avoid re-calculating on every render
    const enhancedChildren = React.useMemo(() => {
        return React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;

            // We try to extract className from props if it exists
            const props = child.props as { className?: string; style?: any };
            const itemClassName = props.className;

            // This is still a small perf hit per child, but inevitable unless we have a different API.
            // However, with no double-render, it's 2x faster already.
            const itemSpec = parseItemClasses(itemClassName);
            // The Wrapper handles the Width and the Padding (Gap)
            const itemWrapperStyle = computeItemStyle(gridSpec, itemSpec);

            // The Child is rendered INSIDE the wrapper.
            // This ensures that background colors on the child do not bleed into the gap (padding).
            return (
                <View style={[itemWrapperStyle]}>
                    {child}
                </View>
            );
        });
    }, [children, gridSpec]);

    return (
        <View
            className={className}
            style={[containerStyle, style]}
            {...props as any}
        >
            {enhancedChildren}
        </View>
    );
}
