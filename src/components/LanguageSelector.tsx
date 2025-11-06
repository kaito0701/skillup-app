import { Check, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { getLocaleName, getLocaleFlag, type Locale } from "../utils/locales";

interface LanguageSelectorProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const availableLocales: Locale[] = ['en-PH', 'fil-PH', 'en-US'];

export function LanguageSelector({ currentLocale, onLocaleChange }: LanguageSelectorProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              {getLocaleFlag(currentLocale)}
            </div>
            <div>
              <p className="text-gray-900">Language</p>
              <p className="text-gray-500 text-sm">{getLocaleName(currentLocale)}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Choose Language</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {availableLocales.map((locale) => (
            <button
              key={locale}
              onClick={() => onLocaleChange(locale)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                currentLocale === locale
                  ? 'bg-indigo-50 border-2 border-indigo-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getLocaleFlag(locale)}</span>
                <div className="text-left">
                  <p className={`${currentLocale === locale ? 'text-indigo-900' : 'text-gray-900'}`}>
                    {getLocaleName(locale)}
                  </p>
                </div>
              </div>
              {currentLocale === locale && (
                <Check className="w-5 h-5 text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
