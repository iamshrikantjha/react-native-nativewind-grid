
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Grid } from 'react-native-nativewind-grid';

const Box = ({ text, className = "bg-red-200" }: { text: string, className?: string }) => (
    <View className={`${className} items-center justify-center p-4 border-2 border-slate-900/10`}>
        <Text className="font-bold text-slate-800">{text}</Text>
    </View>
);

const Section = ({ title, desc, children }: { title: string, desc?: string, children: React.ReactNode }) => (
    <View className="mb-8 border-b border-slate-200 pb-4">
        <Text className="text-xl font-bold mb-2 text-slate-900">{title}</Text>
        {desc && <Text className="text-sm text-slate-500 mb-4">{desc}</Text>}
        {/* Container Border for Visibility */}
        <View className="border border-dashed border-slate-400 p-1">
            {children}
        </View>
    </View>
);

export default function KitchenSink() {
    return (
        <ScrollView className="flex-1 bg-white p-4 space-y-12">
            <Text className="text-3xl font-bold mb-6 text-slate-900">Grid Kitchen Sink</Text>

            {/* 1. Grid Template Columns */}
            <Section title="1. Grid Template Columns" desc="grid-cols-[n] defines explicit columns.">
                <Grid className="grid-cols-3 gap-2 h-32">
                    <Box text="1" className="bg-blue-200" />
                    <Box text="2" className="bg-blue-200" />
                    <Box text="3" className="bg-blue-200" />
                    <Box text="4" className="bg-blue-200" />
                    <Box text="5" className="bg-blue-200" />
                </Grid>
            </Section>

            {/* 2. Grid Template Rows */}
            <Section title="2. Grid Template Rows" desc="grid-rows-[n] defines explicit rows based on container height.">
                <Grid className="grid-flow-col grid-rows-3 gap-2 h-48">
                    <Box text="1" className="bg-green-200" />
                    <Box text="2" className="bg-green-200" />
                    <Box text="3" className="bg-green-200" />
                    <Box text="4" className="bg-green-200" />
                    <Box text="5" className="bg-green-200" />
                    <Box text="6" className="bg-green-200" />
                    <Box text="7" className="bg-green-200" />
                    <Box text="8" className="bg-green-200" />
                    <Box text="9" className="bg-green-200" />
                </Grid>
            </Section>

            {/* 3. Grid Row/Col Start/End */}
            <Section title="3. Grid Column/Row Start/End" desc="Explicit placement using col-start/end and row-start/end.">
                <Grid className="grid-cols-3 gap-2 h-48">
                    <View className="col-start-2 col-span-2 bg-purple-200 p-2 items-center justify-center"><Text>Col Start 2 Span 2</Text></View>
                    <View className="row-start-2 col-start-1 row-span-2 bg-purple-300 p-2 items-center justify-center"><Text>Row Start 2</Text></View>
                    <View className="col-start-3 row-start-3 bg-purple-400 p-2 items-center justify-center"><Text>3,3</Text></View>
                </Grid>
            </Section>

            {/* 4. Grid Auto Flow */}
            <Section title="4. Grid Auto Flow" desc="Change placement algorithm order.">
                <Text className="font-bold mt-2">grid-flow-row (Default)</Text>
                <Grid className="grid-cols-3 gap-2 h-24 mb-4">
                    <Box text="1" className="bg-orange-200" />
                    <Box text="2" className="bg-orange-200" />
                    <Box text="3" className="bg-orange-200" />
                    <Box text="4" className="bg-orange-200" />
                </Grid>

                <Text className="font-bold mt-2">grid-flow-col</Text>
                <Grid className="grid-rows-3 grid-flow-col gap-2 h-32 mb-4">
                    <Box text="1" className="bg-orange-300" />
                    <Box text="2" className="bg-orange-300" />
                    <Box text="3" className="bg-orange-300" />
                    <Box text="4" className="bg-orange-300" />
                    <Box text="5" className="bg-orange-300" />
                </Grid>

                <Text className="font-bold mt-2">grid-flow-row-dense (Backfilling)</Text>
                <Grid className="grid-cols-3 grid-flow-row-dense gap-2 h-32">
                    <View className="col-span-2 bg-orange-400 p-2"><Text>Span 2</Text></View>
                    <View className="col-span-2 bg-orange-400 p-2"><Text>Span 2 (Forces Wrap)</Text></View>
                    <View className="col-span-1 bg-orange-200 p-2"><Text>Dense Fill</Text></View>
                </Grid>
            </Section>

            {/* 5. Auto Columns (Implicit) */}
            <Section title="5. Grid Auto Columns" desc="grid-auto-cols (Specifying size of implicit columns).">
                <Grid className="grid-cols-2 auto-cols-[80px] grid-flow-col gap-2 h-24 overflow-scroll">
                    <Box text="1 (Expl)" className="bg-yellow-200" />
                    <Box text="2 (Expl)" className="bg-yellow-200" />
                    <Box text="3 (Impl)" className="bg-yellow-300" />
                    <Box text="4 (Impl)" className="bg-yellow-300" />
                    <Box text="5 (Impl)" className="bg-yellow-300" />
                </Grid>
            </Section>

            {/* 6. Auto Rows (Implicit) */}
            <Section title="6. Grid Auto Rows" desc="grid-auto-rows (Specifying size of implicit rows).">
                <Grid className="grid-cols-2 auto-rows-[60px] gap-2">
                    <Box text="Row 1" className="bg-amber-200" />
                    <Box text="Row 1" className="bg-amber-200" />
                    {/* Implicit Rows start here */}
                    <Box text="Row 2 (Impl)" className="bg-amber-300" />
                    <Box text="Row 2 (Impl)" className="bg-amber-300" />
                    <Box text="Row 3 (Impl)" className="bg-amber-400" />
                </Grid>
            </Section>

            {/* 6b. Arbitrary Rows */}
            <Section title="6b. Arbitrary Rows" desc="grid-rows-[100px_1fr_50px]">
                <Grid className="grid-rows-[80px_1fr_40px] h-64 gap-2">
                    <Box text="80px Fixed" className="bg-sky-200" />
                    <Box text="Flex (1fr)" className="bg-sky-300" />
                    <Box text="40px Fixed" className="bg-sky-400" />
                </Grid>
            </Section>


            {/* 7. Justify Content */}
            <Section title="7. Justify Content" desc="Distributes space between columns (justify-center, justify-between, etc).">
                <Grid className="grid-cols-3 justify-between gap-2 bg-gray-100 p-2">
                    <Box text="1" className="w-10 bg-pink-200" />
                    <Box text="2" className="w-10 bg-pink-200" />
                    <Box text="3" className="w-10 bg-pink-200" />
                </Grid>
            </Section>

            {/* 8. Align Content */}
            <Section title="8. Place Content (Align Content)" desc="Distributes space between rows (align-content-center, etc).">
                <Grid className="grid-cols-3 align-content-center h-40 bg-gray-100 p-2">
                    <Box text="1" className="h-10 bg-pink-300" />
                    <Box text="2" className="h-10 bg-pink-300" />
                    <Box text="3" className="h-10 bg-pink-300" />
                    <Box text="4" className="h-10 bg-pink-300" />
                </Grid>
            </Section>

            {/* 9. Justify Items */}
            <Section title="9. Justify Items" desc="Aligns items horizontally within their cell (justify-items-center).">
                <Grid className="grid-cols-2 justify-items-center gap-2">
                    <View className="bg-gray-200 w-full mb-2"><Box text="Center" className="w-12 bg-cyan-200" /></View>
                    <View className="bg-gray-200 w-full mb-2"><Box text="Center" className="w-12 bg-cyan-200" /></View>
                </Grid>
                <Grid className="grid-cols-2 justify-items-end gap-2">
                    <View className="bg-gray-200 w-full"><Box text="End" className="w-12 bg-cyan-300" /></View>
                    <View className="bg-gray-200 w-full"><Box text="End" className="w-12 bg-cyan-300" /></View>
                </Grid>
            </Section>

            {/* 10. Align Items */}
            <Section title="10. Align Items (Place Items)" desc="Aligns items vertically within their cell (items-center).">
                <Grid className="grid-cols-3 items-center h-24 bg-gray-100 gap-2">
                    <View className="h-full bg-gray-200"><Box text="C" className="h-10 bg-teal-200" /></View>
                    <View className="h-full bg-gray-200"><Box text="C" className="h-10 bg-teal-200" /></View>
                    <View className="h-full bg-gray-200"><Box text="C" className="h-10 bg-teal-200" /></View>
                </Grid>
            </Section>

            {/* 11. Justify Self */}
            <Section title="11. Justify Self" desc="Override alignment for single item (justify-self-end).">
                <Grid className="grid-cols-2 gap-2">
                    <Box text="Default (Stretch)" className="bg-indigo-200" />
                    <View className="bg-gray-100 p-1">
                        <Box text="End" className="justify-self-end w-12 bg-indigo-300" />
                    </View>
                </Grid>
            </Section>

            {/* 12. Align Self */}
            <Section title="12. Align Self" desc="Override vertical alignment (self-center).">
                <Grid className="grid-cols-3 h-24 gap-2">
                    <Box text="Stretch" className="bg-indigo-200" />
                    <Box text="Center" className="self-center h-10 bg-indigo-300" />
                    <Box text="End" className="self-end h-10 bg-indigo-400" />
                </Grid>
            </Section>

            {/* 13. Order */}
            <Section title="13. Order" desc="Change visual order using order-*, order-last, etc.">
                <Grid className="grid-cols-3 gap-2">
                    <Box text="1 (Last)" className="order-last bg-rose-200" />
                    <Box text="2" className="bg-rose-300" />
                    <Box text="3 (First)" className="order-first bg-rose-400" />
                </Grid>
            </Section>

            {/* 14. Place Placeholders */}
            <Section title="14. Place Items/Content/Self" desc="Shorthand utilities.">
                <Text className="mb-2">place-items-center (Align + Justify Items)</Text>
                <Grid className="grid-cols-2 place-items-center h-24 bg-gray-100 gap-2 mb-4">
                    <Box text="X" className="w-8 h-8 bg-lime-300" />
                    <Box text="Y" className="w-8 h-8 bg-lime-300" />
                </Grid>

                <Text className="mb-2">place-content-center (Align + Justify Content)</Text>
                <Grid className="grid-cols-3 place-content-center h-32 gap-2 bg-gray-200 w-full">
                    <Box text="1" className="w-10 h-10 bg-lime-400" />
                    <Box text="2" className="w-10 h-10 bg-lime-400" />
                </Grid>
            </Section>

            <View className="h-20" />
        </ScrollView>
    );
}
