import { usePlayer } from '../../contexts/player';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../contexts/theme';
import { useState } from 'react';
import ModalSongPlaying from './SongPlaying/SongPlaying';

export default function PlayerBar() {
  const { songPlaying, handlePause, paused } = usePlayer();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  if (!songPlaying) return null;

  const styles = StyleSheet.create({
    container: {
      margin: 8, // m-2 (2 * 4px = 8px)
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 8, // rounded-lg
      borderWidth: 1,
      paddingHorizontal: 16, // px-4
      paddingVertical: 8, // py-2
      backgroundColor: colors.primary100,
      borderColor: colors.primary200,
    },
    imageContainer: {
      height: 56, // h-14 (14 * 4px = 56px)
      width: 56, // w-14 (14 * 4px = 56px)
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary200,
      overflow: 'hidden',
    },
    image: {
      width: '135%',
      height: '135%',
    },
    textContainer: {
      flex: 1,
      paddingHorizontal: 12, // px-3
    },
    title: {
      fontSize: 14, // text-sm
      fontWeight: '600', // font-semibold
      color: colors.primary800,
      textShadowColor: colors.primary200,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    artist: {
      fontSize: 12, // text-xs
      color: colors.primary600,
      textShadowColor: colors.primary200,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    playButton: {
      padding: 8, // p-2
    },
  });

  return (
    <>
      <Pressable onPress={handleModal}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: songPlaying.thumbnail }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {songPlaying.title}
            </Text>
            <Text numberOfLines={1} style={styles.artist}>
              {songPlaying.channelTitle}
            </Text>
          </View>

          <Pressable onPress={handlePause} style={styles.playButton}>
            <Icon
              name={paused ? 'play' : 'pause'}
              size={24}
              color={colors.primary600}
            />
          </Pressable>
        </View>
      </Pressable>

      <ModalSongPlaying visible={modalVisible} onHide={handleModal} />
    </>
  );
}
