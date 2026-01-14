import { Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
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
          <Text style={styles.subtitle}>Premium Layout Engine</Text>
        </View>

        {/* SECTION 1: BENTO GRID DASHBOARD */}
        <Text style={styles.sectionTitle}>Dashboard (Bento Grid)</Text>
        <Text style={styles.sectionDesc}>
          Complex spans using col-span & row-span
        </Text>

        <Grid className="grid grid-cols-4 gap-3">
          {/* Large Main Stat */}
          <View
            className="col-span-2 row-span-2"
            style={[styles.card, styles.bgPrimary]}
          >
            <Text style={[styles.cardTitle, styles.textWhite]}>
              Total Revenue
            </Text>
            <Text style={[styles.cardValueLarge, styles.textWhite]}>
              $48.5k
            </Text>
            <Text style={[styles.cardSub, styles.textWhiteOpac]}>
              +12.5% from last month
            </Text>
          </View>

          {/* Small Stats */}
          <Card title="Active Users" value="2.4k" className="col-span-1" />
          <Card title="New Signups" value="+180" className="col-span-1" />

          {/* Medium Width Stat */}
          <View
            className="col-span-2"
            style={[styles.card, styles.bgSecondary]}
          >
            <Text style={[styles.cardTitle, styles.textWhite]}>
              Engagement Rate
            </Text>
            <Text style={[styles.cardValue, styles.textWhite]}>84%</Text>
          </View>

          {/* Full Width Graph Placeholder */}
          <View className="col-span-4" style={[styles.card, styles.bgDark]}>
            <Text style={[styles.cardTitle, styles.textWhite]}>
              Monthly Analytics
            </Text>
            <View style={styles.graphContainer}>
              <View style={[styles.bar, { height: '40%' }]} />
              <View
                style={[
                  styles.bar,
                  { height: '70%', backgroundColor: colors.primary },
                ]}
              />
              <View style={[styles.bar, { height: '50%' }]} />
              <View
                style={[
                  styles.bar,
                  { height: '85%', backgroundColor: colors.secondary },
                ]}
              />
              <View style={[styles.bar, { height: '60%' }]} />
              <View style={[styles.bar, { height: '75%' }]} />
            </View>
          </View>
        </Grid>

        {/* SECTION 2: KEYPAD / CALCULATOR (GRID FLOW) */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Keypad Layout</Text>
        <Text style={styles.sectionDesc}>Using grid-flow-col type layout</Text>

        <View style={styles.calculatorShell}>
          <View style={styles.screen}>
            <Text style={styles.screenText}>1,234.56</Text>
          </View>
          <Grid className="grid grid-cols-4 gap-3">
            {['C', '±', '%', '÷'].map(k => (
              <Key key={k} label={k} type="func" />
            ))}
            {[7, 8, 9, '×', 4, 5, 6, '-', 1, 2, 3, '+'].map(k => (
              <Key
                key={k.toString()}
                label={k}
                type={typeof k === 'number' ? 'num' : 'op'}
              />
            ))}
            <View className="col-span-2">
              <View style={[styles.key, styles.keyZero]}>
                <Text style={styles.keyText}>0</Text>
              </View>
            </View>
            <Key label="." type="num" />
            <Key label="=" type="op" />
          </Grid>
        </View>

        {/* SECTION 3: IMAGE GALLERY */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Masonry-style Gallery</Text>
        <Text style={styles.sectionDesc}>Mixed aspect ratios with gaps</Text>

        <Grid className="grid grid-cols-3 gap-2">
          <ImagePlaceholder
            height={150}
            color={colors.primary}
            className="col-span-1"
          />
          <ImagePlaceholder
            height={150}
            color={colors.accent}
            className="col-span-1"
          />
          <ImagePlaceholder
            height={310}
            color={colors.warning}
            className="col-span-1 row-span-2"
            text="Tall Item"
          />

          <ImagePlaceholder
            height={150}
            color={colors.success}
            className="col-span-2"
            text="Wide Item"
          />
          <ImagePlaceholder
            height={150}
            color={colors.secondary}
            className="col-span-1"
          />
          <ImagePlaceholder
            height={150}
            color={colors.dark}
            className="col-span-1"
          />
          <ImagePlaceholder
            height={150}
            color={colors.primary}
            className="col-span-1"
          />
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
