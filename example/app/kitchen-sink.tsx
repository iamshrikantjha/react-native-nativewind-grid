import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Grid } from 'react-native-nativewind-grid';

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <View className="mb-8">
            <Text className="text-xl font-bold mb-4 text-slate-800">{title}</Text>
            {children}
        </View>
    );
}

function Box({ label, className, style }: { label: string, className?: string, style?: any }) {
    return (
        <View className={`bg-slate-200 p-2 rounded justify-center items-center border border-slate-300 ${className}`} style={style}>
            <Text className="text-slate-600 font-semibold">{label}</Text>
        </View>
    );
}

export default function KitchenSink() {
    return (
        <ScrollView className="flex-1 bg-white p-4" contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-3xl font-bold mb-6 text-indigo-600">Kitchen Sink Demo</Text>

            {/* 1. Explicit Ends */}
            <Section title="1. Explicit Ends (col-end)">
                <Text className="mb-2 text-slate-500">Item 1: col-start-2 col-end-4 (Span 2)</Text>
                <Grid className="grid-cols-4 gap-2 bg-slate-50 p-2 border border-slate-200 mb-4">
                    <Box label="1" className="bg-red-200" />
                    {/* Starts at 2, Ends at 4 -> Spans 2 & 3 */}
                    <Box label="Start 2, End 4" className="col-start-2 col-end-4 bg-green-200" />
                    <Box label="4" className="bg-blue-200" />
                </Grid>
            </Section>

            {/* 2. Implicit Start from End */}
            <Section title="2. Implicit Start (col-end only)">
                <Text className="mb-2 text-slate-500">Item: col-end-4 col-span-2 (Starts 2)</Text>
                <Grid className="grid-cols-4 gap-2 bg-slate-50 p-2 border border-slate-200">
                    <Box label="1" className="bg-red-200" />
                    {/* Ends at 4, Span 2 -> Must start at 2 */}
                    <Box label="End 4, Span 2" className="col-end-4 col-span-2 bg-indigo-200" />
                    <Box label="4" className="bg-blue-200" />
                </Grid>
            </Section>

            {/* 3. Ordering */}
            <Section title="3. Reordering (order-*)">
                <Text className="mb-2 text-slate-500">Visual order should be: A(First), C, D, B(Last)</Text>
                <Grid className="grid-cols-4 gap-2 bg-slate-50 p-2 border border-slate-200">
                    {/* Source Order: B, A, C, D */}
                    <Box label="B (Last)" className="order-last bg-red-200" />
                    <Box label="A (First)" className="order-first bg-green-200" />
                    <Box label="C" className="bg-blue-200" />
                    <Box label="D" className="bg-yellow-200" />
                </Grid>
            </Section>

            {/* 4. Grid Rows Start/End */}
            <Section title="4. Row Start/End">
                <Grid className="grid-cols-3 grid-rows-4 gap-2 bg-slate-50 p-2 h-64 border border-slate-200">
                    <Box label="1" className="bg-slate-200" />
                    {/* Row Start 2, Row End 4 -> Span 2 */}
                    <Box label="Row 2-4" className="row-start-2 row-end-4 col-span-3 bg-purple-200" />
                    <Box label="4" className="bg-slate-200" />
                </Grid>
            </Section>

        </ScrollView>
    );
}
