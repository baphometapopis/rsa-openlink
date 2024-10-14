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


export const setOTP = (user) => {

  // const encryptedData = encryptData(user);
  localStorage.setItem('opnrsaOTP', user?.otp);
};


export const removeOTP = () => {
  localStorage.removeItem('opnrsaOTP');
};

export const getOTP = () => {
  const encryptedData = localStorage.getItem('opnrsaOTP');
  return encryptedData;
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

export const setFormDatatoLocal = (formdata) => {
  const data = getUserSession() || {}; // Ensure data is an object if getUserSession returns null

  // Check if formData exists and update it or create a new one
  const updatedFormData = data.formData?.policy_data ? { ...data.formData, ...formdata } : formdata;

  const submiteddata = { ...data, formData: updatedFormData };
  const encryptedData = encryptData(submiteddata);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}`, encryptedData);
};


export const updateMobileNotoLocal = (mobileNo)=>{
  const data = getUserSession() || {}; 

  data.formData.policy_data.mobile_no=mobileNo

  const submiteddata = { ...data};
  const encryptedData = encryptData(submiteddata);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}`, encryptedData);

}

export const updatePolicyData = (formdata) => {
  const data = getUserSession() || {}; // Ensure data is an object if getUserSession returns null
data.formData.policy_data=formdata
  // Check if formData exists and update it or create a new one
  // const updatedFormData = data.formData.policy_data ? { ...data.formData, ...formdata } : formdata;
  const submiteddata = { ...data };

  const encryptedData = encryptData(submiteddata);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}`, encryptedData);
};




export const setAddPlan=(planID)=>{
  const data = getUserSession()
  const formData = data?.formData || {};
  formData.selectedPlan = planID;
  const submittedData = { ...data, formData };
  const encryptedData = encryptData(submittedData);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}`, encryptedData);
}


export const setParamsToLocal = (params) => {
  const currentSessionData = getUserSession() || {};
  
  const updatedData = { ...currentSessionData, params };
  
  const encryptedData = encryptData(updatedData);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}`, encryptedData);
};


export const clearUserSession = () => {
  localStorage.clear();

};

export const getParamsFromLocal = () => {
  const userData = getUserSession();
  return userData ? userData.params : null;
};