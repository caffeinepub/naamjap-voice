export interface MantraInfo {
  name: string;
  description: string;
  language: string;
}

export const MANTRAS: MantraInfo[] = [
  {
    name: 'Radhe Radhe',
    description: 'Devotional greeting to Radha and Krishna',
    language: 'Hindi',
  },
  {
    name: 'Om Namah Shivaya',
    description: 'Salutation to Lord Shiva',
    language: 'Sanskrit',
  },
  {
    name: 'Hare Krishna',
    description: 'Maha Mantra for Krishna consciousness',
    language: 'Sanskrit',
  },
  {
    name: 'Om Mani Padme Hum',
    description: 'Buddhist mantra of compassion',
    language: 'Sanskrit',
  },
  {
    name: 'Gayatri Mantra',
    description: 'Vedic mantra for enlightenment',
    language: 'Sanskrit',
  },
];
