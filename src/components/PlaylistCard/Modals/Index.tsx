import { useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import MainPlaylist from './MainPlaylist';
import { Playlist } from '../../../../types/Song';
import EditPlaylist from './EditPlaylist';

interface IndexProps {
  playlist: Playlist;
  visible: boolean;
  onHide: () => void;
}

type ModalType = 'main' | 'edit' | null;

export default function Index({ playlist, visible, onHide }: IndexProps) {
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

  const handleOpenNameModal = () => {
    setActiveModal('edit');
  };

  const handleCloseNameModal = () => {
    setActiveModal('main');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleExit}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <MainPlaylist
          playlist={playlist}
          visible={activeModal === 'main'}
          onHide={handleExit}
          openNameModal={handleOpenNameModal}
        />

        <EditPlaylist
          playlist={playlist}
          visible={activeModal === 'edit'}
          onHide={handleCloseNameModal}
        />
      </View>
    </Modal>
  );
}
