import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessToast = (message: string, options: ToastOptions = {}): void => {
  toast.success(message, {
    position: "top-right",
    theme: 'colored',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};

export const showErrorToast = (message: string, options: ToastOptions = {}): void => {
  toast.error(message, {
    position: "top-right",
    theme: 'colored',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};
