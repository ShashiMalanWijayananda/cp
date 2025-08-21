import React, { ChangeEvent, FC, useEffect, useState, useRef } from "react";
import "./Profile.css";
import { GET_ARCHIVE_CONCERT, GET_MY_PROFILE, UPDATE_PROFILE } from "../../graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useLogin, User } from "../../context/login.context";
import { IAConcert, IAPIResponse, IGroupedConcert } from "../../interfaces/data.interfaces";
import Alert, { AlertProps } from "../../components/retro/Alert/Alert";
import { useAppContext } from "../../context/app.context";
import { useLocation } from "react-router-dom";
import axiosClient from "../../axios/axiosClient";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

interface BadgeDetails {
    type: string;
    title: string;
    description: string;
    image: string;
    concerts: IAConcert[];
}

const Profile: FC = () => {
    const location = useLocation();
    const [now, setNow] = useState<Date>(new Date());
    const { user } = useLogin();
    const [systemUser, setSystemUser] = useState<User>(null);
    const [originalUser, setOriginalUser] = useState<User>(null);
    const [archiveConcert, setArchiveConcert] = useState<IAConcert[]>([]);
    const [alert, setAlert] = useState<AlertProps>({
        type: "info",
        visible: false,
        message: null
    });
    const { appContext } = useAppContext();
    const [isBadgePopupOpen, setIsBadgePopupOpen] = useState(false);
    const [selectedBadgeDetails, setSelectedBadgeDetails] = useState<BadgeDetails | null>(null);
    const [response, setResponse] = useState<IAPIResponse>({ code: null, data: null, message: null, error: null });

    // Terminal cursor functionality refs
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const [getUserProfile, {
        data: myProfile,
        loading: loadingProfile,
        error: errorLoadingProfile
    }] = useLazyQuery(GET_MY_PROFILE, { fetchPolicy: "network-only" });

    const [getArchiveConcert, {
        data: concerts,
        loading: loadingConcerts,
        error: errorConcerts
    }] = useLazyQuery(GET_ARCHIVE_CONCERT, { fetchPolicy: "network-only" });

    const [updateProfile, {
        data: updateResponse,
        loading: loadingUpdate,
        error: updateError
    }] = useMutation(UPDATE_PROFILE, { fetchPolicy: "network-only" });

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (user?.id !== null) {
            getUserProfile({ variables: { userId: user?.id } });
            getArchiveConcert({ variables: { contact: user?.contact } });
        }
    }, [user, location]);

    useEffect(() => {
        const response = myProfile?.getMyProfile as IAPIResponse;
        if (response?.code === "CODE-009") {
            setSystemUser(response?.data);
            setOriginalUser(JSON.parse(JSON.stringify(response?.data)));
        }
    }, [myProfile]);

    useEffect(() => {
        const response = concerts?.getConcertArchive as IAPIResponse;
        if (response?.code === "CODE-3000") {
            setArchiveConcert(response?.data);
        }
    }, [concerts]);

    // Terminal cursor setup and management
    useEffect(() => {
        if (!canvasRef.current) {
            const canvas = document.createElement('canvas');
            canvas.style.display = 'none';
            document.body.appendChild(canvas);
            canvasRef.current = canvas;
        }

        const canvas = canvasRef.current;

        const measureTextWidth = (text: string, inputElement: HTMLInputElement): number => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return 0;

            const computedStyle = window.getComputedStyle(inputElement);
            const fontSize = computedStyle.fontSize;
            const fontFamily = computedStyle.fontFamily;
            const fontWeight = computedStyle.fontWeight;

            ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
            const metrics = ctx.measureText(text);
            return Math.floor(metrics.width);
        };

        const updateCursorPosition = (inputElement: HTMLInputElement) => {
            const formGroup = inputElement.closest('.form-group') as HTMLElement;
            if (formGroup && formGroup.classList.contains('focused')) {
                setTimeout(() => {
                    const cursorPos = inputElement.selectionStart || 0;
                    const textBeforeCursor = inputElement.value.substring(0, cursorPos);
                    const textWidth = measureTextWidth(textBeforeCursor, inputElement);
                    const computedStyle = window.getComputedStyle(inputElement);
                    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 12;
                    const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
                    const cursorPosition = Math.round(paddingLeft + borderLeft + textWidth);
                    formGroup.style.setProperty('--cursor-left', `${cursorPosition}px`);
                }, 10);
            }
        };

        const setupInputHandlers = (input: HTMLInputElement) => {
            const handleFocus = () => {
                const formGroup = input.closest('.form-group') as HTMLElement;
                if (formGroup) {
                    formGroup.classList.add('focused');
                    updateCursorPosition(input);
                }
            };

            const handleBlur = () => {
                const formGroup = input.closest('.form-group') as HTMLElement;
                if (formGroup) {
                    formGroup.classList.remove('focused');
                }
            };

            const handleInput = () => {
                setTimeout(() => updateCursorPosition(input), 5);
            };

            const handleKeyUp = () => {
                setTimeout(() => updateCursorPosition(input), 5);
            };

            const handleClick = () => {
                setTimeout(() => updateCursorPosition(input), 5);
            };

            const handleKeyDown = (event: KeyboardEvent) => {
                const navigationKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
                if (navigationKeys.includes(event.key)) {
                    setTimeout(() => updateCursorPosition(input), 5);
                }
            };

            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
            input.addEventListener('input', handleInput);
            input.addEventListener('keyup', handleKeyUp);
            input.addEventListener('click', handleClick);
            input.addEventListener('keydown', handleKeyDown);

            return () => {
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
                input.removeEventListener('input', handleInput);
                input.removeEventListener('keyup', handleKeyUp);
                input.removeEventListener('click', handleClick);
                input.removeEventListener('keydown', handleKeyDown);
            };
        };

        // Setup handlers for all inputs
        const cleanupFunctions: (() => void)[] = [];
        Object.values(inputRefs.current).forEach(input => {
            if (input) {
                cleanupFunctions.push(setupInputHandlers(input));
            }
        });

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
            if (canvasRef.current && document.body.contains(canvasRef.current)) {
                document.body.removeChild(canvasRef.current);
            }
        };
    }, [systemUser]);

    const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSystemUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handlingCloseAlert = () => {
        setAlert(prev => ({ ...prev, visible: false }));
    };

    const handleUpdate = async () => {
        if (!isFormChanged()) {
            return;
        }

        axiosClient.post("/user/update", systemUser)
            .then((response) => {
                const data = response.data;
                console.log(response?.data);
                if (data?.code === "CODE-011") {
                    setOriginalUser(JSON.parse(JSON.stringify(systemUser)));
                    setAlert({
                        ...alert,
                        message: "Your account has been updated successfully!",
                        visible: true,
                        type: "info"
                    });
                }
            })
            .catch(error => {
                const errorResponse = error?.response?.data as IAPIResponse;
                if (errorResponse?.code == "CODE-300") {
                    setAlert({
                        ...alert,
                        message: (
                            <div>
                                <p>Validation error. Please fix the issues in the form:</p>
                                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                    {errorResponse?.error?.map((error) => (
                                        <li key={error?.field} style={{ marginBottom: '4px' }}>
                                            <strong>{error?.field?.toUpperCase()}:</strong> {error.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ),
                        visible: true,
                        type: "error"
                    });
                }
            });
    };

const isFormChanged = () => {
  if (!originalUser || !systemUser) return false;
  return (
    (originalUser.firstName ?? "") !== (systemUser.firstName ?? "") ||
    (originalUser.lastName ?? "")  !== (systemUser.lastName ?? "")  ||
    (originalUser.password ?? "")  !== (systemUser.password ?? "")
  );
};




    const groupByConcert = (data?: IAConcert[]): IGroupedConcert[] => {
        if (!data || data.length === 0) return [];

        const groupedMap = data.reduce<Record<string, IAConcert>>((acc, item) => {
            if (!acc[item.concert]) {
                acc[item.concert] = item;
            }
            return acc;
        }, {});

        return Object.entries(groupedMap).map(([concert, record]) => ({
            concert,
            record,
        }));
    };

    const getBadgeDetails = (badgeType: string): BadgeDetails => {
        const relatedConcerts = archiveConcert.filter(concert => {
            switch (badgeType) {
                case "kuweni1":
                    return ["Kuweni_1.1", "Kuweni_1.2", "Kuweni_1.3"].includes(concert.concert);
                case "kuweni2":
                    return ["Kuweni_2.0 1", "Kuweni_2.0 2", "Kuweni_2.0 3", "Kuweni_2.0 4", "Kuweni_2.0 5", "Kuweni_2.1"].includes(concert.concert);
                case "kuweniVerse":
                    return concert.concert === "Kuweni_Verse";
                case "yogeshwari":
                    return concert.concert === "yogeshwari";
                default:
                    return false;
            }
        });

        const badgeInfo = {
            kuweni1: {
                title: "Kuweni live in Concert 2019/2020",
                description: "In recognition of your participation during Kuweni Live in concert 2019/2020",
                image: "images/badge/k1.png"
            },
            kuweni2: {
                title: "Kuweni the Musical 2023",
                description: "In recognition of of your participation during Kuweni the musical 2023",
                image: "images/badge/k2.png"
            },
            kuweniVerse: {
                title: "Step into the Kuweniverse 2024",
                description: "In recognition of your contribution during Kuweniverse. Decoding and step into the Kuweniverse.",
                image: "images/badge/k3.png"
            },
            yogeshwari: {
                title: "Yogeshwari Treasure Hunt - Virtual",
                description: "Awarded for your key role in unraveling virtual puzzles and decoding the hidden path during the Yogeshwari Treasure Hunt.",
                image: "images/badge/k4.png"
            }
        };

        return {
            type: badgeType,
            title: badgeInfo[badgeType]?.title || "Concert Badge",
            description: badgeInfo[badgeType]?.description || "You've participated in this concert series.",
            image: badgeInfo[badgeType]?.image || "",
            concerts: relatedConcerts
        };
    };

    const showBadge = (badgeType: string) => {
        const details = getBadgeDetails(badgeType);
        setSelectedBadgeDetails(details);
        setIsBadgePopupOpen(true);
    };

    const closeBadgePopup = () => {
        setIsBadgePopupOpen(false);
        setSelectedBadgeDetails(null);
    };

    const renderBadges = () => {
        const uniqueBadges = new Set();
        const badgeData = [];
        const uniqueConcerts = groupByConcert(archiveConcert);

        uniqueConcerts.forEach(concert => {
            let badgeType = null;
            let badgeImage = null;
            if (concert.concert === "Kuweni_1.1" ||
                concert.concert === "Kuweni_1.2" ||
                concert.concert === "Kuweni_1.3") {
                badgeType = "kuweni1";
                badgeImage = "images/badge/k1.png";
            } else if (concert.concert === "Kuweni_2.0 1" ||
                concert.concert === "Kuweni_2.0 2" ||
                concert.concert === "Kuweni_2.0 3" ||
                concert.concert === "Kuweni_2.0 4" ||
                concert.concert === "Kuweni_2.0 5" ||
                concert.concert === "Kuweni_2.1") {
                badgeType = "kuweni2";
                badgeImage = "images/badge/k2.png";
            } else if (concert.concert === "Kuweni_Verse") {
                badgeType = "kuweniVerse";
                badgeImage = "images/badge/k3.png";
            } else if (concert.concert === "yogeshwari") {
                badgeType = "yogeshwari";
                badgeImage = "images/badge/k4.png";
            }
            if (badgeType && !uniqueBadges.has(badgeType)) {
                uniqueBadges.add(badgeType);
                badgeData.push({
                    type: badgeType,
                    image: badgeImage,
                    concert: concert
                });
            }
        });

        const badges = [];
        for (let i = 0; i < 4; i++) {
            if (badgeData[i]) {
                badges.push(
                    <img
                        key={badgeData[i].type}
                        className="badge-item"
                        src={badgeData[i].image}
                        alt={`${badgeData[i].type} Badge`}
                        onClick={() => showBadge(badgeData[i].type)}
                    />
                );
            } else {
                badges.push(
                    <div key={`placeholder-${i}`} className="badge-placeholder" />
                );
            }
        }
        return badges;
    };

    return (
        <>
            {/* Page heading that scrolls with content */}
            <div className="profile-page-heading">
                <h1>Profile</h1>
            </div>

            {/* Main page container (sits inside AppLayout Outlet) */}
            <main className="profile-page-container" role="main">
                
                {/* Alerts */}
                <Alert 
                    message={alert.message} 
                    type={alert.type}
                    visible={alert.visible}
                    autoCloseDelay={3000} 
                    autoClose={true}
                    onClose={handlingCloseAlert}
                />

                {/* Main content area */}
                <section className="profile-content-main">
                    <div className="profile-main">
                        
                        {/* Profile info row with badges */}
                        <div className="profile-info-row">
                            <div className="badge-container" aria-label="Achievement badges">
                                {renderBadges()}
                            </div>
                        </div>

                        {/* Form - Profile fields with terminal-style cursor */}
                        <form className="details-form" onSubmit={(e) => e.preventDefault()}>
                            
                            {/* First Name Field - EDITABLE */}
                            <div className="form-group">
                                <label htmlFor="firstName">First Name :</label>
                                <div className="input-wrapper">
                                    <input
                                        ref={(el) => (inputRefs.current.firstName = el)}
                                        id="firstName"
                                        type="text"
                                        value={systemUser?.firstName || ""}
                                        onChange={handleUserInput}
                                        name="firstName"
                                        className="field-value-profile"
                                        aria-label="First name"
                                    />
                                </div>
                            </div>

                            {/* Last Name Field - EDITABLE */}
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name :</label>
                                <div className="input-wrapper">
                                    <input
                                        ref={(el) => (inputRefs.current.lastName = el)}
                                        id="lastName"
                                        type="text"
                                        value={systemUser?.lastName || ""}
                                        onChange={handleUserInput}
                                        name="lastName"
                                        className="field-value-profile"
                                        aria-label="Last name"
                                    />
                                </div>
                            </div>

                            {/* Email Field - READONLY */}
                            <div className="form-group">
                                <label htmlFor="email">Email Address :</label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        type="email"
                                        value={systemUser?.email || ""}
                                        name="email"
                                        className="field-value-readonly"
                                        aria-label="Email address"
                                        readOnly
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* NIC Field - READONLY */}
                            <div className="form-group">
                                <label htmlFor="nic">NIC Number :</label>
                                <div className="input-wrapper">
                                    <input
                                        id="nic"
                                        type="text"
                                        value={systemUser?.nic || ""}
                                        name="nic"
                                        className="field-value-readonly"
                                        aria-label="NIC number"
                                        readOnly
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Contact Field - READONLY */}
                            <div className="form-group">
                                <label htmlFor="contact">Contact Number :</label>
                                <div className="input-wrapper">
                                    <input
                                        id="contact"
                                        type="text"
                                        value={systemUser?.contact || ""}
                                        name="contact"
                                        className="field-value-readonly"
                                        aria-label="Contact number"
                                        readOnly
                                        disabled
                                    />
                                </div>
                            </div>
{/* Password – always visible */}
<div className="form-group">
  <label htmlFor="password">Password :</label>
  <div className="input-wrapper">
    <input
      ref={(el) => (inputRefs.current.password = el)}
      id="password"
      type="password"
      value={systemUser?.password ?? ""}
      onChange={handleUserInput}
      name="password"
      className="field-value-profile"
      placeholder="**************"
      aria-label="Password"
    />
  </div>
</div>



                            {/* Update Button */}
                            <button
                                type="button"
                                className="update-button"
                                onClick={handleUpdate}
                                disabled={!isFormChanged()}
                                aria-label="Update profile information"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </section>
                
            </main>

            {/* Badge popup modal */}
            {isBadgePopupOpen && selectedBadgeDetails && (
                <div 
                    className="badge-popup-overlay" 
                    onClick={closeBadgePopup}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="badge-title"
                    aria-describedby="badge-description"
                >
                    <div className="badge-popup-content" onClick={(e) => e.stopPropagation()}>
                        <header className="badge-popup-header">
                            <button 
                                className="badge-popup-close" 
                                onClick={closeBadgePopup}
                                aria-label="Close badge details"
                            >
                                ×
                            </button>
                        </header>
                        <div className="badge-popup-body">
                            <div className="badge-image-container">
                                <img
                                    src={selectedBadgeDetails.image}
                                    alt={selectedBadgeDetails.title}
                                    className="badge-popup-image"
                                />
                            </div>
                            <div className="badge-info">
                                <h2 id="badge-title" className="badge-title">{selectedBadgeDetails.title}</h2>
                                <p id="badge-description" className="badge-description">{selectedBadgeDetails.description}</p>
                                {selectedBadgeDetails.concerts.length > 0 && (
                                    <div className="badge-popup-concerts">
                                        <h4>Related Concerts:</h4>
                                        <ul>
                                            {selectedBadgeDetails.concerts.map((concert, index) => (
                                                <li key={index}>{concert.concert}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Global scrolling footer message */}
            <GlobalFooter text="**** AGENT PORTAL ACTIVE **** SECURE CONNECTION **** DATA ENCRYPTED **** SYSTEM OPERATIONAL **** " />
            
        </>
    );
};

export default Profile;