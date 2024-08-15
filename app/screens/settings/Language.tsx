import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import "@/i18n";
import { TLanguage } from '@/types/Language';
import { useLanguage } from '@/context/LanguageContext';


const LanguageSelector: React.FC = () => {
  const { setLanguage } = useLanguage();

  const changeLanguage = (newLang: TLanguage) => {
    setLanguage(newLang);
  };

  return (
    <View>
      <Button title="English" onPress={() => changeLanguage('en')} />
      <Button title="Español" onPress={() => changeLanguage('sw')} />
    </View>
  );
};

const MainContent: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('welcome')}</Text>
      <Text style={styles.text}>{t('changeLang')}</Text>
      <Text style={styles.text}>Current Language: {language}</Text>
      <LanguageSelector />
    </View>
  );
};

export default function Index() {
  return (
      <MainContent />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});