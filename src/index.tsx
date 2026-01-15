import { cssInterop } from 'nativewind';
import { Grid } from './Grid';
import { VirtualGrid } from './VirtualGrid';

export * from './Grid';
export * from './VirtualGrid';
export * from './parser';
export * from './calculator';

// Enable NativeWind support for the Grid component
cssInterop(Grid, {
    className: 'style',
});
cssInterop(VirtualGrid, {
    className: 'style',
    itemClassName: 'itemContainerStyle'
});
