// Premium Bento Grid & Modern Dashboard Demo
// Showcasing: Bento Layouts, Complex Spans, Arbitrary Values, Alignment Shortcuts (place-*)
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid } from 'react-native-nativewind-grid';

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
