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

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "", general: "" };
    if (!user.email) {
      errors.email = "Email is required";
      setAlert({
        ...alert,
        message: "Email is required",
        visible: true,
        type: "error"
      })
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = "Please enter a valid email address";
      setAlert({
        ...alert,
        message: "Please enter a valid email address",
        visible: true,
        type: "error"
      })
      isValid = false;
    } else if (user.password == "") {
      setAlert({
        ...alert,
        message: "Please enter password",
        visible: true,
        type: "error"
      })
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    setFormErrors((prev) => ({ ...prev, general: "" }));

    if (validateForm()) {
      const loggedUser: User = {
        email: user.email,
        password: user.password,
        provider: AuthProvider.LOCAL,
      };
      if (loggedUser?.email !== "" && loggedUser?.password !== "") {
        try {
          await loginUser(loggedUser);
        } catch (err) {
          if (error) {
            if (error.includes("Password must contain")) {
              setFormErrors((prev) => ({...prev, password: error}));
            } else {
              setFormErrors((prev) => ({...prev, general: error}));
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    if (error) {

    }
  }, [error]);

  const handleGoogleLoginSuccess = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    try {
      const decoded: DecodedCredential = jwtDecode(
          credentialResponse.credential
      );

      console.log(credentialResponse)
      const loggedUser: User = {
        email: decoded.email,
        authKey: credentialResponse.credential,
        provider: AuthProvider.GOOGLE,
      };

      setFormErrors({email: "", password: "", general: ""});
      await loginUser(loggedUser);
    } catch (error) {
      console.error("Error decoding Google credential:", error);
      setFormErrors((prev) => ({
        ...prev,
        general: "Google authentication failed. Please try again.",
      }));
    }
  };

  useEffect(() => {
    const verifyStatus = queryParams.get("verification-success") as string | null;
    const email = queryParams.get("email");
    if (verifyStatus == "activated") {
      setAlert({visible: true, type: "info", message: "Hi agent, Your account has already activated!!!"})
    } else if (verifyStatus == "active") {
      setAlert({visible: true, type: "info", message: "Hi agent, Your account has been activated!!!"})
    } else if (verifyStatus == "failed") {
      setAlert({visible: true, type: "error", message: "Hi agent, Activation Process Error.."})
    }
  }, [])

  return (
      <>
        <Alert
            message={alert.message ?? ""}
            visible={alert.visible}
            type={alert.type}
            onClose={() => setAlert(prev => ({
              ...prev,
              visible: false,
            }))}
            className="label-right"
            autoClose={true}
            autoCloseDelay={5000}
        />
        
        <div className="login-main-container">
          <div className="login-content-area">
            
            {/* Logo Section - Left Column (Desktop) / Top (Mobile) */}
            <div className="login-logo-section">
              <div className="login-logo-container">
                <img
                    src="images/logo/Logo-animate-wothout-Blink1.gif"
                    alt="Yogeshwari Logo"
                />
              </div>
            </div>

            {/* Login Form Section - Right Column (Desktop) / Bottom (Mobile) */}
            <div className="login-form-section">
              <div className="login-form-panel">
                
                {/* Login Title */}
                <h1 className="login-form-title">LOGIN TO BOARDING PROCESS</h1>
                
                {/* Google Login Button */}
                <div className="login-google-container">
                  <GoogleLogin
                    type={"standard"}
                    theme="filled_black"
                    size="large"
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => {
                      setFormErrors((prev) => ({
                        ...prev,
                        general: "Google Login Failed. Please try again.",
                      }));
                    }}
                    useOneTap
                  />
                </div>
                
                {/* Divider */}
                <div className="login-form-divider">OR USE EMAIL ADDRESS</div>
                
                {/* Login Form */}
                <div className="login-form-container">
                  <form
                    className="login-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLogin();
                    }}
                  >
                    <RetroTextBox
                      labelText="Email :"
                      type="text"
                      name="email"
                      id="email"
                      value={user.email}
                      onChange={handleUserInput}
                      placeholder=""
                    />

                    <RetroTextBox
                      labelText="Password :"
                      type="password"
                      name="password"
                      id="password"
                      value={user.password}
                      onChange={handleUserInput}
                      placeholder=""
                    />

                    {/* Error Message */}
                    <span className="login-error-message">{error ?? ""}</span>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="login-submit-button"
                        disabled={loading}
                    >
                      {loading ? "Logging..." : "Login"}
                    </button>

                    {/* Registration Redirect */}
                    <div
                      className="login-register-redirect"
                      onClick={() =>
                        navigation("/registration", { replace: true })
                      }
                    >
                      I don't have an account
                    </div>
                    
                  </form>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
        
      </>
  );
};

export default LoginComponent;