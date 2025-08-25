import React, {ChangeEvent, FC, useState} from 'react';
import {GoogleLogin} from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";
import {AuthProvider, useLogin, User} from "../../context/login.context";
import {useNavigate} from "react-router-dom";
import axiosClient from "../../axios/axiosClient";
import {IAPIResponse} from "../../interfaces/data.interfaces";
import "./Registration.css"
import RetroTextBox from "../../components/retro/RetroTextBox/RetroTextBox";
import "../../App.css";
import ReactGA from 'react-ga4'
import {useAppContext} from "../../context/app.context";
import CustomDialog from "../../components/CustomDialog/CustomDialog";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

interface GoogleCredentialResponse {
    credential: string;
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

interface RegistrationData {
    firstName: string;
    lastName: string;
    middleName: string;
    nic: string;
    email: string;
    contactNumber: string;
    address: string;
    password: string;
    confirmPassword: string;
    imageUrl: string;
}

const Registration: FC = () => {
    const navigation = useNavigate();
    const {appContext} = useAppContext();
    const [formData, setFormData] = useState<RegistrationData>({
        firstName: '',
        lastName: '',
        middleName: '',
        nic: '',
        email: '',
        contactNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
        imageUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [signupMethod, setSignupMethod] = useState<string>("system");
    const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
    const [response, setResponse] = useState<IAPIResponse>({ code: null, data: null, message: null, error: null });
    const { loginUser, error } = useLogin();

    // NEW: Terms agreement state
    const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (signupMethod === 'system' && (name === 'password' || name === 'confirmPassword')) {
            if (name === 'password') {
                setPasswordMatch(value === formData.confirmPassword || formData.confirmPassword === "");
            } else {
                setPasswordMatch(value === formData.password);
            }
        }
    };

    const handleGoogleSignupSuccess = async (credentialResponse: GoogleCredentialResponse) => {
        try {
            setSignupMethod('google');
            const decoded: DecodedCredential = jwtDecode(credentialResponse.credential);
            setFormData(prev => ({
                ...prev,
                email: decoded.email,
                firstName: decoded.given_name,
                lastName: decoded.family_name,
                imageUrl: decoded.picture
            }));
        } catch (error) {
            console.error('Error decoding Google credential:', error);
        }
    };

    const handleRegister = async () => {
        if (signupMethod === 'system' && formData.password !== formData.confirmPassword) {
            setPasswordMatch(false);
            return;
        }

        setPasswordMatch(true);
        setLoading(true);

        try {
            const newUser: User = {
                email: formData.email,
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                password: signupMethod === 'system' ? formData.password : '',
                address: formData.address,
                profile: "user",
                contact: formData.contactNumber,
                imageUrl: formData.imageUrl,
                createdAt: new Date().getTime(),
                nic: formData.nic,
                provider: signupMethod === 'google' ? AuthProvider.GOOGLE : AuthProvider.LOCAL
            };

            const registrationResponse = await axiosClient.post("/user/signup", newUser);
            setResponse(registrationResponse.data as IAPIResponse);

            if (registrationResponse.data.code === "CODE-001") {
                if (newUser?.provider == AuthProvider.LOCAL) {
                    appContext.showSuccessDialog("VERIFICATION REQUIRED!", `Hi ${newUser?.lastName} verification email has been sent please check and continue.`)
                    setFormData({
                        ...formData,
                        firstName: "",
                        lastName: "",
                        nic: "",
                        email: "",
                        address: "",
                        contactNumber: "",
                        confirmPassword: "",
                        password: "",
                        middleName: "",
                        imageUrl: ""
                    });
                    // Reset terms when clearing form
                    setTermsAgreed(false);

                    setTimeout(()=>{
                        navigation("/login", {replace: true})
                    }, 3000)

                } else if (newUser?.provider == AuthProvider.GOOGLE) {
                    appContext.showSuccessDialog("ACCESS ACCOUNT!", `Hi ${newUser?.lastName} Your account has been created!`)
                    setTimeout(() => {
                            navigation("/login", {replace: true})
                        },
                        3000
                    )
                }

            }
        } catch (error: any) {
            const extractError = error.response?.data as IAPIResponse;
            setResponse(extractError);
            if (extractError?.code === "CODE-300") {
                appContext.showContentDialog("ERROR!",
                    <div>
                        <p  style={{ color:"#ffffff"}}>Validation error. Please fix the issues in the form:</p>
                        <ul style={{margin: '8px 0', paddingLeft: '20px',  color:"#ffffff"}}>
                            {extractError?.error?.map((error: { field: string, message: string }) => (
                                <li key={error?.field} style={{marginBottom: '4px'}}>
                                    <strong>{error?.field?.toUpperCase()}:</strong> {error.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                );

            } else if (extractError?.code === "CODE-003") {
                appContext.showSuccessDialog("ERROR!", `${extractError?.message}`)
            } else {
                appContext.showSuccessDialog("ERROR!", `Cannot create account`)
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigation('/login');
    };

    const handleProviderClick = (provider: string) => {
        if (provider === 'GOOGLE') {
            setSignupMethod('google');
        } else if (provider === 'PORTAL') {
            setSignupMethod('system');
        }

        setFormData({
            firstName: '',
            lastName: '',
            middleName: '',
            nic: '',
            email: '',
            contactNumber: '',
            address: '',
            password: '',
            confirmPassword: '',
            imageUrl: ''
        });
        setPasswordMatch(true);
        setTermsAgreed(false); // reset on provider switch
    };

    const isFormValid = () => {
        const requiredFields = ['firstName', 'lastName', 'nic', 'email', 'contactNumber'];
        const requiredFieldsValid = requiredFields.every(field => formData[field as keyof RegistrationData].trim() !== '');

        if (signupMethod === 'system') {
            return requiredFieldsValid &&
                formData.password.trim() !== '' &&
                formData.confirmPassword.trim() !== '' &&
                passwordMatch &&
                termsAgreed; // must agree to terms for system signup
        }

        return requiredFieldsValid; // Google path unchanged
    };

    return (
        <>
            <CustomDialog/>

            {/* ADD HEADER - MATCH LOGIN HEADER STRUCTURE */}
            <div className="sys-menu-header">
                <div className="sys-menu-header-left"></div>
                <div className="sys-menu-header-center"></div>
                <div className="sys-menu-header-right"></div>
            </div>

            <div className="registration-main-container">
                <div className="registration-content-area">

                    {/* Logo Section - Left Column (Desktop) / Top (Mobile) */}
                    <div className="registration-logo-section">
                        <div className="registration-logo-container">
                            <img
                                src="images/logo/Logo-animate-wothout-Blink1.gif"
                                alt="Yogeshwari Logo"
                                className="logo" // ADD SAME CLASS AS LOGIN FOR CONSISTENCY
                            />
                        </div>
                    </div>

                    {/* Registration Form Section - Right Column (Desktop) / Bottom (Mobile) */}
                    <div className="registration-form-section">
                        <div className="registration-form-panel">

                            {/* Registration Title */}
                            <h1 className="registration-form-title">REGISTER TO BOARDING PROCESS</h1>

                            {/* Google Registration Button - MATCH LOGIN CONFIGURATION EXACTLY */}
                            <div className="registration-google-container">
                                <GoogleLogin
                                    type={"standard"}
                                    theme="filled_black"
                                    size="large"
                                    text="signin"
                                    onSuccess={handleGoogleSignupSuccess}
                                    onError={() => {
                                        console.error('Google Signup Failed');
                                    }}
                                    useOneTap
                                />
                            </div>

                            {/* Divider */}
                            <div className="registration-form-divider">OR USE EMAIL ADDRESS</div>

                            {/* Registration Form */}
                            <div className="registration-form-container">

                                    <form
                                        className="registration-form"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleRegister();
                                        }}
                                    >
                                        {/* First Name Field */}
                                        <RetroTextBox
                                            className='field-adjest-in-rectrobox'
                                            labelText="First Name:"
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            disabled={signupMethod === 'google' && formData.firstName !== ''}
                                        />

                                        {/* Last Name Field */}
                                        <RetroTextBox
                                            className='field-adjest-in-rectrobox'
                                            labelText="Last Name:"
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            disabled={signupMethod === 'google' && formData.lastName !== ''}
                                        />

                                        {/* Email Field */}
                                        <RetroTextBox
                                            className='field-adjest-in-rectrobox'
                                            labelText="Email:"
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder=""
                                            required
                                            disabled={signupMethod === 'google' && formData.email !== ''}
                                        />

                                        {/* NIC Field */}
                                        <RetroTextBox
                                            className='field-adjest-in-rectrobox'
                                            labelText="NIC/Passport Number:"
                                            type="text"
                                            name="nic"
                                            id="nic"
                                            value={formData.nic}
                                            onChange={handleInputChange}
                                            placeholder="For validation"
                                            required
                                        />

                                        {/* Contact Field */}
                                        <RetroTextBox
                                            className='field-adjest-in-rectrobox'
                                            labelText="Contact:"
                                            type="tel"
                                            name="contactNumber"
                                            id="contactNumber"
                                            value={formData.contactNumber}
                                            required
                                            onChange={handleInputChange}
                                            placeholder="+947*******"
                                        />

                                        {/* Password Fields - Only show for system registration */}
                                        {signupMethod === 'system' && (
                                            <>
                                                <RetroTextBox
                                                    className='field-adjest-in-rectrobox'
                                                    labelText="Password:"
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder=""
                                                    required
                                                />

                                                <RetroTextBox
                                                    className='field-adjest-in-rectrobox'
                                                    labelText="Confirm Password:"
                                                    type="password"
                                                    name="confirmPassword"
                                                    id="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder=""
                                                    required
                                                />

                                                {/* Password Match Error */}
                                                {!passwordMatch && (
                                                    <span className="registration-error-message">
                                                        Passwords do not match
                                                    </span>
                                                )}
                                            </>
                                        )}

                                        <div className="terms-and-con-adjest">
                                            <label className="terms-inline">
                                                <input
                                                    type="checkbox"
                                                    checked={termsAgreed}
                                                    onChange={(e) => setTermsAgreed(e.target.checked)}
                                                />
                                                <span>
                                                    Agree to <span className="underline cursor-pointer" onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        appContext.showSuccessDialog("TERMS AND CONDITIONS!", "I agree to share my NIC/Passport number, mobile, and email for ticket/anomaly verification. These details will only be used within  Kuweni by Charitha Attalage (Pvt) Ltd and will not be shared with any third party.");
                                                    }}>Terms and Conditions</span>
                                                </span>
                                            </label>
                                        </div>

                                        {/* General Error Message */}
                                        <span className="registration-error-message">{error ?? ""}</span>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="registration-submit-button"
                                            disabled={loading || !isFormValid()|| !termsAgreed}
                                        >
                                            {loading ? 'Registering...' : 'Register'}
                                        </button>

                                        {/* Login Redirect - UPDATED WITH UNDERLINE CLASS */}
                                        <div
                                            className="registration-login-redirect underline"
                                            onClick={handleLoginRedirect}
                                        >
                                            I already have an account
                                        </div>

                                    </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADD FOOTER - MATCH LOGIN FOOTER */}
            <GlobalFooter text="You're accessing a secure portal..." />
        </>
    );
};

export default Registration;
