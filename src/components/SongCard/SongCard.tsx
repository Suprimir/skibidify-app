import { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Song } from '../../../types/Song';
import { useTheme } from '../../../contexts/theme';
import { usePlayer } from '../../../contexts/player';
import Index from './Modals/Index';

interface SongCardProps {
  song: Song;
  onDelete?: (song: Song) => void;
}

export default function SongCard({ song }: SongCardProps) {
  const { colors } = useTheme();
  const { handlePlay } = usePlayer();
  const [modalVisible, setModalVisible] = useState(false);

  const showContextMenu = () => {
    setModalVisible(true);
  };

  const hideContextMenu = () => {
    setModalVisible(false);
  };

  const handleRegularPress = () => {
    handlePlay(song);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleRegularPress}
        onLongPress={showContextMenu}
        delayLongPress={500}
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
          <View style={styles.thumbnailContainer}>
            <View
              style={[
                styles.thumbnailWrapper,
                {
                  borderColor: colors.primary200,
                },
              ]}
            >
              <Image
                source={{ uri: song.thumbnail }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.titleText,
                {
                  color: colors.primary800,
                  textShadowColor: colors.primary200,
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                },
              ]}
            >
              {song.title}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.channelText,
                {
                  color: colors.primary600,
                  textShadowColor: colors.primary200,
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                },
              ]}
            >
              {song.channelTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Index song={song} visible={modalVisible} onHide={hideContextMenu} />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    minHeight: 76, // 60px del icono + 16px de padding
  },
  thumbnailContainer: {
    width: '30%',
    maxWidth: 60,
    height: 60,
  },
  thumbnailWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailImage: {
    width: '135%',
    height: '135%',
  },
  textContainer: {
    marginStart: 16, // ms-4
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14, // text-sm
    fontWeight: 'bold',
    lineHeight: 16, // leading-tight
  },
  channelText: {
    marginTop: 2, // mt-0.5
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
  },
});
