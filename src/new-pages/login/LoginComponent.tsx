import React, {ChangeEvent, FC, useEffect, useState} from "react";
import "./LoginComponent.css";
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import {AuthProvider, useLogin, User} from "../../context/login.context";
import RetroTextBox from "../../components/retro/RetroTextBox/RetroTextBox";
import "../../App.css";
import {useLocation, useNavigate} from "react-router-dom";
import Alert, {AlertProps} from "../../components/retro/Alert/Alert";

interface LoginComponentProps {
  logoSrc?: string;
  imageSrc?: string;
}

interface DecodedCredential {
  email: string;
  name: string;
  picture: string;
  sub: string;
  iat?: number;
  exp?: number;
  given_name: string;
  family_name: string;
}

interface GoogleCredentialResponse {
  credential: string;
}

interface LoginUser {
  email: string;
  password: string;
}

const LoginComponent: FC<LoginComponentProps> = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [alert, setAlert] = useState<AlertProps>({
    type: "info",
    visible: false,
    message: null
  });
  const [user, setUser] = useState<LoginUser>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const { loginUser, loading, error } = useLogin();

  const isFormValid = () => {
    return (
      user.email &&
      user.email.match(/\S+@\S+\.\S+/) &&
      user.password &&
      user.password.length >= 1
    );
  };

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      const decoded: DecodedCredential = jwtDecode(credentialResponse.credential);
      const googleUser: User = {
        id: decoded.sub,
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        provider: "GOOGLE",
        contact: "",
        nic: "",
        picture: decoded.picture
      };

      const success = await loginUser(googleUser, "GOOGLE");
      if (success) {
        navigation("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setAlert({
        type: "error",
        visible: true,
        message: "Google login failed. Please try again."
      });
    }
  };

  const handleGoogleLoginError = () => {
    setAlert({
      type: "error",
      visible: true,
      message: "Google login failed. Please try again."
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setAlert({
        type: "error",
        visible: true,
        message: "Please fill in all required fields correctly."
      });
      return;
    }

    try {
      const localUser: User = {
        id: "",
        email: user.email,
        firstName: "",
        lastName: "",
        provider: "LOCAL",
        contact: "",
        nic: "",
        password: user.password
      };

      const success = await loginUser(localUser, "LOCAL");
      if (success) {
        navigation("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        type: "error",
        visible: true,
        message: "Login failed. Please check your credentials."
      });
    }
  };

  const redirectToSignup = () => {
    navigation("/registration");
  };

  useEffect(() => {
    if (error) {
      setAlert({
        type: "error",
        visible: true,
        message: error
      });
    }
  }, [error]);

  return (
    <div className="yo-login-main-container">
      <div className="yo-login-content-area">
        {/* Logo Section */}
        <div className="yo-login-logo-section">
          <div className="yo-login-logo">
            <img src="/logo.svg" alt="Yogeshwari Logo" />
          </div>
        </div>

        {/* Login Section */}
        <div className="yo-login-section">
          <div className="yo-login-panel">
            <h1 className="yo-login-title">ACCESS BOARDING PROCESS</h1>

            {/* Google Login */}
            <div className="yo-login-google-btn">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                theme="outline"
                size="large"
                text="signin_with"
                width="300"
              />
            </div>

            {/* Divider */}
            <div className="yo-login-divider">OR USE EMAIL ADDRESS</div>

            {/* Login Form - Using global form classes */}
            <form className="yo-form-container" onSubmit={handleLogin}>
              <div className="yo-form-group">
                <label htmlFor="email">Email Address:</label>
                <div className="yo-input-wrapper">
                  <RetroTextBox
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleUserInput}
                    placeholder="agent@yogeshwari.one"
                    required
                  />
                </div>
              </div>

              <div className="yo-form-group">
                <label htmlFor="password">Access Code:</label>
                <div className="yo-input-wrapper">
                  <RetroTextBox
                    id="password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleUserInput}
                    placeholder="Enter your access code"
                    required
                  />
                </div>
              </div>

              {/* Login Button - Using global button classes */}
              <button 
                type="submit" 
                className="yo-login-btn btn"
                disabled={loading || !isFormValid()}
              >
                {loading ? "ACCESSING..." : "ACCESS SYSTEM"}
              </button>
            </form>

            {/* Signup Redirect */}
            <div className="yo-login-signup-redirect-container">
              <button 
                type="button"
                className="yo-login-signup-redirect-btn btn-secondary"
                onClick={redirectToSignup}
              >
                I NEED NEW BOARDING PASS
              </button>
            </div>

            {/* No Account Text */}
            <p className="yo-login-no-account">
              First time accessing the system? Register for boarding process above.
            </p>

            {/* Error Display */}
            {alert.visible && (
              <div className="yo-login-error">
                {alert.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Component */}
      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}
    </div>
  );
};

export default LoginComponent;