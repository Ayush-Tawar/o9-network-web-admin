import React, { createContext, useContext } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GlobalAlert from "src/components/GlobalAlert";
import { useEffectSkipFirst } from "src/hooks/useEffectSkipFirst";
import { notiRef } from "src/hooks/useNotify";
import actions from "src/redux/actions/actions";
import useCardsApi from "src/api/useCardsApi";
import useSectionsApi from "src/api/useSectionsApi";
import useAboutUs from "src/api/useAboutUsApi";
import useFaqsApi from "src/api/useFaqsApi";
import useCMS from "src/api/useCMS";
import useInquiries from "src/api/useInquiries";
import useSocialLinks from "src/api/useSocialLinks";
import useSeoApi from "src/api/useSeoApi";
import ChangePasswordModal, {
  changePasswordRef,
} from "src/components/ChangePasswordModal";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { authToken, userData } = useSelector((state) => state.reducer);
  const navigate = useNavigate();

  useEffectSkipFirst(() => navigate("/", { replace: true }), [authToken]);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(actions.logout());
  };

  // Live Data
  const cardsApi = useCardsApi(authToken);
  const sectionApi = useSectionsApi(authToken);
  const aboutUsApi = useAboutUs(authToken);
  const faqsApi = useFaqsApi(authToken);
  const cmsApi = useCMS(authToken);
  const inquiriesApi = useInquiries(authToken);
  const socialLinksApi = useSocialLinks(authToken);
  const seoApi = useSeoApi(authToken);
  //

  const value = {
    authToken: authToken,
    userData: userData,
    handleLogout: handleLogout,
    //Data
    cardsApi,
    sectionApi,
    aboutUsApi,
    faqsApi,
    cmsApi,
    inquiriesApi,
    socialLinksApi,
    seoApi,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthContext.Provider value={value}>
        <GlobalAlert ref={notiRef} />
        <ChangePasswordModal ref={changePasswordRef} />
        {children}
      </AuthContext.Provider>
    </LocalizationProvider>
  );
};
