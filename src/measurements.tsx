
import { View } from 'react-native';
import React from 'react';

export interface MeasurementResult {
    width: number;
    height: number;
}

/**
 * Measures content size by rendering offscreen
 */
export function measureContent(
    child: React.ReactElement,
    maxWidth: number
): Promise<MeasurementResult> {
    return new Promise((resolve) => {
        // Create offscreen measurement view
        const MeasurementView = () => {
            const [size, setSize] = React.useState<MeasurementResult | null>(null);

            React.useEffect(() => {
                if (size) resolve(size);
            }, [size]);

            return (
                <View
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        maxWidth,
                    }}
                    onLayout={(e) => {
                        const { width, height } = e.nativeEvent.layout;
                        setSize({ width, height });
                    }}
                >
                    {child}
                </View>
            );
        };

        // Render and measure (happens in single frame)
        return <MeasurementView />;
    });
}

/**
 * Calculates column widths based on content
 */
export async function calculateAutoColumns(
    children: React.ReactNode[],
    cols: number,
    mode: 'min' | 'max' | 'auto'
): Promise<number[]> {
    const measurements = await Promise.all(
        children.map(child =>
            measureContent(child as React.ReactElement, Infinity)
        )
    );

    const columnWidths: number[] = [];

    for (let col = 0; col < cols; col++) {
        const itemsInColumn = children.filter((_, i) => i % cols === col);
        const widthsInColumn = itemsInColumn.map((_, i) =>
            measurements[col + i * cols]?.width || 0
        );

        switch (mode) {
            case 'min':
                columnWidths.push(Math.min(...widthsInColumn));
                break;
            case 'max':
                columnWidths.push(Math.max(...widthsInColumn));
                break;
            case 'auto':
                // Average of min and max
                columnWidths.push(
                    (Math.min(...widthsInColumn) + Math.max(...widthsInColumn)) / 2
                );
                break;
        }
    }

    return columnWidths;
}
