// Premium Bento Grid & Modern Dashboard Demo
// Showcasing: Bento Layouts, Complex Spans, Arbitrary Values, Alignment Shortcuts (place-*)
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid, VirtualGrid } from 'react-native-nativewind-grid';

// Color Palette
const colors = {
  primary: '#4F46E5', // Indigo 600
  secondary: '#EC4899', // Pink 500
  accent: '#8B5CF6', // Violet 500
  success: '#10B981', // Emerald 500
  warning: '#F59E0B', // Amber 500
  dark: '#1E293B', // Slate 800
  light: '#F8FAFC', // Slate 50
  card: '#FFFFFF',
  text: '#334155',
  textLight: '#94A3B8',
};

export function GridDemo() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HERO HEADER */}
        <View style={styles.header}>
          <View className="mb-2 bg-indigo-100 self-start px-3 py-1 rounded-full border border-indigo-200">
            <Text className="text-indigo-700 font-bold text-xs uppercase tracking-wider">v2.0 Update</Text>
          </View>
          <Text style={styles.title}>NativeWind Grid</Text>
          <Text style={styles.subtitle}>
            The ultimate layout engine for React Native.
            <Text style={{ fontWeight: '700', color: colors.primary }}> Now with place-* shortcuts.</Text>
          </Text>
        </View>

        {/* 1. MODERN BENTO PORTFOLIO (Trending 2024/25) */}
        <Text style={styles.sectionTitle}>1. Trending Bento Portfolio</Text>
        <Text style={styles.sectionDesc}>
          Mixed content types, rounded corners, complex spans.
        </Text>

        <Grid className="grid grid-cols-4 gap-4 mb-12">
          {/* Profile Large */}
          <View className="col-span-2 row-span-2 bg-white rounded-3xl p-5 shadow-sm justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-slate-200 rounded-full items-center justify-center">
                <Text className="text-xl">👨‍💻</Text>
              </View>
              <View>
                <Text className="font-bold text-lg text-slate-800">Alex Designer</Text>
                <Text className="text-slate-500 text-sm">Product Lead</Text>
              </View>
            </View>
            <View>
              <Text className="text-3xl font-black text-slate-800 mt-2">4.8k</Text>
              <Text className="text-slate-500">Project Views</Text>
            </View>
          </View>

          {/* Social Link (Dark Mode) */}
          <View className="col-span-2 bg-slate-900 rounded-3xl p-5 flex-row justify-between items-center shadow-sm">
            <Text className="text-white font-bold text-lg">GitHub</Text>
            <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center transform -rotate-45">
              <Text className="text-white">➜</Text>
            </View>
          </View>

          {/* Stat Square 1 */}
          <View className="col-span-1 bg-indigo-500 rounded-3xl items-center justify-center p-2 shadow-sm">
            <Text className="text-white text-2xl font-bold">12</Text>
            <Text className="text-indigo-200 text-xs">Apps</Text>
          </View>

          {/* Stat Square 2 */}
          <View className="col-span-1 bg-pink-500 rounded-3xl items-center justify-center p-2 shadow-sm">
            <Text className="text-white text-2xl font-bold">85%</Text>
            <Text className="text-pink-200 text-xs">Growth</Text>
          </View>

          {/* Long Bar */}
          <View className="col-span-4 bg-white rounded-3xl p-4 flex-row items-center justify-between shadow-sm">
            <Text className="text-slate-600 font-medium">Available for hire</Text>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 font-bold text-xs uppercase">Yes</Text>
            </View>
          </View>
        </Grid>


        {/* 2. ADVANCED ALIGNMENT (place-*) */}
        <Text style={styles.sectionTitle}>2. Alignment Shortcuts</Text>
        <Text style={styles.sectionDesc}>
          Using <Text className="font-mono text-purple-600 bg-purple-100 px-1 rounded">place-items-center</Text> shorthands.
        </Text>

        <Grid className="grid grid-cols-2 gap-4 h-48 mb-12">
          {/* Box 1: place-items-center (Centers both X and Y) */}
          <View className="bg-white rounded-lg place-items-center shadow-sm border border-slate-100">
            <View className="w-8 h-8 bg-purple-500 rounded-full shadow-lg" />
            <Text className="text-xs text-slate-400 mt-2">place-items-center</Text>
          </View>

          {/* Box 2: place-content-between (Distributes content) */}
          <View className="bg-white rounded-lg p-4 place-content-between shadow-sm border border-slate-100">
            <View className="w-full h-2 bg-slate-200 rounded-full" />
            <View className="w-2/3 h-2 bg-slate-200 rounded-full" />
            <View className="w-full h-8 bg-indigo-50 rounded-lg items-center justify-center">
              <Text className="text-indigo-500 font-bold text-xs">Action</Text>
            </View>
            <Text className="text-xs text-slate-400 text-center mt-1">place-content-between</Text>
          </View>
        </Grid>


        {/* 3. ARBITRARY VALUES & ORDER */}
        <Text style={styles.sectionTitle}>3. Arbitrary & Order</Text>
        <Text style={styles.sectionDesc}>
          <Text className="font-mono">grid-cols-[16]</Text>, <Text className="font-mono">gap-[2px]</Text>, <Text className="font-mono">order-last</Text>
        </Text>

        <Grid className="grid grid-cols-[16] gap-[2px] bg-slate-200 p-[2px] rounded-lg mb-12 overflow-hidden">
          {/* 16 Column Heatmap style grid */}
          {Array.from({ length: 32 }).map((_, i) => (
            <View
              key={i}
              className={`h-4 col-span-1 rounded-sm ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-slate-300'} ${i === 31 ? 'order-first bg-red-500' : ''}`}
            />
          ))}
          <View className="col-span-16 bg-white p-2 items-center">
            <Text className="text-slate-500 text-xs">The red block is `order-first` but logically last.</Text>
          </View>
        </Grid>


        {/* 4. ANALYTICS DASHBOARD (Complex) */}
        <Text style={styles.sectionTitle}>4. SaaS Dashboard</Text>

        <Grid className="grid grid-cols-3 gap-3">
          {/* MRR Card */}
          <View className="col-span-3 bg-slate-900 rounded-lg p-5">
            <Text className="text-slate-400 font-medium">Monthly Recurring Revenue</Text>
            <View className="flex-row items-baseline gap-2 mt-1">
              <Text className="text-white text-3xl font-bold">$124,592</Text>
              <Text className="text-green-400 font-medium text-sm">+2.4%</Text>
            </View>
            <View className="h-24 flex-row items-end gap-2 mt-4">
              {[40, 60, 45, 80, 55, 75, 90, 65, 85].map((h, i) => (
                <View key={i} style={{ height: `${h}%` }} className="flex-1 bg-slate-700 rounded-t-sm hover:bg-indigo-500" />
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="col-span-1 bg-white p-4 rounded-xl items-center justify-center shadow-sm gap-2">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
              <Text className="text-blue-600 text-lg">⊕</Text>
            </View>
            <Text className="text-xs font-bold text-slate-600">Add User</Text>
          </View>
          <View className="col-span-1 bg-white p-4 rounded-xl items-center justify-center shadow-sm gap-2">
            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
              <Text className="text-orange-600 text-lg">⚡</Text>
            </View>
            <Text className="text-xs font-bold text-slate-600">Upgrade</Text>
          </View>
          <View className="col-span-1 bg-white p-4 rounded-xl items-center justify-center shadow-sm gap-2">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
              <Text className="text-purple-600 text-lg">⚙</Text>
            </View>
            <Text className="text-xs font-bold text-slate-600">Settings</Text>
          </View>
        </Grid>

        {/* 5. ADVANCED CONTROL (Flow, Gap X/Y, Row Placement) */}
        <Text style={styles.sectionTitle}>5. Advanced Control</Text>
        <Text style={styles.sectionDesc}>
          <Text className="font-mono">grid-flow-col</Text>, <Text className="font-mono">gap-x/y</Text>, <Text className="font-mono">row-start/end</Text>
        </Text>

        {/* Grid Flow Column & Gap X/Y */}
        <Grid className="grid grid-cols-3 grid-flow-col gap-x-8 gap-y-2 mb-8 bg-slate-100 p-4 rounded-xl border border-slate-200">
          <View className="bg-orange-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">1</Text></View>
          <View className="bg-orange-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">2</Text></View>
          <View className="bg-orange-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">3</Text></View>
          <View className="bg-blue-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">4 (Col 2)</Text></View>
          <View className="bg-blue-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">5 (Col 2)</Text></View>
          <View className="bg-blue-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">6 (Col 2)</Text></View>
        </Grid>

        {/* Explicit Row Placement */}
        <Text style={styles.sectionDesc}>
          Explicit Row Placement (<Text className="font-mono">row-start-1 row-end-3</Text>)
        </Text>
        <Grid className="grid grid-cols-3 gap-2 mb-12 h-32">
          <View className="bg-slate-300 rounded p-2"><Text>Item 1</Text></View>
          {/* This item forces itself to start at row 1 and span 2 rows, effectively overlapping or displacing depending on packing */}
          <View className="row-start-1 row-end-3 bg-teal-500 rounded p-2 justify-center"><Text className="text-white font-bold">Row 1-3</Text></View>
          <View className="bg-slate-300 rounded p-2"><Text>Item 3</Text></View>
          <View className="bg-slate-300 rounded p-2"><Text>Item 4</Text></View>
        </Grid>

        {/* Align Content (Multi-line) */}
        <Text style={styles.sectionDesc}>
          <Text className="font-mono">align-content-center</Text> (packing lines in container)
        </Text>
        <Grid className="grid grid-cols-3 gap-2 h-40 bg-slate-200 rounded-xl content-center flex-wrap mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} className="bg-purple-500 w-12 h-12 rounded-full border-2 border-white" />
          ))}
        </Grid>

        {/* 5. ADVANCED CONTROL (Flow, Gap X/Y, Row Placement) */}
        <Text style={styles.sectionTitle}>5. Advanced Control</Text>
        <Text style={styles.sectionDesc}>
          <Text className="font-mono">grid-flow-col</Text>, <Text className="font-mono">gap-x/y</Text>, <Text className="font-mono">row-start/end</Text>
        </Text>

        {/* Grid Flow Column & Gap X/Y */}
        <Grid className="grid grid-cols-3 grid-flow-col gap-x-8 gap-y-2 mb-8 bg-slate-100 p-4 rounded-xl border border-slate-200">
          <View className="bg-orange-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">1</Text></View>
          <View className="bg-orange-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">2</Text></View>
          <View className="bg-orange-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">3</Text></View>
          <View className="bg-blue-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">4 (Col 2)</Text></View>
          <View className="bg-blue-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">5 (Col 2)</Text></View>
          <View className="bg-blue-400 w-full h-10 rounded justify-center items-center"><Text className="text-white font-bold">6 (Col 2)</Text></View>
        </Grid>

        {/* Explicit Row Placement */}
        <Text style={styles.sectionDesc}>
          Explicit Row Placement (<Text className="font-mono">row-start-1 row-end-3</Text>)
        </Text>
        <Grid className="grid grid-cols-3 gap-2 mb-12 h-32">
          <View className="bg-slate-300 rounded p-2"><Text>Item 1</Text></View>
          {/* This item forces itself to start at row 1 and span 2 rows, effectively overlapping or displacing depending on packing */}
          <View className="row-start-1 row-end-3 bg-teal-500 rounded p-2 justify-center"><Text className="text-white font-bold">Row 1-3</Text></View>
          <View className="bg-slate-300 rounded p-2"><Text>Item 3</Text></View>
          <View className="bg-slate-300 rounded p-2"><Text>Item 4</Text></View>
        </Grid>

        {/* Align Content (Multi-line) */}
        <Text style={styles.sectionDesc}>
          <Text className="font-mono">align-content-center</Text> (packing lines in container)
        </Text>
        <Grid className="grid grid-cols-3 gap-2 h-40 bg-slate-200 rounded-xl content-center flex-wrap mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} className="bg-purple-500 w-12 h-12 rounded-full border-2 border-white" />
          ))}
        </Grid>

        {/* 6. FLEX UTILITIES (Mix & Match) */}
        <Text style={styles.sectionTitle}>6. Flex Utilities & Auto</Text>
        <Text style={styles.sectionDesc}>
          <Text className="font-mono">flex-row-reverse</Text>, <Text className="font-mono">flex-nowrap</Text>, <Text className="font-mono">grow</Text>
        </Text>

        {/* Flex Row Reverse & No Wrap (grid-cols-none for auto widths) */}
        <Grid className="grid grid-cols-none flex-row-reverse flex-nowrap gap-2 bg-slate-100 p-2 mb-8 overflow-hidden">
          <View className="w-20 h-10 bg-red-400 justify-center items-center"><Text>1</Text></View>
          <View className="w-20 h-10 bg-green-400 justify-center items-center"><Text>2</Text></View>
          <View className="w-20 h-10 bg-blue-400 justify-center items-center"><Text>3</Text></View>
        </Grid>

        {/* Flex Grow Internal */}
        <Text style={styles.sectionDesc}>
          Internal <Text className="font-mono">flex-1</Text> inside Grid Items
        </Text>
        <Grid className="grid grid-cols-2 gap-4 h-32">
          <View className="bg-white p-2 rounded flex-row gap-2">
            <View className="w-8 h-full bg-slate-200" />
            <View className="flex-1 bg-indigo-200 justify-center items-center"><Text>Flex 1</Text></View>
          </View>
          <View className="bg-white p-2 rounded flex-col gap-2">
            <View className="h-4 w-full bg-slate-200" />
            <View className="flex-1 bg-pink-200 justify-center items-center"><Text>Flex 1</Text></View>
          </View>
        </Grid>

        {/* 7. GRID ROWS (New Feature) */}
        <Text style={styles.sectionTitle}>7. Grid Rows (Explicit Height)</Text>
        <Text style={styles.sectionDesc}>
          <Text className="font-mono">grid-rows-3</Text> divides the container height into 3 equal rows.
        </Text>

        <Grid className="grid grid-cols-2 grid-rows-3 gap-4 h-64 bg-slate-100 p-4 rounded-xl mb-12">
          {/* Item 1: Standard */}
          <View className="bg-white rounded items-center justify-center shadow-sm">
            <Text>1</Text>
          </View>

          {/* Item 2: Row Span 2 */}
          <View className="row-span-2 bg-indigo-500 rounded items-center justify-center shadow-sm">
            <Text className="text-white font-bold">Row Span 2</Text>
          </View>

          {/* Item 3: Col Span 1 */}
          <View className="bg-white rounded items-center justify-center shadow-sm">
            <Text>3</Text>
          </View>

          {/* Item 4: Col Span 2 (Bottom Row) */}
          <View className="col-span-2 bg-emerald-500 rounded items-center justify-center shadow-sm">
            <Text className="text-white font-bold">Col Span 2 (Row 3)</Text>
          </View>
        </Grid>

        {/* 8. DENSE PACKING */}
        <Text style={styles.sectionTitle}>8. Dense Packing</Text>
        <Text style={styles.sectionDesc}>
          <Text className="font-mono">grid-flow-row-dense</Text> backtracks to fill holes.
        </Text>

        <Grid className="grid grid-cols-3 gap-1 grid-flow-row-dense bg-slate-100 p-2 rounded-xl mb-12">
          {/* Item 1: Span 2 */}
          <View className="col-span-2 bg-slate-300 h-10 items-center justify-center"><Text>1 (Span 2)</Text></View>
          {/* Item 2: Span 2 (Too big for Col 3) */}
          <View className="col-span-2 bg-slate-300 h-10 items-center justify-center"><Text>2 (Span 2)</Text></View>
          {/* Item 3: Span 1 (Should fill hole in R1, C3 since it's dense) */}
          <View className="col-span-1 bg-green-400 h-10 items-center justify-center"><Text>3 (Dense Fill)</Text></View>
          {/* Item 4 */}
          <View className="col-span-1 bg-slate-300 h-10 items-center justify-center"><Text>4</Text></View>
        </Grid>

        {/* 9. MASONRY LAYOUT */}
        <Text style={styles.sectionTitle}>9. Masonry Layout 🧱</Text>
        <Text style={styles.sectionDesc}>
          Pinterest-style multi-column layout using <Text className="font-mono">masonry</Text> prop.
        </Text>

        <Grid masonry className="grid-cols-3 gap-1 mb-12">
          {/* Random Heights */}
          {[40, 60, 30, 80, 50, 70, 45, 90, 35].map((h, i) => (
            <View key={i} style={{ height: h * 2, backgroundColor: ['#FCA5A5', '#FDBA74', '#86EFAC', '#93C5FD', '#C4B5FD', '#F0ABFC'][i % 6] }} className="rounded-xl items-center justify-center shadow-sm">
              <Text className="text-white font-bold">{i + 1}</Text>
            </View>
          ))}
        </Grid>

        {/* 10. GRID AREAS */}
        <Text style={styles.sectionTitle}>10. Grid Areas</Text>
        <Text style={styles.sectionDesc}>
          Areas: 'header header' 'sidebar main' 'footer footer'
        </Text>
        <Grid
          className="grid-cols-3 bg-gray-200 p-2 gap-2 h-64 rounded-xl mb-12"
          // Using grid-areas arbitrary value
          style={{}}
          // @ts-ignore
          className="grid-areas-['header_header_header','sidebar_main_main','footer_footer_footer'] grid-cols-[100px_1fr_1fr]"
        >
          <View className="area-header bg-indigo-400 items-center justify-center rounded"><Text className="text-white">Header</Text></View>
          <View className="area-sidebar bg-teal-400 items-center justify-center rounded"><Text className="text-white">Sidebar</Text></View>
          <View className="area-main bg-white items-center justify-center rounded"><Text>Main Content</Text></View>
          <View className="area-footer bg-slate-600 items-center justify-center rounded"><Text className="text-white">Footer</Text></View>
        </Grid>

        {/* 12. SUBGRID (Visual) */}
        <Text style={styles.sectionTitle}>12. Subgrid (Visual)</Text>
        <Text style={styles.sectionDesc}>
          Nested grid inherits parent tracks via <Text className="font-mono">grid-cols-subgrid</Text>.
        </Text>

        {/* Parent Grid: 3 Cols [1fr 2fr 1fr] */}
        <Grid className="grid grid-cols-[1fr_2fr_1fr] gap-4 bg-slate-800 p-4 rounded-xl mb-12">
          {/* 1. Normal Item */}
          <View className="bg-slate-600 h-20 items-center justify-center rounded"><Text className="text-white">1fr</Text></View>

          {/* 2. Subgrid Item Spanning 2 cols */}
          {/* This item spans parent cols 2 and 3 (2fr and 1fr). */}
          <Grid className="col-span-2 grid-cols-subgrid bg-slate-700 rounded p-2 gap-2">
            <View className="bg-pink-500 h-10 items-center justify-center rounded"><Text className="text-white">Sub 1 (2fr)</Text></View>
            <View className="bg-purple-500 h-10 items-center justify-center rounded"><Text className="text-white">Sub 2 (1fr)</Text></View>
          </Grid>

          {/* 3. New Row */}
          <View className="col-span-3 bg-slate-600 h-10 items-center justify-center rounded"><Text className="text-white">Footer (Span 3)</Text></View>
        </Grid>

        <View style={{ height: 50 }} />

        {/* 13. VIRTUAL GRID (Large Data) */}
        <Text style={styles.sectionTitle}>13. Virtual Grid (Perf)</Text>
        <Text style={styles.sectionDesc}>
          Renders 100 items efficiently using chunks.
        </Text>
        <View style={{ height: 200, marginBottom: 40 }}>
          {/* Note: VirtualGrid needs explicit height or flex container */}
          <VirtualGrid
            className="grid-cols-4 gap-2 bg-slate-100 p-2"
            itemClassName="h-10 items-center justify-center rounded bg-white shadow-sm"
            data={Array.from({ length: 100 }).map((_, i) => i)}
            renderItem={({ item }) => <Text>{item}</Text>}
          />
        </View>

        {/* 14. STICKY HEADERS (Row Based) */}
        <Text style={styles.sectionTitle}>14. Sticky Rows</Text>
        <Text style={styles.sectionDesc}>
          Using <Text className="font-mono">stickyHeaderIndices</Text> on VirtualGrid.
        </Text>
        <View style={{ height: 200 }}>
          <VirtualGrid
            className="grid-cols-2 gap-2 bg-slate-200 p-2"
            data={['HEADER', ...Array.from({ length: 20 }).map((_, i) => `Item ${i}`)]}
            stickyHeaderIndices={[0]} // Stick the first row
            renderItem={({ item }) => {
              const isHeader = item === 'HEADER';
              return (
                <View className={`${isHeader ? 'col-span-2 bg-indigo-600 h-12' : 'bg-white h-20'} items-center justify-center rounded shadow-sm`}>
                  <Text className={isHeader ? 'text-white font-bold' : ''}>{item}</Text>
                </View>
              );
            }}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slate 50
  },
  container: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  sectionDesc: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
    lineHeight: 20,
  },
  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 100,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark,
  },
  iconContainer: { position: 'absolute', right: 15, top: 15 },
  icon: { fontSize: 20 },
});
