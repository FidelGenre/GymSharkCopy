import React, { useState, useEffect } from 'react';
import styles from './AnnouncementBar.module.css';

const AnnouncementBar: React.FC = () => {
  const messages: string[] = [
    "Ya disponible en Argentina",
    "Descuentos de verano ☀️"
  ];
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    // CAMBIO: 1500ms = 1.5 segundos
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className={styles.announcementBar}>
      <span 
        key={currentIndex} 
        className={styles.announcementBarText}
      >
        {messages[currentIndex]}
      </span>
    </div>
  );
};

export default AnnouncementBar;