import "./Queue.css";
import React, {FC, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useLogin} from "../../../context/login.context";
import {CHECK_REQUEST_QUEUE, QUEUE_SUBSCRIPTION, REMOVE_USER_QUEUE,} from "../../../graphql/queries";
import {useLazyQuery, useMutation, useSubscription} from "@apollo/client";
import {IAPIResponse, IEnqueue, IQueueStatus,} from "../../../interfaces/data.interfaces";
import Alert from "../../../components/retro/Alert/Alert";
import {useWebSocketConnection} from "../../../graphql/WebSocketConnectionHook";
import {useAppContext} from "../../../context/app.context";

const Queue: FC = () => {
  const {connectionStatus, lastError} = useWebSocketConnection();
  const [queueRequest, setQueueRequest] = useState<IEnqueue | null>(null);
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const zoneId = searchParams.get("zoneId");
  const [wsError, setWsError] = useState<boolean>(false);
  const [wsDisconnected, setWsDisconnected] = useState<boolean>(false);
  const [qStatus, setQStatus] = useState<IQueueStatus>(null);
  const search = location.search;
  const navigate = useNavigate();
  const { user } = useLogin();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [enqueue, { error: enqueueError, loading: enqueueLoading }] =
      useLazyQuery(CHECK_REQUEST_QUEUE, { fetchPolicy: "network-only" });
  const { appContext } = useAppContext();
  const [subscriptionKey, setSubscriptionKey] = useState(0);
  const {
    data: queueStatus,
    loading: queueLoading,
    error: queueError,
  } = useSubscription(QUEUE_SUBSCRIPTION, {
    variables: {
      request: queueRequest,
    },
    skip: !queueRequest,
  });
  const [activeCount, setActiveCount] = useState(0);

  const isDesktop = () => {
    const userAgent = navigator.userAgent;
    return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(userAgent);
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setActiveCount(index);
      if (index >= 30) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [
    removeQueue,
    {
      data: queueSuccess,
      loading: queueRemoveLoading,
      error: queueRemoveError,
    },
  ] = useMutation(REMOVE_USER_QUEUE);

  useEffect(() => {
    const queueResponse = queueSuccess?.removeUserQueue as IAPIResponse;
    if (queueResponse?.data?.status === "success") {
      navigate("/menu", { replace: true });
    }
  }, [queueSuccess]);

  const handleRemoveQueue = () => {
    if (!user?.id) {
      console.error("User ID is missing");
      return;
    }
    if (
        !queueRequest?.zone?.eventDate ||
        !queueRequest?.zone?.zoneId ||
        !queueRequest?.zone?.eventId
    ) {
      console.error("Queue request data is incomplete:", queueRequest);
      return;
    }
    const queueId = `${user.id}-${queueRequest.zone.eventDate}-${queueRequest.zone.eventId}-${queueRequest.zone.zoneId}`;
    console.log("Generated queueId:", queueId);
    sessionStorage.removeItem("purchase_session_timer");

    removeQueue({
      variables: { queueId },
    });
  };

  useEffect(() => {
    switch (connectionStatus) {
      case "connecting":
        console.log("Connecting to WebSocket...");
        setWsError(false);
        setWsDisconnected(false);
        break;
      case "connected":
        console.log("WebSocket connected successfully!");
        setWsError(false);
        setWsDisconnected(false);
        break;
      case "disconnected":
        console.log("WebSocket disconnected - handle reconnection logic");
        setWsDisconnected(true);
        break;
      case "error":
        console.error("WebSocket error:", lastError);
        setWsError(true);
        break;
    }
  }, [connectionStatus, lastError]);

  useEffect(() => {
    if (queueStatus?.queueUpdate?.queueStatus?.status == "not_found") {
      navigate(`/menu`, {replace: true});
      return;
    }
    const qs = queueStatus?.queueUpdate?.queueStatus as IQueueStatus;
    setQStatus(qs);
    if (qs?.currentIndex <= 500) {
      setTimeout(() => {
       navigate(`/purchase${search}`);
      }, 3000);
    }
  }, [queueStatus]);

  useEffect(() => {
    if (!eventId || !user?.id) return;
    enqueue({
      variables: { requestId: user.id, eventId },
      onCompleted: (res) => {
        const response = res?.checkRequestQueue as IAPIResponse;
        const request: IEnqueue = {
          requestId: user.id,
          zone: {
            eventId: eventId,
            zoneId: response?.data?.queue?.zoneId,
            eventDate: response?.data?.queue?.eventDate,
          },
        };
        setQueueRequest(request);
      },
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    });
  }, [enqueue, eventId, user?.id]);

  const batchSize = (currentIndex: number): number => {
    if (currentIndex >= 100) {
      return currentIndex - 100;
    }
    return currentIndex || 0;
  };

  const handleNavigation = () => {
    if (!isDesktop()) {
      appContext.showSuccessDialog(
          "REQUIRED!!!",
          "For the complete Yogeshwari experience, switch to desktop view.\n" +
          "Some missions can only be unlocked on a larger screen."
      );
    } else {
      navigate("/landing-page");
    }
  };

  // Get zone display name
  const getZoneDisplayName = () => {
    if (zoneId === "zoneZ") return "Z";
    if (zoneId === "zoneA") return "A";
    return zoneId?.replace("zone", "") || "";
  };

  return (
      <React.Fragment>
        <Alert
            message={"Cannot create stream..."}
            visible={wsError}
            type={"error"}
        />

        <div className="flex flex-col items-center w-full">
          <div className="w-full">
            <div className={`queue-loader ${zoneId === "zoneZ" ? "blue" : "green"}`}>

              {/* Header Section */}
              <div className="queue-header">
                <div className="queue-title">
                  ZONE {getZoneDisplayName()}
                </div>
                <div className="queue-subtitle">
                  MISSION ACCESS QUEUE
                </div>
                <div className="queue-description">
                  STAY IN QUEUE UNTIL YOUR TURN
                </div>
              </div>

              {/* Status Box */}
              <div className="queue-box">
                <div className="queue-status-title">Queue Status</div>

                <div className="queue-info">
                  <div className="queue-total-seats">
                    Total Seats: 4000
                  </div>
                  <div className="queue-checking-position">
                    <span className="queue-arrow"></span>
                    Checking Queue Position....
                  </div>
                </div>

                <div className="queue-depth-info">
                  <div className="queue-depth-row">
                    <span className="queue-depth-label">Total Depth</span>
                    <span className="queue-depth-dashes">----------------</span>
                    <span className="queue-depth-value">
                      {qStatus?.totalQueue ?? 0}
                    </span>
                  </div>
                  <div className="queue-depth-row">
                    <span className="queue-depth-label">Your Depth</span>
                    <span className="queue-depth-dashes">----------------</span>
                    <span className="queue-depth-value">
                      {batchSize(qStatus?.currentIndex)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="queue-progress-container">
                {/*<div className="queue-progress-bar">*/}
                {/*  {Array.from({length: 30}).map((_, i) => (*/}
                {/*      <div*/}
                {/*          key={i}*/}
                {/*          className={`queue-progress-segment ${*/}
                {/*              (qStatus?.currentIndex <= 200 || i < 7) ? "queue-active" : ""*/}
                {/*          }`}*/}
                {/*      ></div>*/}
                {/*  ))}*/}
                {/*</div>*/}

                {/* Action Buttons */}
                <div className="horizontal-buttons">
                  <button

                      className="queue-button"
                      style={{color: "#ffffff"}}
                      onClick={handleNavigation}
                      type="button"
                      aria-label="Explore Yogeshwari"
                  >
                    <img
                        style={{filter: 'invert(0)'}}
                      src="images/icon/explore.svg"
                      alt="Explore"
                      width={20}
                      height={20}
                    />
                    <div className="label">Explore Yogeshwari</div>
                  </button>

                  <button
                    className="queue-button"
                    onClick={handleRemoveQueue}
                    type="button"
                    disabled={queueRemoveLoading}
                    aria-label={queueRemoveLoading ? "Removing from queue" : "Exit from queue"}
                  >
                    <img
                        style={{filter: 'invert(1)'}}
                        src="images/icon/close.svg"
                        alt="Exit"
                        width={20}
                        height={20}
                    />
                    <div className="label" style={{color: "#ffffff"}}>
                      {queueRemoveLoading ? "Removing..." : "Exit from queue"}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
  );
};

export default Queue;
