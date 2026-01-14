import { cssInterop } from 'nativewind';
import { Grid } from './Grid';

export * from './Grid';
export * from './parser';
export * from './calculator';

// Enable NativeWind support for the Grid component
cssInterop(Grid, {
    className: 'style',
});
