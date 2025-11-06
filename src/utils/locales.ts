// Localization utilities for SKILL-UP

export type Locale = 'en-PH' | 'fil-PH' | 'en-US';

export interface LocaleStrings {
  // Greetings
  hello: string;
  welcome: string;
  welcomeBack: string;
  goodMorning: string;
  
  // Common phrases
  continueAsGuest: string;
  getStarted: string;
  learnMore: string;
  
  // Dashboard
  readyToLearn: string;
  quickAccess: string;
  continueLearning: string;
  
  // Navigation
  home: string;
  learn: string;
  community: string;
  profile: string;
}

const localeData: Record<Locale, LocaleStrings> = {
  'en-PH': {
    hello: 'Kamusta',
    welcome: 'Welcome',
    welcomeBack: 'Welcome Back',
    goodMorning: 'Good morning',
    continueAsGuest: '👀 Explore as Guest',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    readyToLearn: 'Ready to learn something amazing today?',
    quickAccess: 'Quick Access',
    continueLearning: 'Continue Learning',
    home: 'Home',
    learn: 'Learn',
    community: 'Community',
    profile: 'Profile',
  },
  'fil-PH': {
    hello: 'Kumusta',
    welcome: 'Maligayang Pagdating',
    welcomeBack: 'Mabuting Pagbabalik',
    goodMorning: 'Magandang umaga',
    continueAsGuest: '👀 Tuklasin Bilang Bisita',
    getStarted: 'Magsimula',
    learnMore: 'Matuto Pa',
    readyToLearn: 'Handa ka na bang matuto ngayong araw?',
    quickAccess: 'Mabilis na Access',
    continueLearning: 'Magpatuloy sa Pag-aaral',
    home: 'Home',
    learn: 'Matuto',
    community: 'Komunidad',
    profile: 'Profile',
  },
  'en-US': {
    hello: 'Hello',
    welcome: 'Welcome',
    welcomeBack: 'Welcome Back',
    goodMorning: 'Good morning',
    continueAsGuest: '👀 Explore as Guest',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    readyToLearn: 'Ready to learn something new today?',
    quickAccess: 'Quick Access',
    continueLearning: 'Continue Learning',
    home: 'Home',
    learn: 'Learn',
    community: 'Community',
    profile: 'Profile',
  },
};

export const getLocaleStrings = (locale: Locale): LocaleStrings => {
  return localeData[locale] || localeData['en-PH'];
};

export const getLocaleName = (locale: Locale): string => {
  const names: Record<Locale, string> = {
    'en-PH': 'English (Philippines)',
    'fil-PH': 'Filipino (Pilipinas)',
    'en-US': 'English (United States)',
  };
  return names[locale] || names['en-PH'];
};

export const getLocaleFlag = (locale: Locale): string => {
  const flags: Record<Locale, string> = {
    'en-PH': '🇵🇭',
    'fil-PH': '🇵🇭',
    'en-US': '🇺🇸',
  };
  return flags[locale] || flags['en-PH'];
};

// Storage helpers
export const LOCALE_STORAGE_KEY = 'skillup_locale';

export const saveLocale = (locale: Locale): void => {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
};

export const loadLocale = (): Locale => {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  return (saved as Locale) || 'en-PH';
};
