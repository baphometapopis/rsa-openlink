export const url = import.meta.env.VITE_API_URL; //demo

export const Api_Endpoints = {
  getDataByChassisNumber: `${url}renewal/getDataBychasissno`,
  getDropDownData: `${url}GetModelData`,
  GetPincodeData: `${url}GetPincodeData`,
  GetplanDataBymodel: `${url}GetplanDataBymodel`,
  BuyPolicy: `${url}Renewal/BuyPolicy`,
  getPaymentStatus: `${url}Renewal/GetPaymentStatus`,
  sendOTP: `${url}renewal/otp`,
  policyData: `${url}Renewal/GetPolicyinformation`,







};

