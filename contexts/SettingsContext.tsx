import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  ttsEnabled: boolean;
  ttsRate: number;
  ttsPitch: number;
  ttsVoice: string;
  hapticEnabled: boolean;
  autoSpeak: boolean;
  language: 'ar' | 'en';
  soundEffects: boolean;
}

const defaultSettings: Settings = {
  theme: 'auto',
  highContrast: false,
  fontSize: 'medium',
  ttsEnabled: true,
  ttsRate: 0.9,
  ttsPitch: 1.0,
  ttsVoice: 'default',
  hapticEnabled: true,
  autoSpeak: true,
  language: 'ar',
  soundEffects: true,
};

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  resetSettings: () => Promise<void>;
  effectiveTheme: 'light' | 'dark';
  fontScale: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useColorScheme();

  // Load settings from storage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('ayeen_settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem('ayeen_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    try {
      await AsyncStorage.setItem('ayeen_settings', JSON.stringify(defaultSettings));
    } catch (error) {
      console.log('Error resetting settings:', error);
    }
  };

  // Calculate effective theme
  const effectiveTheme: 'light' | 'dark' = 
    settings.theme === 'auto' 
      ? (systemColorScheme || 'light')
      : settings.theme;

  // Calculate font scale
  const fontScale = settings.fontSize === 'small' ? 0.9 :
                   settings.fontSize === 'medium' ? 1.0 :
                   settings.fontSize === 'large' ? 1.2 : 1.4;

  const value: SettingsContextType = {
    settings,
    updateSetting,
    resetSettings,
    effectiveTheme,
    fontScale,
  };

  if (isLoading) {
    return null; // or a loading component
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
