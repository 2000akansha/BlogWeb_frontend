import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    if (window.google && window.google.translate) {
      window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    }
  }, []);

  return (

    <div>
      <div id="google_translate_element"></div>
    </div>
  );
}

export default GoogleTranslate;