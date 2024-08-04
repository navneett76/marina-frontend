// hooks/useAxiosInterceptors.ts
import axiosInstance, {useAxiosInstance} from '../../axiosInstance';
import { useLoader } from '../../contexts/LoaderContext';

const useAxiosInterceptors = () => {
  const { showLoader, hideLoader } = useLoader();

//   useEffect(() => {
//     useAxiosInstance(showLoader, hideLoader);
//   }, [showLoader, hideLoader]);
// useAxiosInstance(showLoader, hideLoader);

  return axiosInstance;
};

export default useAxiosInterceptors;
