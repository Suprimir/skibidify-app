import { useEffect, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import GetLink from './GetLink';
import SingleSong from './SingleSong';
import MultipleSongs from './MultipleSongs';

interface IndexProps {
  visible: boolean;
  onHide: () => void;
}

type ModalType = 'main' | 'single' | 'multiple' | null;

export default function Index({ visible, onHide }: IndexProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [id, setId] = useState('');

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

  const handleSearch = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    const videoId = match ? match[1] : null;

    const listMatch = url.match(/[?&]list=([^&]+)/);
    const playlistId = listMatch ? listMatch[1] : null;

    if (videoId) {
      setId(videoId);
      setActiveModal('single');
    } else if (playlistId) {
      setId(playlistId);
      setActiveModal('multiple');
    } else {
      console.log('URL No existe');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleExit}
    >
      <View style={[styles.container, styles.overlay]}>
        <GetLink
          visible={activeModal === 'main'}
          onHide={handleExit}
          handleSearch={handleSearch}
        />

        <SingleSong
          videoId={id}
          visible={activeModal === 'single'}
          onHide={handleExit}
        />

        <MultipleSongs
          playlistId={id}
          visible={activeModal === 'multiple'}
          onHide={handleExit}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
