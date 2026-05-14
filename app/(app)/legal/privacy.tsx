import { useTranslation } from 'react-i18next';
import { LegalDocument } from '@/components/LegalDocument';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const sections = t('legal.privacy.sections', { returnObjects: true }) as Array<{
    heading: string;
    body: string;
  }>;
  return (
    <LegalDocument
      title={t('legal.privacy.title')}
      updatedAt={t('legal.updatedAt')}
      sections={sections}
    />
  );
}
