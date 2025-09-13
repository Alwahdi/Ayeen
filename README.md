# 👁️ عين (Ayeen) - Voice Assistant for Visually Impaired Users

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Accessibility](https://img.shields.io/badge/Accessibility-A11Y-green?style=for-the-badge)](https://www.w3.org/WAI/)

## 🌟 Overview

**عين (Ayeen)** is a professional, accessibility-first voice assistant application designed specifically for visually impaired and blind users. The app provides high-quality Arabic speech recognition and text-to-speech capabilities with comprehensive customization options.

## ✨ Key Features

### 🎤 **Advanced Speech Recognition**
- **High-Quality Arabic Speech Recognition** using `@react-native-voice/voice`
- **Web Speech Recognition** support for browser compatibility
- **Real-time Transcription** with instant feedback
- **Multi-platform Support** (iOS, Android, Web)

### 🔊 **Premium Text-to-Speech**
- **Human-like Voice Quality** with customizable parameters
- **Arabic Language Support** with proper pronunciation
- **Adjustable Speech Rate** (50% - 130%)
- **Pitch Control** (50% - 150%)
- **Voice Selection** for different preferences

### ♿ **Comprehensive Accessibility**
- **Full Screen Reader Support** (VoiceOver, TalkBack)
- **High Contrast Mode** for better visibility
- **Font Size Scaling** (Small, Medium, Large, Extra Large)
- **Haptic Feedback** for touch interactions
- **Audio Announcements** for all actions
- **RTL (Right-to-Left) Support** for Arabic text

### 🎨 **Professional UI/UX**
- **Modern Material Design** with beautiful animations
- **Dark/Light Theme** with automatic switching
- **Responsive Layout** for all screen sizes
- **Smooth Animations** and micro-interactions
- **Professional Color Scheme** with accessibility compliance

### ⚙️ **Advanced Settings**
- **Theme Selection** (Light, Dark, Auto)
- **Voice Customization** (Rate, Pitch, Language)
- **Accessibility Options** (High Contrast, Font Size)
- **Interaction Preferences** (Haptics, Sound Effects)
- **Auto-Speak Settings** for hands-free operation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ayeen.git
   cd ayeen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on different platforms**
   ```bash
   # Web
   npm run web

   # iOS
   npm run ios

   # Android
   npm run android
   ```

## 📱 Usage

### Basic Usage
1. **Launch the app** and allow microphone permissions
2. **Tap the microphone button** to start speech recognition
3. **Speak in Arabic** and see real-time transcription
4. **Use the play button** to hear the transcribed text
5. **Access settings** via the gear icon for customization

### Accessibility Features
- **VoiceOver/TalkBack**: The app is fully compatible with screen readers
- **High Contrast**: Enable in settings for better visibility
- **Large Text**: Adjust font size in accessibility settings
- **Audio Feedback**: All interactions provide audio confirmation

### Settings Customization
1. **Open Settings** from the main screen or header
2. **Theme**: Choose between Light, Dark, or Auto themes
3. **Accessibility**: Adjust font size and high contrast
4. **Voice**: Customize speech rate, pitch, and language
5. **Interaction**: Enable/disable haptics and sound effects

## 🏗️ Architecture

### Project Structure
```
ayeen/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Main voice recognition screen
│   └── settings.tsx       # Comprehensive settings screen
├── components/            # Reusable UI components
│   ├── AppButton.tsx      # Custom button component
│   ├── AppMicButton.tsx   # Specialized microphone button
│   ├── AppText.tsx        # Accessible text component
│   └── useSpeechToText.ts # Speech recognition hook
├── theme/                 # Design system and theming
│   ├── colors.ts          # Color palette
│   ├── typography.ts      # Font definitions
│   ├── spacing.ts         # Spacing system
│   ├── haptics.ts         # Haptic feedback utilities
│   └── ThemeProvider.tsx  # Theme context provider
└── assets/               # Images, fonts, and other assets
```

### Key Technologies
- **Expo Router** for navigation
- **React Native Voice** for speech recognition
- **Expo Speech** for text-to-speech
- **Expo Audio** for audio permissions
- **Material Community Icons** for UI icons
- **TypeScript** for type safety

## 🔧 Configuration

### Environment Setup
1. **Development Build**: For full native features, create a development build
2. **Expo Go**: For quick testing with limited features
3. **Web**: Full functionality in supported browsers

### Platform-Specific Notes
- **iOS**: Requires microphone permissions in Info.plist
- **Android**: Requires RECORD_AUDIO permission
- **Web**: Uses Web Speech Recognition API (Chrome/Safari)

## 🎯 Accessibility Compliance

### WCAG 2.1 AA Standards
- ✅ **Color Contrast**: All text meets 4.5:1 ratio minimum
- ✅ **Keyboard Navigation**: Full keyboard accessibility
- ✅ **Screen Reader**: Complete VoiceOver/TalkBack support
- ✅ **Focus Management**: Clear focus indicators
- ✅ **Alternative Text**: All images have descriptive alt text

### Assistive Technology Support
- **VoiceOver** (iOS)
- **TalkBack** (Android)
- **NVDA** (Windows)
- **JAWS** (Windows)
- **Orca** (Linux)

## 🧪 Testing

### Manual Testing
1. **Speech Recognition**: Test with various Arabic accents
2. **Text-to-Speech**: Verify voice quality and pronunciation
3. **Accessibility**: Test with screen readers enabled
4. **Theme Switching**: Verify all themes work correctly
5. **Settings Persistence**: Ensure settings are saved properly

### Automated Testing
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (when implemented)
npm test
```

## 📦 Building for Production

### Development Build
```bash
# Create development build
npx expo install expo-dev-client
npx expo run:ios
npx expo run:android
```

### Production Build
```bash
# Build for production
eas build --platform all
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance
- Test with screen readers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Arabic Language Support**: Special thanks to Arabic language experts
- **Accessibility Community**: For feedback and testing
- **Open Source Libraries**: Expo, React Native, and all contributors
- **Voice Technology**: React Native Voice and Web Speech APIs

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainers for urgent issues

### Reporting Bugs
When reporting bugs, please include:
- Device information (OS, version)
- App version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or screen recordings (if applicable)

## 🔮 Roadmap

### Upcoming Features
- [ ] **Multi-language Support** (English, French, etc.)
- [ ] **Voice Commands** for app navigation
- [ ] **Offline Mode** for basic functionality
- [ ] **Voice Profiles** for different users
- [ ] **Integration APIs** for external services
- [ ] **Advanced Analytics** for usage insights

### Version History
- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added comprehensive settings and accessibility features
- **v1.2.0**: Enhanced UI/UX and professional design
- **v2.0.0**: Planned multi-language support and advanced features

---

**عين (Ayeen)** - Empowering visually impaired users through accessible voice technology.

Made with ❤️ for the accessibility community.