import './global.css';
import { View } from 'react-native';
import { GridDemo } from './src/components/GridDemo';

export default function App() {
  return (
    <View className="flex-1 bg-slate-100">
      <GridDemo />
    </View>
  );
}
