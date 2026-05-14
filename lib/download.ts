import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

function safeFilename(input: string): string {
  return (
    input
      .replace(/[^a-z0-9._-]+/gi, '_')
      .replace(/_+/g, '_')
      .slice(0, 80) || 'download'
  );
}

export async function downloadAndShare(url: string, filename: string) {
  if (Platform.OS === 'web') {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const dest = FileSystem.documentDirectory + safeFilename(filename);
  const { uri } = await FileSystem.downloadAsync(url, dest);

  const can = await Sharing.isAvailableAsync();
  if (can) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
  }
}
