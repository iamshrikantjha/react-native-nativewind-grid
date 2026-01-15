import React, { useMemo } from 'react';
import { FlatList, View, type ListRenderItemInfo, type FlatListProps, type StyleProp, type ViewStyle } from 'react-native';
import { Grid } from './Grid';
import { parseGridClasses } from './parser';

export type VirtualGridProps<T> = Omit<FlatListProps<T>, 'renderItem' | 'numColumns' | 'keyExtractor' | 'getItemLayout'> & {
    data: T[];
    renderItem: (info: ListRenderItemInfo<T>) => React.ReactNode;
    className?: string; // Grid class name (e.g. "grid-cols-3 gap-2")
    itemClassName?: string; // Mapped to itemContainerStyle via cssInterop
    itemContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
};

// Helper: Chunk array
function chunkArray<T>(array: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export function VirtualGrid<T>({
    data,
    renderItem,
    className,
    itemContainerStyle,
    ...props
}: VirtualGridProps<T>) {
    // 1. Parse Grid Spec to determine columns
    const gridSpec = useMemo(() => parseGridClasses(className), [className]);

    // 2. Determine Column Count (Chunk Size)
    // If complex (Array), length is count. If number, count is number.
    const cols = Array.isArray(gridSpec.cols)
        ? gridSpec.cols.length
        : (typeof gridSpec.cols === 'number' ? gridSpec.cols : 1);

    // 3. Chunk Data
    const chunkedData = useMemo(() => {
        if (cols < 1) return [];
        return chunkArray(data, cols);
    }, [data, cols]);

    // 4. Render Row
    const renderRow = ({ item: rowItems, index: rowIndex }: ListRenderItemInfo<T[]>) => {
        return (
            <Grid className={className} style={{ marginBottom: gridSpec.gapY }}>
                {rowItems.map((item, colIndex) => {
                    const originalIndex = rowIndex * cols + colIndex;
                    return (
                        <View key={colIndex} style={itemContainerStyle}>
                            {renderItem({ item, index: originalIndex, separators: { highlight: () => { }, unhighlight: () => { }, updateProps: () => { } } })}
                        </View>
                    );
                })}
            </Grid>
        );
    };

    return (
        <FlatList
            data={chunkedData}
            renderItem={renderRow}
            keyExtractor={(_, index) => `row-${index}`}
            {...props as any}
        />
    );
}
