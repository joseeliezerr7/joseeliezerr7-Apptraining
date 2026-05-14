import { Platform, Share } from 'react-native';
import * as Linking from 'expo-linking';

export async function shareItem(opts: {
  title: string;
  message?: string;
  path: string; // e.g. "/videos/play/v-1"
}): Promise<void> {
  const url = Linking.createURL(opts.path);
  const message = opts.message
    ? `${opts.message}\n\n${url}`
    : `${opts.title}\n${url}`;

  if (Platform.OS === 'web') {
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === 'function') {
      await nav.share({ title: opts.title, text: opts.message, url }).catch(() => {});
      return;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
    return;
  }

  await Share.share({ title: opts.title, message });
}
