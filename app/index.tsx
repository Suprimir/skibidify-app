import HomePage from 'components/HomePage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <HomePage />
    </SafeAreaView>
  );
}
