const saveLanguageToStorage = (lang) => {
  localStorage.setItem('lang', lang);
};

export const switchLanguage = ({ i18n }) => {
  if (i18n.language === 'en') {
    i18n.changeLanguage('pl');
    saveLanguageToStorage('pl');
  } else {
    i18n.changeLanguage('en');
    saveLanguageToStorage('en');
  }
};
