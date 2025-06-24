import React, { useState, useRef } from 'react';
import type { Song } from '../types/Song';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  Pressable,
} from 'react-native';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { usePlayer } from 'contexts/player';
import { useSongs } from 'contexts/song';
import Feather from '@expo/vector-icons/Feather';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SongCardProps {
  song: Song;
  onDelete?: (song: Song) => void;
}

export default function SongCard({ song, onDelete }: SongCardProps) {
  const { colors } = useTheme();
  const { handlePlay } = usePlayer();
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const { deleteSong } = useSongs();

  const showContextMenu = () => {
    setModalVisible(true);
    slideAnim.setValue(SCREEN_HEIGHT);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 20,
    }).start();
  };

  const hideContextMenu = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleDeleteSong = () => {
    hideContextMenu();

    setTimeout(() => {
      Alert.alert('Delete song', `Are you sure to delete "${song.title}"?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSong(song.id),
        },
      ]);
    }, 300);
  };

  const handleAddToPlaylist = () => {
    console.log('Add to playlist:', song.title);
    hideContextMenu();
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
        delayLongPress={500}>
        <View
          className="group w-full cursor-pointer flex-row rounded-xl border p-3"
          style={{
            backgroundColor: colors.primary100,
            borderColor: colors.primary200,
          }}>
          <View
            className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border"
            style={{ borderColor: colors.primary200 }}>
            <Image
              src={song.thumbnail}
              alt={`${song.title} thumbnail`}
              className="h-28 w-28 rounded-xl object-cover object-center"
            />
          </View>

          <View className="ms-4 flex-1 justify-center">
            <Text
              className="truncate text-sm font-bold leading-tight"
              style={{ color: colors.primary800 }}>
              {song.title}
            </Text>
            <Text
              className="mt-0.5 truncate text-xs font-medium"
              style={{ color: colors.primary600 }}>
              {song.channelTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideContextMenu}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
          onStartShouldSetResponder={() => true}
          onResponderRelease={hideContextMenu}>
          <Animated.View
            style={{
              backgroundColor: colors.primary50,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 34,
              minHeight: 200,
              transform: [{ translateY: slideAnim }],
              borderTopWidth: 2,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: colors.primary200,
            }}
            onStartShouldSetResponder={() => true}
            onResponderRelease={() => false}>
            {/* Handle */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: colors.primary300,
                borderRadius: 2,
                alignSelf: 'center',
                marginTop: 12,
                marginBottom: 20,
              }}
              onStartShouldSetResponder={() => true}
              onResponderRelease={hideContextMenu}
            />

            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                borderBottomWidth: 1,
                borderBottomColor: colors.primary200,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: colors.primary200,
                  marginRight: 12,
                }}>
                <Image
                  src={song.thumbnail}
                  alt={`${song.title} thumbnail`}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.primary800,
                    marginBottom: 4,
                  }}
                  numberOfLines={1}>
                  {song.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.primary600,
                  }}
                  numberOfLines={1}>
                  {song.channelTitle}
                </Text>
              </View>
            </View>

            <View style={{ paddingTop: 20 }}>
              <View
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                }}
                onStartShouldSetResponder={() => true}
                onResponderRelease={handleDeleteSong}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#dc3545',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  Delete Song
                </Text>
              </View>

              <View
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                onStartShouldSetResponder={() => true}
                onResponderRelease={handleAddToPlaylist}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.primary600,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  Add to a Playlist
                </Text>
                <Feather name="arrow-right" size={24} color={colors.primary600} />
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
