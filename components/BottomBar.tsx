import Feather from '@expo/vector-icons/Feather';
import { Link, usePathname } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../contexts/theme';

export default function BottomBar() {
  const { colors } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/download', icon: 'download', label: 'Download' },
    { href: '/library', icon: 'book', label: 'Library' },
    { href: '/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <View
      className="flex-row justify-between border-t px-4 pb-8 pt-2"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
      }}>
      {navItems.map(({ href, icon, label }) => {
        const isActive = pathname === href;

        return (
          <Link key={href} asChild href={href}>
            <Pressable
              className="flex items-center rounded-full px-5 py-1"
              style={{
                backgroundColor: isActive ? colors.primary100 : colors.background,
              }}>
              <Feather name={icon as any} size={24} color={colors.primary700} />
              <Text
                style={{
                  color: colors.primary700,
                }}>
                {label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}
