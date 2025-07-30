import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, fetchUser } from "../features/auth/authSlice";
import { AppDispatch } from "../app/store";

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      dispatch(setCredentials({ token }));
      localStorage.setItem("token", token);
      dispatch(fetchUser(token));
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } else {
      navigate("/login", { replace: true });
    }
  }, [location, dispatch, navigate]);

  return <div>Signing you in...</div>;
};

export default AuthSuccess;