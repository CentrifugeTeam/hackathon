import { useEffect, useState } from 'react';
import styles from './CookieConsentBanner.module.scss';

export const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Функция для установки cookie
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  };

  // Проверка наличия согласия
  const checkCookieConsent = () => {
    if (document.cookie.split('; ').find(row => row.startsWith('cookieConsent='))) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    checkCookieConsent();
  }, []);

  const handleAccept = () => {
    setCookie('cookieConsent', 'accepted', 365); // Срок действия - 1 год
    setIsVisible(false); // Закрыть баннер
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <h4>Мы используем <span className={styles.cookieFile}>файлы сookie</span>, чтобы улучить сайт для вас</h4>
      <button onClick={handleAccept}>Согласен</button>
    </div>
  );
};
