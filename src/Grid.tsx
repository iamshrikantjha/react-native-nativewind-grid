import React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { parseGridClasses, parseItemClasses } from './parser';
import { computeContainerStyle, computeItemStyle } from './calculator';

export type GridProps = React.ComponentProps<typeof View> & {
    className?: string;
};

export function Grid({
    className,
    children,
    style,
    onLayout,
    ...props
}: GridProps) {
    const [containerWidth, setContainerWidth] = React.useState(0);

    const gridSpec = parseGridClasses(className);

    const handleLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
        if (onLayout) onLayout(e);
    };

    const containerStyle = computeContainerStyle(gridSpec);

    // Enhance children with grid context
    const enhancedChildren = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // We try to extract className from props if it exists
        const props = child.props as { className?: string; style?: any };
        const itemClassName = props.className;
        const itemSpec = parseItemClasses(itemClassName);
        const itemStyle = computeItemStyle(gridSpec, itemSpec, containerWidth);

        // Merge our calculated style with existing style
        return React.cloneElement(child as React.ReactElement<any>, {
            style: [itemStyle, props.style],
        });
    });

    return (
        <View style={[containerStyle, style]} onLayout={handleLayout} {...props}>
            {enhancedChildren}
        </View>
    );
}
