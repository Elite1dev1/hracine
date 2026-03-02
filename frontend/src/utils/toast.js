import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifySuccess = (message) =>
  toast.success(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    className: 'tp-toast-mobile',
  });

const notifyError = (message) =>
  toast.error(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    className: 'tp-toast-mobile',
  });

export { ToastContainer, notifySuccess, notifyError };
