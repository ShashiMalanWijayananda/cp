import React, {ChangeEvent, FC, useEffect, useState} from "react";
import "./Profile.css";
import {GET_ARCHIVE_CONCERT, GET_MY_PROFILE, UPDATE_PROFILE} from "../../graphql/queries";
import {useLazyQuery, useMutation} from "@apollo/client";
import {useLogin, User} from "../../context/login.context";
import {IAConcert, IAPIResponse, IGroupedConcert} from "../../interfaces/data.interfaces";
import Alert, {AlertProps} from "../../components/retro/Alert/Alert";
import {useAppContext} from "../../context/app.context";
import {useLocation} from "react-router-dom";
import axiosClient from "../../axios/axiosClient";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import RetroTextBox from "../../components/retro/RetroTextBox/RetroTextBox";

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
    const {user} = useLogin();
    const [systemUser, setSystemUser] = useState<User>(null);
    const [originalUser, setOriginalUser] = useState<User>(null);
    const [archiveConcert, setArchiveConcert] = useState<IAConcert[]>([]);
    const [alert, setAlert] = useState<AlertProps>({
        type: "info",
        visible: false,
        message: null
    });
    const {appContext} = useAppContext();
    const [isBadgePopupOpen, setIsBadgePopupOpen] = useState(false);
    const [selectedBadgeDetails, setSelectedBadgeDetails] = useState<BadgeDetails | null>(null);
    const [response, setResponse] = useState<IAPIResponse>({code: null, data: null, message: null, error: null});

    const [getUserProfile, {
        data: myProfile,
        loading: loadingProfile,
        error: errorLoadingProfile
    }] = useLazyQuery(GET_MY_PROFILE, {fetchPolicy: "network-only"});

    const [getArchiveConcert, {
        data: concerts,
        loading: loadingConcerts,
        error: errorConcerts
    }] = useLazyQuery(GET_ARCHIVE_CONCERT, {fetchPolicy: "network-only"});

    const [updateProfile, {
        data: updateResponse,
        loading: loadingUpdate,
        error: updateError
    }] = useMutation(UPDATE_PROFILE, {fetchPolicy: "network-only"})

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (user?.id !== null) {
            getUserProfile({variables: {userId: user?.id}})
            getArchiveConcert({variables: {contact: user?.contact}})
        }
    }, [user, location])

    useEffect(() => {
        const response = myProfile?.getMyProfile as IAPIResponse;
        if (response?.code === "CODE-009") {
            setSystemUser(response?.data);
            setOriginalUser(JSON.parse(JSON.stringify(response?.data)));
        }
    }, [myProfile])

    useEffect(() => {
        const response = concerts?.getConcertArchive as IAPIResponse;
        if (response?.code === "CODE-3000") {
            setArchiveConcert(response?.data);
        }
    }, [concerts])

    const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setSystemUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    }

    const handlingCloseAlert = () => {
        setAlert(prev => ({...prev, visible: false}));
    }

    const handleUpdate = async () => {
        if (!isFormChanged()) {
            return;
        }

        axiosClient.post("/user/update", systemUser)
            .then((response) => {
                const data = response.data;
                console.log(response?.data)
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
                                <ul style={{margin: '8px 0', paddingLeft: '20px'}}>
                                    {errorResponse?.error?.map((error) => (
                                        <li key={error?.field} style={{marginBottom: '4px'}}>
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
    }

    const isFormChanged = () => {
        if (!originalUser || !systemUser) return false;
        return (
            originalUser.firstName !== systemUser.firstName ||
            originalUser.lastName !== systemUser.lastName ||
            originalUser.email !== systemUser.email ||
            originalUser.nic !== systemUser.nic ||
            originalUser.contact !== systemUser.contact ||
            (systemUser.provider === "LOCAL" && originalUser.password !== systemUser.password)
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

    const pad = (n:number) => String(n).padStart(2,'0');
    const fmt = (d:Date)=> `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

    const getGreetingByTime = (): string => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 18) return 'Good Afternoon';
        return 'Good Evening';
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
    }

    const closeBadgePopup = () => {
        setIsBadgePopupOpen(false);
        setSelectedBadgeDetails(null);
    };

    const scrollingText = " Agent Portal * Secure Connection * DATA Encrypted * System Opereational * Mission Status: Active * Clearance Level: Classified ";

    return (
        <React.Fragment>
            <div className="w-full p-5 gap-4 flex flex-col items-center justify-center fixed lg:sticky">
                <div>
                    <Alert message={"User profile fetching error..."} type="error"
                           visible={errorLoadingProfile === null ? true : false}
                           autoCloseDelay={3000} autoClose={true}
                           onClose={handlingCloseAlert}/>
                    <Alert message={alert.message} type={alert.type}
                           visible={alert.visible}
                           autoCloseDelay={3000} autoClose={true}
                           onClose={handlingCloseAlert}/>

                    <Alert message={"Archive concert loading error"} type="error"
                           visible={errorConcerts === null ? true : false}
                           autoCloseDelay={3000} autoClose={true}
                           onClose={handlingCloseAlert}/>

                    {/*<div className="profile-main">*/}
                    {/*    <div className="profile-info-row">*/}
                    {/*        <div className="avatar-container">*/}
                    {/*            <svg className="avatar-icon" viewBox="0 0 24 24" fill="none">*/}
                    {/*                <circle cx="12" cy="8" r="4" fill="white"/>*/}
                    {/*                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="white" strokeWidth="2" fill="white"/>*/}
                    {/*            </svg>*/}
                    {/*        </div>*/}

                    {/*        <div className="badge-container">*/}
                    {/*            {(() => {*/}
                    {/*                const uniqueBadges = new Set();*/}
                    {/*                const badgeData = [];*/}
                    {/*                const uniqueConcerts = groupByConcert(archiveConcert);*/}

                    {/*                uniqueConcerts.forEach(concert => {*/}
                    {/*                    let badgeType = null;*/}
                    {/*                    let badgeImage = null;*/}
                    {/*                    if (concert.concert === "Kuweni_1.1" ||*/}
                    {/*                        concert.concert === "Kuweni_1.2" ||*/}
                    {/*                        concert.concert === "Kuweni_1.3") {*/}
                    {/*                        badgeType = "kuweni1";*/}
                    {/*                        badgeImage = "images/badge/k1.png";*/}
                    {/*                    } else if (concert.concert === "Kuweni_2.0 1" ||*/}
                    {/*                        concert.concert === "Kuweni_2.0 2" ||*/}
                    {/*                        concert.concert === "Kuweni_2.0 3" ||*/}
                    {/*                        concert.concert === "Kuweni_2.0 4" ||*/}
                    {/*                        concert.concert === "Kuweni_2.0 5" ||*/}
                    {/*                        concert.concert === "Kuweni_2.1") {*/}
                    {/*                        badgeType = "kuweni2";*/}
                    {/*                        badgeImage = "images/badge/k2.png";*/}
                    {/*                    } else if (concert.concert === "Kuweni_Verse") {*/}
                    {/*                        badgeType = "kuweniVerse";*/}
                    {/*                        badgeImage = "images/badge/k3.png";*/}
                    {/*                    } else if (concert.concert === "yogeshwari") {*/}
                    {/*                        badgeType = "yogeshwari";*/}
                    {/*                        badgeImage = "images/badge/k4.png";*/}
                    {/*                    }*/}
                    {/*                    if (badgeType && !uniqueBadges.has(badgeType)) {*/}
                    {/*                        uniqueBadges.add(badgeType);*/}
                    {/*                        badgeData.push({*/}
                    {/*                            type: badgeType,*/}
                    {/*                            image: badgeImage,*/}
                    {/*                            concert: concert*/}
                    {/*                        });*/}
                    {/*                    }*/}
                    {/*                });*/}

                    {/*                const badges = [];*/}
                    {/*                for (let i = 0; i < 4; i++) {*/}
                    {/*                    if (badgeData[i]) {*/}
                    {/*                        badges.push(*/}
                    {/*                            <img*/}
                    {/*                                key={badgeData[i].type}*/}
                    {/*                                className="badge-item"*/}
                    {/*                                src={badgeData[i].image}*/}
                    {/*                                alt={`${badgeData[i].type} Badge`}*/}
                    {/*                                onClick={() => showBadge(badgeData[i].type)}*/}
                    {/*                            />*/}
                    {/*                        );*/}
                    {/*                    } else {*/}
                    {/*                        badges.push(*/}
                    {/*                            <div key={`placeholder-${i}`} className="badge-placeholder" />*/}
                    {/*                        );*/}
                    {/*                    }*/}
                    {/*                }*/}
                    {/*                return badges;*/}
                    {/*            })()}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="details-form">*/}
                    {/*        <div className="form-row">*/}
                    {/*            <span className="field-label">First Name</span>*/}
                    {/*            <span className="field-colon">:</span>*/}
                    {/*            <input*/}
                    {/*                className="field-value-profile"*/}
                    {/*                type="text"*/}
                    {/*                value={systemUser?.firstName || ""}*/}
                    {/*                onChange={handleUserInput}*/}
                    {/*                name="firstName"*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        <div className="form-row">*/}
                    {/*            <span className="field-label">Last Name</span>*/}
                    {/*            <span className="field-colon">:</span>*/}
                    {/*            <input*/}
                    {/*                className="field-value-profile"*/}
                    {/*                type="text"*/}
                    {/*                value={systemUser?.lastName || ""}*/}
                    {/*                onChange={handleUserInput}*/}
                    {/*                name="lastName"*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        <div className="form-row">*/}
                    {/*            <span className="field-label">Email Address</span>*/}
                    {/*            <span className="field-colon">:</span>*/}
                    {/*            <input*/}
                    {/*                className="field-value-profile"*/}
                    {/*                type="email"*/}
                    {/*                value={systemUser?.email || ""}*/}
                    {/*                onChange={handleUserInput}*/}
                    {/*                name="email"*/}
                    {/*                disabled*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        <div className="form-row">*/}
                    {/*            <span className="field-label">NIC Number</span>*/}
                    {/*            <span className="field-colon">:</span>*/}
                    {/*            <input*/}
                    {/*                className="field-value-profile"*/}
                    {/*                type="text"*/}
                    {/*                value={systemUser?.nic || ""}*/}
                    {/*                onChange={handleUserInput}*/}
                    {/*                name="nic"*/}
                    {/*                disabled*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        <div className="form-row">*/}
                    {/*            <span className="field-label">Contact Number</span>*/}
                    {/*            <span className="field-colon">:</span>*/}
                    {/*            <input*/}
                    {/*                className="field-value-profile"*/}
                    {/*                type="text"*/}
                    {/*                value={systemUser?.contact || ""}*/}
                    {/*                onChange={handleUserInput}*/}
                    {/*                name="contact"*/}
                    {/*                disabled*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        {systemUser?.provider === "LOCAL" && (*/}
                    {/*            <div className="form-row">*/}
                    {/*                <span className="field-label">Password</span>*/}
                    {/*                <span className="field-colon">:</span>*/}
                    {/*                <input*/}
                    {/*                    className="field-value-profile"*/}
                    {/*                    type="password"*/}
                    {/*                    value={systemUser?.password || ""}*/}
                    {/*                    onChange={handleUserInput}*/}
                    {/*                    name="password"*/}
                    {/*                    placeholder="**************"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        )}*/}

                    {/*        <button*/}
                    {/*            className="update-button"*/}
                    {/*            onClick={handleUpdate}*/}
                    {/*            disabled={!isFormChanged()}*/}
                    {/*        >*/}
                    {/*            Update*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    <div
                        className="w-full min-[375px]:overflow-y-auto gap-4 min-[375px]:h-[50vh] min-[414px]:h-[60vh] lg:h-full sticky p-[10px]">
                        <div className="flex items-center justify-center">
                            <div className="w-full">
                                <div className="flex flex-col md:flex-row gap-8 mb-8">
                                    <div className="flex-1">
                                        <div
                                            className="grid grid-cols-3 grid-rows-2 md:grid-cols-5 md:grid-rows-1 gap-4">
                                            <div
                                                className="w-[100px] h-[100px]  flex-shrink-0 border-2 border-solid border-green-400 rounded-lg flex items-center justify-center hover:border-green-300 transition-colors cursor-pointer"
                                            >
                                                <svg className="avatar-icon" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="8" r="4" fill="white"/>
                                                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="white"
                                                          strokeWidth="2" fill="white"/>
                                                </svg>
                                            </div>
                                            {[1, 2, 3, 4].map((item) => (
                                                <div
                                                    key={item}
                                                    className="w-[100px] h-[100px]  flex-shrink-0 border-2 border-dashed border-green-400 rounded-lg flex items-center justify-center hover:border-green-300 transition-colors cursor-pointer"
                                                >
                                                    <span className="text-green-400 text-4xl">+</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>


                                <div className="space-y-6">
                                    <RetroTextBox
                                        labelText="First Name :"
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={systemUser?.firstName}
                                        onChange={handleUserInput}
                                        placeholder=""
                                    />
                                    <RetroTextBox
                                        labelText="Last Name :"
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        value={systemUser?.lastName}
                                        onChange={handleUserInput}
                                        placeholder=""
                                    />

                                    <RetroTextBox
                                        labelText="Email :"
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={systemUser?.email}
                                        onChange={handleUserInput}
                                        placeholder=""
                                        disabled
                                    />


                                    <RetroTextBox
                                        labelText="Contact Number :"
                                        type="text"
                                        name="contact"
                                        id="contact"
                                        value={systemUser?.contact}
                                        onChange={handleUserInput}
                                        placeholder=""
                                        disabled
                                    />


                                    <RetroTextBox
                                        labelText="NIC/Passport :"
                                        type="text"
                                        name="nic"
                                        id="nic"
                                        value={systemUser?.nic}
                                        onChange={handleUserInput}
                                        placeholder=""
                                        disabled
                                    />

                                    {systemUser?.provider == "LOCAL" && <RetroTextBox
                                        labelText="Password :"
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={systemUser?.password}
                                        onChange={handleUserInput}
                                        placeholder=""
                                    />}


                                </div>


                                <div className="flex justify-end mt-8">
                                    <button
                                        className="update-button"
                                        onClick={handleUpdate}
                                        disabled={!isFormChanged()}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isBadgePopupOpen && selectedBadgeDetails && (
                            <div className="badge-popup-overlay" onClick={closeBadgePopup}>
                                <div className="badge-popup-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="badge-popup-header">
                                        <button className="badge-popup-close" onClick={closeBadgePopup}>
                                            ×
                                        </button>
                                    </div>
                                    <div className="badge-popup-body">
                                        <div className="badge-image-container">
                                            <img
                                                src={selectedBadgeDetails.image}
                                                alt={selectedBadgeDetails.title}
                                                className="badge-popup-image"
                                            />
                                        </div>
                                        <div className="badge-info">
                                            <h2 className="badge-title">{selectedBadgeDetails.title}</h2>
                                            <p className="badge-description">{selectedBadgeDetails.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <GlobalFooter
                    text={scrollingText}
                />
            </div>


        </React.Fragment>
    )
}

export default Profile;
