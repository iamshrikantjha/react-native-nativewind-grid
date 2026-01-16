
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
        <ScrollView className="flex-1 bg-white p-4">
            <View className="gap-12">
                <Text className="text-3xl font-bold mb-6 text-slate-900">Grid Kitchen Sink</Text>

                {/* 1. Grid Template Columns */}
                <Section title="1. Grid Template Columns" desc="Defines the columns of the grid with a space-separated list of values.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">grid-cols-1 | grid-cols-2 | grid-cols-3... | grid-cols-12 | grid-cols-none</Text>

                    <Text className="font-bold text-sm mb-1">grid-cols-3</Text>
                    <Grid className="grid-cols-3 gap-2 h-32 bg-slate-50 p-2">
                        <Box text="1" className="bg-blue-200" />
                        <Box text="2" className="bg-blue-200" />
                        <Box text="3" className="bg-blue-200" />
                        <Box text="4" className="bg-blue-200" />
                        <Box text="5" className="bg-blue-200" />
                    </Grid>
                </Section>

                {/* 2. Grid Template Rows */}
                <Section title="2. Grid Template Rows" desc="Defines the rows of the grid. useful when using grid-flow-col or explicit row-based layouts.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">grid-rows-1 | grid-rows-2... | grid-rows-6 | grid-rows-none</Text>

                    <Text className="font-bold text-sm mb-1">grid-rows-3 (with grid-flow-col)</Text>
                    <Grid className="grid-flow-col grid-rows-3 gap-2 h-48 bg-slate-50 p-2">
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

                {/* 3. Grid Column/Row Start/End */}
                <Section title="3. Grid Column/Row Start/End" desc="Control the explicit placement of items within the grid tracks.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">col-start-N | col-span-N | row-start-N | row-span-N</Text>

                    <Grid className="grid-cols-3 gap-2 h-48 bg-slate-50 p-2">
                        <View className="col-start-2 col-span-2 bg-purple-200 p-2 items-center justify-center border border-purple-300"><Text className="font-bold text-purple-800">col-start-2 col-span-2</Text></View>
                        <View className="row-start-2 col-start-1 row-span-2 bg-purple-300 p-2 items-center justify-center border border-purple-400"><Text className="font-bold text-purple-900">row-start-2 row-span-2</Text></View>
                        <View className="col-start-3 row-start-3 bg-purple-400 p-2 items-center justify-center border border-purple-500"><Text className="font-bold text-white">3,3</Text></View>
                    </Grid>
                </Section>

                {/* 4. Grid Auto Flow */}
                <Section title="4. Grid Auto Flow" desc="Controls the auto-placement algorithm for items not explicitly placed.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">grid-flow-row | grid-flow-col | grid-flow-row-dense | grid-flow-col-dense</Text>

                    <Text className="font-bold text-sm mt-2 mb-1">grid-flow-row (Default)</Text>
                    <Text className="text-xs text-slate-500 mb-2">Fills row by row.</Text>
                    <Grid className="grid-cols-3 gap-2 h-24 mb-4 bg-slate-50 p-2">
                        <Box text="1" className="bg-orange-200" />
                        <Box text="2" className="bg-orange-200" />
                        <Box text="3" className="bg-orange-200" />
                        <Box text="4" className="bg-orange-200" />
                    </Grid>

                    <Text className="font-bold text-sm mt-2 mb-1">grid-flow-col</Text>
                    <Text className="text-xs text-slate-500 mb-2">Fills column by column.</Text>
                    <Grid className="grid-rows-3 grid-flow-col gap-2 h-32 mb-4 bg-slate-50 p-2">
                        <Box text="1" className="bg-orange-300" />
                        <Box text="2" className="bg-orange-300" />
                        <Box text="3" className="bg-orange-300" />
                        <Box text="4" className="bg-orange-300" />
                        <Box text="5" className="bg-orange-300" />
                    </Grid>

                    <Text className="font-bold text-sm mt-2 mb-1">grid-flow-row-dense</Text>
                    <Text className="text-xs text-slate-500 mb-2">Attempts to fill holes earlier in the grid if smaller items come later.</Text>
                    <Grid className="grid-cols-3 grid-flow-row-dense gap-2 h-32 bg-slate-50 p-2">
                        <View className="col-span-2 bg-orange-400 p-2"><Text>Span 2</Text></View>
                        <View className="col-span-2 bg-orange-400 p-2"><Text>Span 2 (Force Wrap)</Text></View>
                        <View className="col-span-1 bg-orange-200 p-2 border-2 border-orange-500 border-dashed"><Text>Dense Fill (Item 3)</Text></View>
                    </Grid>
                </Section>

                {/* 5. Grid Auto Columns */}
                <Section title="5. Grid Auto Columns" desc="Specifies the size of implicitly created columns.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">auto-cols-min | auto-cols-max | auto-cols-fr | auto-cols-[size]</Text>

                    <Text className="font-bold text-sm mb-1">auto-cols-[80px]</Text>
                    <Grid className="grid-cols-2 auto-cols-[80px] grid-flow-col gap-2 h-24 overflow-scroll bg-slate-50 p-2">
                        <Box text="Expl" className="bg-yellow-200" />
                        <Box text="Expl" className="bg-yellow-200" />
                        <Box text="Impl" className="bg-yellow-300" />
                        <Box text="Impl" className="bg-yellow-300" />
                        <Box text="Impl" className="bg-yellow-300" />
                    </Grid>
                </Section>

                {/* 6. Grid Auto Rows */}
                <Section title="6. Grid Auto Rows" desc="Specifies the size of implicitly created rows.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">auto-rows-min | auto-rows-max | auto-rows-fr | auto-rows-[size]</Text>

                    <Text className="font-bold text-sm mb-1">auto-rows-[60px]</Text>
                    <Grid className="grid-cols-2 auto-rows-[60px] gap-2 bg-slate-50 p-2">
                        <Box text="Row 1" className="bg-amber-200" />
                        <Box text="Row 1" className="bg-amber-200" />
                        {/* Implicit Rows start here */}
                        <Box text="Row 2 (Impl)" className="bg-amber-300" />
                        <Box text="Row 2 (Impl)" className="bg-amber-300" />
                        <Box text="Row 3 (Impl)" className="bg-amber-400" />
                    </Grid>
                </Section>

                {/* 6b. Arbitrary Rows */}
                <Section title="6b. Arbitrary Rows" desc="Define explicit complex row layouts using arbitrary values.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">grid-rows-[100px_1fr_40px]</Text>

                    <Grid className="grid-rows-[80px_1fr_40px] h-64 gap-2 bg-slate-50 p-2">
                        <Box text="80px Fixed" className="bg-sky-200" />
                        <Box text="Flex (1fr)" className="bg-sky-300" />
                        <Box text="40px Fixed" className="bg-sky-400" />
                    </Grid>
                </Section>


                {/* 7. Justify Content */}
                <Section title="7. Justify Content (Main Axis Container)" desc="Controls how grid tracks (columns) are aligned along the main axis. Requires items to NOT fill the row width (e.g. fixed widths).">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">justify-start | justify-end | justify-center | justify-between | justify-around | justify-evenly</Text>

                    <Text className="font-bold text-sm mb-1">justify-between</Text>
                    {/* Remove grid-cols-3 so items don't take 33%. Use w-16 to leave space. */}
                    <Grid className="grid-cols-none flex-row justify-between gap-2 bg-slate-100 p-2 mb-4">
                        <Box text="1" className="w-16 bg-pink-200" />
                        <Box text="2" className="w-16 bg-pink-200" />
                        <Box text="3" className="w-16 bg-pink-200" />
                    </Grid>

                    <Text className="font-bold text-sm mb-1">justify-center</Text>
                    <Grid className="grid-cols-none flex-row justify-center gap-2 bg-slate-100 p-2">
                        <Box text="1" className="w-16 bg-pink-300" />
                        <Box text="2" className="w-16 bg-pink-300" />
                        <Box text="3" className="w-16 bg-pink-300" />
                    </Grid>
                </Section>

                {/* 8. Align Content */}
                <Section title="8. Align Content (Cross Axis Container)" desc="Controls how rows are aligned correctly if they don't fill the container height.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">content-start | content-end | content-center | content-between | content-around | content-evenly</Text>

                    <Text className="font-bold text-sm mb-1">content-center</Text>
                    <Grid className="grid-cols-3 content-center h-40 gap-2 bg-slate-100 p-2">
                        <Box text="1" className="h-8 bg-purple-200" />
                        <Box text="2" className="h-8 bg-purple-200" />
                        <Box text="3" className="h-8 bg-purple-200" />
                        <Box text="4" className="h-8 bg-purple-200" />
                        <Box text="5" className="h-8 bg-purple-200" />
                    </Grid>
                </Section>

                {/* 9. Justify Items */}
                <Section title="9. Justify Items (Inline Axis Item)" desc="Controls default horizontal alignment of items within their grid cells.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">justify-items-start | justify-items-end | justify-items-center | justify-items-stretch</Text>

                    <Text className="font-bold text-sm mb-1">justify-items-center</Text>
                    <Grid className="grid-cols-2 justify-items-center gap-2 bg-slate-50 p-2 mb-4">
                        <View className="w-full bg-white border border-slate-200"><Box text="Center" className="w-16 bg-cyan-200" /></View>
                        <View className="w-full bg-white border border-slate-200"><Box text="Center" className="w-16 bg-cyan-200" /></View>
                    </Grid>

                    <Text className="font-bold text-sm mb-1">justify-items-end</Text>
                    <Grid className="grid-cols-2 justify-items-end gap-2 bg-slate-50 p-2">
                        <View className="w-full bg-white border border-slate-200"><Box text="End" className="w-16 bg-cyan-300" /></View>
                        <View className="w-full bg-white border border-slate-200"><Box text="End" className="w-16 bg-cyan-300" /></View>
                    </Grid>
                </Section>

                {/* 10. Align Items */}
                <Section title="10. Align Items (Block Axis Item)" desc="Controls default vertical alignment of items within their grid cells.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">items-start | items-end | items-center | items-baseline | items-stretch</Text>

                    <Text className="font-bold text-sm mb-1">items-center</Text>
                    <Grid className="grid-cols-3 items-center h-24 bg-gray-100 gap-2 p-2">
                        <View className="h-full bg-white border border-gray-200"><Box text="C" className="h-10 bg-teal-200" /></View>
                        <View className="h-full bg-white border border-gray-200"><Box text="C" className="h-10 bg-teal-200" /></View>
                        <View className="h-full bg-white border border-gray-200"><Box text="C" className="h-10 bg-teal-200" /></View>
                    </Grid>
                </Section>

                {/* 11. Justify Self */}
                <Section title="11. Justify Self (Override Inline)" desc="Overrides inline alignment for a single item.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">justify-self-auto | justify-self-start | justify-self-end | justify-self-center | justify-self-stretch</Text>

                    <Grid className="grid-cols-2 gap-2 bg-indigo-50 p-2">
                        <Box text="Default (Stretch)" className="bg-indigo-200" />
                        <View className="bg-white border border-indigo-100">
                            <Box text="justify-self-end" className="justify-self-end w-24 bg-indigo-300" />
                        </View>
                    </Grid>
                </Section>

                {/* 12. Align Self */}
                <Section title="12. Align Self (Override Block)" desc="Overrides vertical alignment for a single item.">
                    <Text className="text-xs text-slate-500 mb-2 font-mono">self-auto | self-start | self-end | self-center | self-stretch | self-baseline</Text>

                    <Grid className="grid-cols-3 h-24 gap-2 bg-indigo-50 p-2">
                        <Box text="Stretch (Def)" className="bg-indigo-200" />
                        <Box text="self-center" className="self-center h-10 bg-indigo-300" />
                        <Box text="self-end" className="self-end h-10 bg-indigo-400" />
                    </Grid>
                </Section>

                {/* 13. Place Shorthands */}
                <Section title="13. Place Shorthands" desc="Combine Align and Justify properties.">
                    <Text className="font-bold text-sm mt-2 mb-1">place-content-center</Text>
                    <Text className="text-xs text-slate-500 mb-2">Centers tracks in both axes (align-content + justify-content).</Text>
                    <Grid className="grid-cols-2 place-content-center h-32 bg-orange-50 gap-2 w-full mb-4">
                        <Box text="1" className="w-10 h-10 bg-orange-300" />
                        <Box text="2" className="w-10 h-10 bg-orange-300" />
                        <Box text="3" className="w-10 h-10 bg-orange-300" />
                        <Box text="4" className="w-10 h-10 bg-orange-300" />
                    </Grid>

                    <Text className="font-bold text-sm mb-1">place-items-center</Text>
                    <Text className="text-xs text-slate-500 mb-2">Centers items in cells in both axes (align-items + justify-items).</Text>
                    <Grid className="grid-cols-2 place-items-center h-24 bg-orange-50 gap-2 mb-4">
                        <Box text="X" className="w-10 h-10 bg-orange-400" />
                        <Box text="Y" className="w-10 h-10 bg-orange-400" />
                    </Grid>

                    <Text className="font-bold text-sm mb-1">place-self-end</Text>
                    <Text className="text-xs text-slate-500 mb-2">Aligns individual item to end in both axes.</Text>
                    <Grid className="grid-cols-2 h-24 bg-orange-50 gap-2">
                        <Box text="Default" className="bg-orange-200" />
                        <Box text="place-self-end" className="place-self-end w-24 h-10 bg-orange-500 text-white" />
                    </Grid>
                </Section>

                <View className="h-20" />
            </View>
        </ScrollView>
    );
}
