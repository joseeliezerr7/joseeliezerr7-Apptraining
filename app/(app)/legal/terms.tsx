import { useTranslation } from 'react-i18next';
import { LegalDocument } from '@/components/LegalDocument';

export default function TermsScreen() {
  const { t } = useTranslation();
  const sections = t('legal.terms.sections', { returnObjects: true }) as Array<{
    heading: string;
    body: string;
  }>;
  return (
    <LegalDocument
      title={t('legal.terms.title')}
      updatedAt={t('legal.updatedAt')}
      sections={sections}
    />
  );
}
