
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export interface MasonryColumn {
    items: number[]; // Item indices
    height: number;
}

/**
 * Distributes items across columns to balance height
 */
export function calculateMasonryLayout(
    itemHeights: number[],
    cols: number
): MasonryColumn[] {
    const columns: MasonryColumn[] = Array.from({ length: cols }, () => ({
        items: [],
        height: 0,
    }));

    // Greedy algorithm: always add to shortest column
    itemHeights.forEach((height, index) => {
        // Find shortest column
        let shortestCol = 0;
        let minHeight = columns[0]!.height;

        for (let i = 1; i < cols; i++) {
            const col = columns[i];
            if (col && col.height < minHeight) {
                minHeight = col.height;
                shortestCol = i;
            }
        }

        // Add item to shortest column
        const targetCol = columns[shortestCol];
        if (targetCol) {
            targetCol.items.push(index);
            targetCol.height += height;
        }
    });

    return columns;
}

/**
 * Masonry Grid component
 */
export function MasonryGrid({
    children,
    cols = 2,
    gap = 16
}: {
    children: React.ReactElement[];
    cols?: number;
    gap?: number;
}) {
    const [layout, setLayout] = useState<MasonryColumn[]>([]);
    const [itemHeights, setItemHeights] = useState<number[]>([]);

    useEffect(() => {
        if (itemHeights.length === children.length) {
            setLayout(calculateMasonryLayout(itemHeights, cols));
        }
    }, [itemHeights, cols, children.length]);

    const handleItemLayout = (index: number, height: number) => {
        setItemHeights(prev => {
            const next = [...prev];
            next[index] = height;
            return next;
        });
    };

    return (
        <View style={{ flexDirection: 'row', gap }}>
            {layout.length > 0 ? (
                // Render distributed layout once calculated
                layout.map((column, colIndex) => (
                    <View key={colIndex} style={{ flex: 1, gap }}>
                        {column.items.map(itemIndex => (
                            <View key={itemIndex}>
                                {children[itemIndex]}
                            </View>
                        ))}
                    </View>
                ))
            ) : (
                // Initial render: Render all items invisibly to measure their heights
                <View style={{ position: 'absolute', opacity: 0, width: '100%' }}>
                    {children.map((child, index) => (
                        <View
                            key={index}
                            onLayout={(e) => handleItemLayout(index, e.nativeEvent.layout.height)}
                        >
                            {child}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
