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

const Card = ({ title, value, icon, style, className }: any) => (
  <View style={[styles.card, style]} className={className}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    {icon && (
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
    )}
  </View>
);

export function GridDemo() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>NativeWind Grid</Text>
          <Text style={styles.subtitle}>Premium Layout Engine v2.0</Text>
        </View>

        {/* SECTION 1: ARBITRARY VALUES & PLACEMENT */}
        <Text style={styles.sectionTitle}>1. Arbitrary Values & Placement</Text>
        <Text style={styles.sectionDesc}>
          grid-cols-[5], gap-[15px], col-start / col-end
        </Text>

        <Grid className="grid grid-cols-[5] gap-[15px] mb-8">
          <View className="col-span-2 bg-indigo-500 h-20 rounded-lg justify-center items-center">
            <Text style={styles.textWhite}>Span 2</Text>
          </View>
          <View className="col-start-3 col-end-6 bg-purple-500 h-20 rounded-lg justify-center items-center">
            <Text style={styles.textWhite}>Start 3 / End 6 (Span 3)</Text>
          </View>
          <View className="col-span-5 bg-slate-700 h-10 rounded-lg justify-center items-center mt-2">
            <Text style={styles.textWhite}>Full Width (Span 5)</Text>
          </View>
        </Grid>


        {/* SECTION 2: ALIGNMENT & JUSTIFICATION */}
        <Text style={styles.sectionTitle}>2. Alignment & Justification</Text>
        <Text style={styles.sectionDesc}>
          justify-between, items-center (Container)
        </Text>

        {/* Container Level Alignment */}
        <Grid className="grid grid-cols-3 gap-2 h-40 bg-white rounded-xl mb-8 justify-between items-center p-2">
          <View className="bg-red-400 w-16 h-16 rounded-md justify-center items-center"><Text>1</Text></View>
          <View className="bg-red-400 w-16 h-16 rounded-md justify-center items-center"><Text>2</Text></View>
          <View className="bg-red-400 w-16 h-16 rounded-md justify-center items-center"><Text>3</Text></View>
        </Grid>

        <Text style={styles.sectionDesc}>
          self-start, self-center, self-end (Item Level)
        </Text>
        <Grid className="grid grid-cols-3 gap-2 h-40 bg-white rounded-xl mb-8 p-2">
          <View className="bg-green-400 w-full h-10 rounded-md self-start justify-center items-center"><Text>Start</Text></View>
          <View className="bg-green-400 w-full h-10 rounded-md self-center justify-center items-center"><Text>Center</Text></View>
          <View className="bg-green-400 w-full h-10 rounded-md self-end justify-center items-center"><Text>End</Text></View>
        </Grid>


        {/* SECTION 3: ORDERING */}
        <Text style={styles.sectionTitle}>3. Ordering</Text>
        <Text style={styles.sectionDesc}>
          order-first, order-last, order-{'{'}n{'}'}
        </Text>

        <Grid className="grid grid-cols-3 gap-3 mb-8">
          <View className="bg-slate-300 h-20 rounded-lg justify-center items-center order-last">
            <Text style={styles.cardTitle}>1 (Last)</Text>
          </View>
          <View className="bg-slate-400 h-20 rounded-lg justify-center items-center">
            <Text style={styles.cardTitle}>2</Text>
          </View>
          <View className="bg-slate-800 h-20 rounded-lg justify-center items-center order-first">
            <Text style={[styles.cardTitle, styles.textWhite]}>3 (First)</Text>
          </View>
        </Grid>


        {/* SECTION 4: MASONRY / MIXED */}
        <Text style={styles.sectionTitle}>4. Complex Dashboard</Text>
        <Grid className="grid grid-cols-4 gap-3">
          <View className="col-span-2 row-span-2 bg-indigo-600 rounded-2xl p-4 justify-between">
            <Text style={[styles.cardTitle, styles.textWhite]}>Revenue</Text>
            <Text style={[styles.cardValueLarge, styles.textWhite]}>$50k</Text>
          </View>

          <Card title="Users" value="2.1k" className="col-span-1" />
          <Card title="Bounce" value="12%" className="col-span-1" />

          <View className="col-span-2 bg-pink-500 rounded-2xl p-4 justify-center">
            <Text style={[styles.cardTitle, styles.textWhite]}>Campaign Active</Text>
          </View>
        </Grid>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Key = ({
  label,
  type,
  style: styleProp,
}: {
  label: string | number;
  type: 'num' | 'op' | 'func';
  style?: any;
}) => {
  let style = styles.key;
  let textStyle = styles.keyText;
  if (type === 'op') {
    style = styles.keyOp;
    textStyle = styles.keyTextWhite;
  } else if (type === 'func') {
    style = styles.keyFunc;
    textStyle = styles.keyTextBlack;
  }

  return (
    <View style={[style, styleProp]}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
};

const ImagePlaceholder = ({ height, color, className, text, style }: any) => (
  <View
    className={className}
    style={[styles.imagePlace, { height, backgroundColor: color }, style]}
  >
    <Text style={styles.imageText}>{text || 'Img'}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Slate 100
  },
  container: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 10,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 32,
  },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 100,
  },
  bgPrimary: { backgroundColor: colors.primary },
  bgSecondary: { backgroundColor: colors.secondary },
  bgDark: { backgroundColor: colors.dark },

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
  cardValueLarge: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.dark,
  },
  cardSub: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textLight,
  },
  textWhite: { color: 'white' },
  textWhiteOpac: { color: 'rgba(255,255,255,0.7)' },

  // Graph
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 12,
    marginTop: 10,
  },
  bar: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 4,
  },

  // Calculator
  calculatorShell: {
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 20,
    paddingBottom: 30,
  },
  screen: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  screenText: {
    color: 'white',
    fontSize: 48,
    fontWeight: '300',
  },
  key: {
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyOp: {
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyFunc: {
    height: 70,
    borderRadius: 35,
    backgroundColor: '#A5A5A5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyZero: {
    width: '100%', // Handled by Grid actually
    alignItems: 'flex-start',
    paddingLeft: 30,
  },
  keyText: { color: 'white', fontSize: 28, fontWeight: '500' },
  keyTextBlack: { color: 'black', fontSize: 28, fontWeight: '500' },
  keyTextWhite: { color: 'white', fontSize: 32, fontWeight: '500' },

  // Gallery
  imagePlace: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  iconContainer: { position: 'absolute', right: 15, top: 15 },
  icon: { fontSize: 20 },
});
