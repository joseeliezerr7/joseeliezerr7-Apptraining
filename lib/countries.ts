export type Country = { code: string; name_en: string; name_es: string; flag: string };

export const COUNTRIES: Country[] = [
  { code: 'AR', name_en: 'Argentina', name_es: 'Argentina', flag: '🇦🇷' },
  { code: 'BO', name_en: 'Bolivia', name_es: 'Bolivia', flag: '🇧🇴' },
  { code: 'BR', name_en: 'Brazil', name_es: 'Brasil', flag: '🇧🇷' },
  { code: 'CA', name_en: 'Canada', name_es: 'Canadá', flag: '🇨🇦' },
  { code: 'CL', name_en: 'Chile', name_es: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name_en: 'Colombia', name_es: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name_en: 'Costa Rica', name_es: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', name_en: 'Cuba', name_es: 'Cuba', flag: '🇨🇺' },
  { code: 'DO', name_en: 'Dominican Republic', name_es: 'República Dominicana', flag: '🇩🇴' },
  { code: 'EC', name_en: 'Ecuador', name_es: 'Ecuador', flag: '🇪🇨' },
  { code: 'SV', name_en: 'El Salvador', name_es: 'El Salvador', flag: '🇸🇻' },
  { code: 'ES', name_en: 'Spain', name_es: 'España', flag: '🇪🇸' },
  { code: 'US', name_en: 'United States', name_es: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'GT', name_en: 'Guatemala', name_es: 'Guatemala', flag: '🇬🇹' },
  { code: 'HN', name_en: 'Honduras', name_es: 'Honduras', flag: '🇭🇳' },
  { code: 'MX', name_en: 'Mexico', name_es: 'México', flag: '🇲🇽' },
  { code: 'NI', name_en: 'Nicaragua', name_es: 'Nicaragua', flag: '🇳🇮' },
  { code: 'PA', name_en: 'Panama', name_es: 'Panamá', flag: '🇵🇦' },
  { code: 'PY', name_en: 'Paraguay', name_es: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', name_en: 'Peru', name_es: 'Perú', flag: '🇵🇪' },
  { code: 'PR', name_en: 'Puerto Rico', name_es: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'UY', name_en: 'Uruguay', name_es: 'Uruguay', flag: '🇺🇾' },
  { code: 'VE', name_en: 'Venezuela', name_es: 'Venezuela', flag: '🇻🇪' },
  { code: 'FR', name_en: 'France', name_es: 'Francia', flag: '🇫🇷' },
  { code: 'DE', name_en: 'Germany', name_es: 'Alemania', flag: '🇩🇪' },
  { code: 'IT', name_en: 'Italy', name_es: 'Italia', flag: '🇮🇹' },
  { code: 'PT', name_en: 'Portugal', name_es: 'Portugal', flag: '🇵🇹' },
  { code: 'GB', name_en: 'United Kingdom', name_es: 'Reino Unido', flag: '🇬🇧' },
  { code: 'AU', name_en: 'Australia', name_es: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name_en: 'Japan', name_es: 'Japón', flag: '🇯🇵' },
];

export function findCountry(nameOrCode: string): Country | undefined {
  const v = nameOrCode.trim().toLowerCase();
  return COUNTRIES.find(
    (c) =>
      c.code.toLowerCase() === v ||
      c.name_en.toLowerCase() === v ||
      c.name_es.toLowerCase() === v
  );
}
