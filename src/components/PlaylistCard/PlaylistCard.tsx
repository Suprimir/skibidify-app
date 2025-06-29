import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../contexts/theme';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Playlist } from '../../../types/Song';
import { useState } from 'react';
import Index from './Modals/Index';

interface PlaylistCardProps {
  playlist: Playlist;
  icon: string;
  onPress: () => void;
}

export default function PlaylistCard({
  playlist,
  icon,
  onPress,
}: PlaylistCardProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const showContextMenu = () => {
    setModalVisible(true);
  };

  const hideContextMenu = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
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
          <View style={styles.imageContainer}>
            <View
              style={[
                styles.imageWrapper,
                {
                  borderColor: colors.primary200,
                  backgroundColor: colors.primary200,
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
                <Icon name={icon} size={32} color={colors.primary600} />
              )}
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
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
          </View>
        </View>
      </TouchableOpacity>

      <Index
        playlist={playlist}
        visible={modalVisible}
        onHide={hideContextMenu}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 12, // rounded-xl
    borderWidth: 1, // border
    padding: 8, // p-2
    minHeight: 76, // 60px del icono + 16px de padding
  },
  imageContainer: {
    width: '30%',
    maxWidth: 60,
    height: 60,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
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
  textContainer: {
    marginStart: 16, // ms-4
    flex: 1, // flex-1
    justifyContent: 'center', // justify-center
  },
  playlistName: {
    fontSize: 18, // text-lg
    fontWeight: 'bold', // font-bold
    lineHeight: 20, // leading-tight
  },
});
