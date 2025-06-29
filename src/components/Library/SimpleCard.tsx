import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../contexts/theme';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SimpleCardProps {
  text: string;
  icon: string;
  onPress: () => void;
}

export default function SimpleCard({ text, icon, onPress }: SimpleCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: colors.primary100,
            borderColor: colors.primary300,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconWrapper,
              {
                borderColor: colors.primary200,
                backgroundColor: colors.primary200,
              },
            ]}
          >
            <Icon name={icon} size={32} color={colors.primary600} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.text,
              {
                color: colors.primary800,
                textShadowColor: colors.primary200,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              },
            ]}
          >
            {text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    minHeight: 76,
  },
  iconContainer: {
    width: '30%',
    maxWidth: 60,
    height: 60,
  },
  iconWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginStart: 16,
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});
