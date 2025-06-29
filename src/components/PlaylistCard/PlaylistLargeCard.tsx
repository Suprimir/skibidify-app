import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../contexts/theme';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Playlist } from '../../../types/Song';
import Index from './Modals/Index';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

interface PlaylistLargeCardProps {
  playlist: Playlist;
}

export default function PlaylistLargeCard({
  playlist,
}: PlaylistLargeCardProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const showContextMenu = () => {
    setModalVisible(true);
  };

  const hideContextMenu = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() =>
          navigation.navigate('Playlist', {
            playlistId: playlist.id,
          })
        }
        onLongPress={showContextMenu}
        delayLongPress={500}
        style={styles.pressableContainer}
      >
        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: colors.primary100,
              borderColor: colors.primary300,
            },
          ]}
        >
          <View style={styles.imageContainer}>
            <View
              style={[
                styles.imageWrapper,
                {
                  borderColor: colors.primary200,
                  backgroundColor: colors.primary50,
                },
              ]}
            >
              {playlist.image ? (
                <Image
                  source={{ uri: playlist.image }}
                  style={styles.playlistImage}
                  resizeMode="cover"
                />
              ) : (
                <Icon name="music" size={100} color={colors.primary600} />
              )}
            </View>
          </View>
          <Text
            style={[
              styles.playlistName,
              {
                color: colors.primary800,
                textShadowColor: colors.primary200,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              },
            ]}
          >
            {playlist.name}
          </Text>
          <Text
            style={[
              styles.songCount,
              {
                color: colors.primary400,
                textShadowColor: colors.primary200,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              },
            ]}
          >
            {playlist.songs.length}{' '}
            {playlist.songs.length === 1 ? 'song' : 'songs'}
          </Text>
        </View>
      </Pressable>

      <Index
        playlist={playlist}
        visible={modalVisible}
        onHide={hideContextMenu}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    flex: 1, // flex-1
  },
  cardContainer: {
    height: 'auto', // h-fit
    width: '100%', // w-full
    alignItems: 'center', // items-center
    borderRadius: 16, // rounded-2xl
    borderWidth: 1, // border
    padding: 16, // p-4
  },
  imageContainer: {
    width: '100%',
    maxWidth: 200,
  },
  imageWrapper: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center', // items-center
    justifyContent: 'center', // justify-center
  },
  playlistImage: {
    width: '100%',
    height: '100%',
  },
  playlistName: {
    marginTop: 8, // mt-2
    fontWeight: 'bold', // font-bold
  },
  songCount: {
    fontWeight: 'bold', // font-bold
  },
});
