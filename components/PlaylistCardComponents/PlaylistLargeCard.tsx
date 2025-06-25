import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, Image } from 'react-native';
import { Playlist } from 'types/Song';
import Index from './Modals/Index';
import { useState } from 'react';

interface PlaylistLargeCardProps {
  playlist: Playlist;
}

export default function PlaylistLargeCard({ playlist }: PlaylistLargeCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const showContextMenu = () => {
    setModalVisible(true);
  };

  const hideContextMenu = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => router.push(`/playlist?id=${playlist.id}`)}
        onLongPress={showContextMenu}
        delayLongPress={500}
        className="flex-1">
        <View
          className="h-fit w-full items-center rounded-2xl border p-4"
          style={{
            backgroundColor: colors.primary200,
            borderColor: colors.primary200,
            shadowColor: colors.primary600,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}>
          <View style={{ width: '100%', maxWidth: 200 }}>
            <View
              className="items-center justify-center"
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.primary200,
                overflow: 'hidden',
              }}>
              {playlist.image ? (
                <Image
                  source={{ uri: playlist.image }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Feather name="music" size={100} color={colors.primary600} />
              )}
            </View>
          </View>
          <Text className="mt-2 font-bold" style={{ color: colors.primary600 }}>
            {playlist.name}
          </Text>
          <Text className="font-bold " style={{ color: colors.primary400 }}>
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
          </Text>
        </View>
      </Pressable>

      <Index playlist={playlist} visible={modalVisible} onHide={hideContextMenu} />
    </>
  );
}
