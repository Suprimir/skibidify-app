import { useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import { Song } from 'types/Song';
import ModalSongCard from './ModalSongCard';
import PlaylistSelection from './PlaylistSelection';

interface IndexProps {
  song: Song;
  visible: boolean;
  onHide: () => void;
}

type ModalType = 'main' | 'playlists' | null;

export default function Index({ song, visible, onHide }: IndexProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    if (visible) {
      setActiveModal('main');
    } else {
      setActiveModal(null);
    }
  }, [visible]);

  const handleExit = () => {
    setActiveModal(null);
    onHide();
  };

  const handleOpenSelectionModal = () => {
    setActiveModal('playlists');
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleExit}>
      <View className="flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <ModalSongCard
          song={song}
          visible={activeModal === 'main'}
          onHide={handleExit}
          handleOpenSelectionModal={handleOpenSelectionModal}
        />

        <PlaylistSelection song={song} visible={activeModal === 'playlists'} onHide={handleExit} />
      </View>
    </Modal>
  );
}
