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
            backgroundColor: colors.primary100,
            borderColor: colors.primary300,
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
                backgroundColor: colors.primary50,
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
          <Text
            className="mt-2 font-bold"
            style={{
              color: colors.primary800,
              textShadowColor: colors.primary200,
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}>
            {playlist.name}
          </Text>
          <Text
            className="font-bold "
            style={{
              color: colors.primary400,
              textShadowColor: colors.primary200,
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}>
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
          </Text>
        </View>
      </Pressable>

      <Index playlist={playlist} visible={modalVisible} onHide={hideContextMenu} />
    </>
  );
}
