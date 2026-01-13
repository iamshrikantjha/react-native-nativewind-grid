
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { MasonryGrid } from 'react-native-nativewind-grid';


export default function App() {
  const items = Array.from({ length: 10 }, (_, i) => i);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Masonry Grid Example</Text>
      <MasonryGrid cols={2} gap={10}>
        {items.map(i => (
          <View key={i} style={[styles.item, { height: 100 + (i % 3) * 50 }]}>
            <Text>Item {i}</Text>
          </View>
        ))}
      </MasonryGrid>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});
