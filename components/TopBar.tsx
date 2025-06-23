import { Pressable, TextInput, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function TopBar() {
  return (
    <View className="from-primary-100 to-primary-100/90 border-primary-200/50 flex w-full items-center justify-center gap-2 border-b bg-gradient-to-r p-4">
      <View className="bg-primary-200/80 border-primary-200/50 mx-4 flex max-w-2xl flex-row items-center rounded-full border px-5 py-1">
        <Feather name="search" size={24} color="black" />
        <TextInput
          id="searchBarTextInput"
          className="text-primary-800 placeholder-primary-400 border-primary-400/50 ml-4 flex-1 border-r bg-transparent py-2 pr-4 text-lg font-medium"
          placeholder="Search songs..."
        />
        <Pressable className="bg-primary-100/50 ml-4 rounded-full p-2">
          <Feather name="download" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
}
