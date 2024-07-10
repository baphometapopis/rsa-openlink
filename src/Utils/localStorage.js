import CryptoJS from 'crypto-js';

export const STORAGE_KEY_PREFIX = import.meta.env.VITE_STORAGE_KEY_PREFIX
export const SECRET_KEY = import.meta.env.VITE_SECRET_KEY


const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const setUserSession = (user) => {
  const timestamp = new Date().getTime();
  const expirationTime = timestamp + 12 * 60 * 60 * 1000; // 12 hours
  const userData = { ...user, expirationTime };
  const encryptedData = encryptData(userData);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}`, encryptedData);
};

export const getUserSession = () => {
  const encryptedData = localStorage.getItem(`${STORAGE_KEY_PREFIX}`);
  if (!encryptedData) return null;

  const userData = decryptData(encryptedData);
  const currentTime = new Date().getTime();

  if (currentTime > userData.expirationTime) {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}`);
    return null;
  }

  return userData;
};

export const setFormDatatoLocal=(formdata)=>{
  const data = getUserSession()
  const submiteddata={...data,formData:formdata}
  const encryptedData = encryptData(submiteddata);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}`, encryptedData);
}

export const setAddPlan=(planID)=>{
  const data = getUserSession()
  const formData = data?.formData || {};
  formData.selectedPlan = planID;
  const submittedData = { ...data, formData };
  const encryptedData = encryptData(submittedData);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}`, encryptedData);
}

export const clearUserSession = () => {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}`);
};
