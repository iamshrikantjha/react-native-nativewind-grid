import React from 'react';
import type { TrackSizing } from './parser';

export const GridContext = React.createContext<{
    parentTracks?: TrackSizing[];
}>({});
