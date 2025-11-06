# 🌍 Localization System Guide

## Overview

SKILL-UP now has a **dynamic localization system** that changes greetings and text based on the user's selected language/nationality!

## Supported Languages

| Language | Code | Greeting | Flag |
|----------|------|----------|------|
| **English (Philippines)** | `en-PH` | Kamusta | 🇵🇭 |
| **Filipino (Pilipinas)** | `fil-PH` | Kumusta | 🇵🇭 |
| **English (United States)** | `en-US` | Hello | 🇺🇸 |

## How It Works

### 1. **Changing Language**

Users can change their language preference in **Settings** → **Preferences** → **Language**

- Click on the Language option
- A modal appears with all available languages
- Select your preferred language
- The greeting and navigation text change immediately!
- The preference is saved to localStorage and persists across sessions

### 2. **What Changes Based on Language**

#### Welcome Screen
- **Greeting**: Changes between "Kumusta", "Kamusta", or "Hello"
- **Welcome message**: Adapts to the selected language
- **"Continue as Guest"**: Translated appropriately

#### Dashboard Screen
- **Personal greeting**: "Kamusta, Maria!" vs "Hello, Maria!" vs "Kumusta, Maria!"
- **"Ready to learn..."**: Changes based on locale
- **Navigation labels**: Home, Learn, Community, Profile
- **Section headers**: Quick Access, Continue Learning

#### Login Screen
- **"Welcome Back"**: Translated to "Mabuting Pagbabalik" in Filipino

#### Bottom Navigation
- All tabs (Home, Learn, Community, Profile) are localized

## Technical Details

### File Structure

```
/utils/locales.ts          # Localization strings and utilities
/components/LanguageSelector.tsx   # Language selection modal
```

### Adding New Languages

Edit `/utils/locales.ts`:

```typescript
const localeData: Record<Locale, LocaleStrings> = {
  'en-PH': {
    hello: 'Kamusta',
    welcome: 'Welcome',
    // ...
  },
  'fil-PH': {
    hello: 'Kumusta',
    welcome: 'Maligayang Pagdating',
    // ...
  },
  // Add new language here
  'new-LANG': {
    hello: 'Your greeting',
    welcome: 'Your welcome text',
    // ...
  },
};
```

### Adding New Translatable Strings

1. Add to `LocaleStrings` interface in `/utils/locales.ts`:
```typescript
export interface LocaleStrings {
  // ... existing strings
  newString: string;
}
```

2. Add translations for all locales in `localeData`:
```typescript
'en-PH': {
  // ... existing translations
  newString: 'English text',
},
'fil-PH': {
  // ... existing translations
  newString: 'Filipino text',
},
```

3. Use in components:
```tsx
const t = getLocaleStrings(locale);
<p>{t.newString}</p>
```

## How Locale is Stored

- **Location**: `localStorage` with key `'skillup_locale'`
- **Default**: `'en-PH'` (English Philippines)
- **Persistence**: Saved automatically when changed, loaded on app start

## Example: Dynamic Greeting

```tsx
// In DashboardScreen.tsx
const t = getLocaleStrings(locale);

// This will show:
// "Kamusta, Maria!" for en-PH
// "Kumusta, Maria!" for fil-PH  
// "Hello, Maria!" for en-US
<h1>{t.hello}, Maria! 👋</h1>
```

## Current Localized Screens

✅ **WelcomeScreen** - Greetings and CTA buttons
✅ **LoginScreen** - Welcome back message
✅ **SignupScreen** - Ready for localization
✅ **DashboardScreen** - Full navigation and greetings
✅ **SettingsScreen** - Language selector

## Future Expansion

You can easily extend this system to:
- Add more Filipino dialects (Cebuano, Ilocano, etc.)
- Add more English variants (UK, Australia, etc.)
- Add other Southeast Asian languages
- Localize entire module content
- Localize admin dashboard
- Add date/time formatting per locale
- Add currency formatting

## Testing

1. Go to **Settings** (from Profile screen)
2. Click **Language** under Preferences
3. Select different languages
4. Navigate to Dashboard and Welcome screen
5. Observe how greetings change!

**Examples:**
- **Filipino**: "Kumusta, Maria! Handa ka na bang matuto ngayong araw?"
- **English (PH)**: "Kamusta, Maria! Ready to learn something amazing today?"
- **English (US)**: "Hello, Maria! Ready to learn something new today?"

## Benefits

✨ **Inclusive** - Users can choose their preferred language
✨ **Cultural** - Maintains Filipino identity with local greetings
✨ **Flexible** - Easy to add more languages
✨ **Persistent** - Settings saved across sessions
✨ **Professional** - Shows attention to user preferences
