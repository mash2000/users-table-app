import React from 'react';
import styles from './Modal.module.css';

const UserModal = ({ user, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Информация о пользователе</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.userInfo}>
            {user.image && (
              <img 
                src={user.image} 
                alt={`${user.firstName} ${user.lastName}`}
                className={styles.avatar}
              />
            )}
            <div className={styles.userDetails}>
              <div className={styles.userName}>
                {user.lastName} {user.firstName} {user.maidenName}
              </div>
              <div className={styles.userAge}>Возраст: {user.age} лет</div>
              <div className={styles.userGender}>Пол: {user.genderDisplay}</div>
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Телефон</span>
              <span className={styles.infoValue}>{user.phone}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Рост</span>
              <span className={styles.infoValue}>{user.height} см</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Вес</span>
              <span className={styles.infoValue}>{user.weight} кг</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Страна</span>
              <span className={styles.infoValue}>{user.address?.country || '-'}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Город</span>
              <span className={styles.infoValue}>{user.address?.city || '-'}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Улица</span>
              <span className={styles.infoValue}>{user.address?.address || '-'}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Почтовый индекс</span>
              <span className={styles.infoValue}>{user.address?.postalCode || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;