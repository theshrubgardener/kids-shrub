import CryptoJS from 'crypto-js';

const SECRET_KEY = 'shrub-kids-secret-2024';

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decrypt = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};