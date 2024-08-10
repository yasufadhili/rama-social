import React, { useState } from 'react';
import { View, Modal, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';
import { RamaText } from '@/components/Themed';

const screenWidth = Dimensions.get("window").width;

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => setLoading(false);

  return (
    <Modal statusBarTranslucent visible={true} transparent={true}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="close" color="#000" size={16} />
        </TouchableOpacity>
        <PagerView
          style={styles.pagerView}
          initialPage={initialIndex}
          onPageSelected={(e) => {
            setCurrentIndex(e.nativeEvent.position);
            setLoading(true);
          }}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              {loading && <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#ffffff" /></View>}
              <Image
                source={{ uri: image }}
                style={styles.image}
                contentFit="contain"
                onLoad={handleImageLoad}
              />
            </View>
          ))}
        </PagerView>
        <RamaText style={styles.pageIndicator}>{`${currentIndex + 1} / ${images.length}`}</RamaText>
        <View style={styles.modalIndicatorContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.modalIndicator, { backgroundColor: index === currentIndex ? "#fff" : "#ccc" }]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "flex-start",
  },
  pagerView: {
    flex: 1,
    width: screenWidth,
  },
  imageContainer: {
    flex: 1,
  },
  loaderContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  pageIndicator: {
    position: "absolute",
    bottom: 40,
    color: "white",
    fontSize: 16,
  },
  modalIndicatorContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

export default ImageViewer;
