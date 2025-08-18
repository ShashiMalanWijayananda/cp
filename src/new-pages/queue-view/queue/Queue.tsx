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
    }, 1000); // 300ms per segment
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
        // window.location.reload();
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
  };

  const handleNavigation = () => {
    if (!isDesktop()) {
      appContext.showSuccessDialog(
          "REQUIRED!!!",
          "For the complete Yogeshwari experience, switch to desktop view.\n" +
          "Some missions can only be unlocked on a larger screen."
      );
    } else {
      navigate("/landing-page")
    }
  };
  return (
      <React.Fragment>
        {/*<Alert message={"Establishing stream..."} visible={queueLoading} type={"info"}/>*/}
        <Alert
            message={"Cannot create stream..."}
            visible={wsError}
            type={"error"}
        />
        {/*<Alert message={"Stream has been disconnected..."} visible={wsDisconnected} type={"warning"}/>*/}
        <div className="flex flex-col items-center w-full">
          <div className="w-full">
            <div className={`queue-loader ${zoneId === "zoneZ" ? "blue" : "green"}`}>
              {/* <div className="mobile-logo" aria-label="Yogeshwari logo">
                                  <Logo/>
                                </div> */}
              <div className={"queue-header"}>
                <div className={"queue-title"}>ZONE {zoneId?.split("zone")}</div>
                <div className={"queue-subtitle"}>MISSION ACCESS QUEUE</div>
                <div className={"queue-description"}>
                  STAY IN QUEUE UNTIL YOUR TURN
                </div>
              </div>

              <div className={"queue-box"}>
                <div className={"queue-status-title"}>QUEUE STATUS</div>
                <div className={"queue-info"}>
                  {/*<div className={"queue-total-seats"}>Total Seats: 4000</div>*/}
                  <div className={"queue-checking-position"}>
                    <span className={"queue-arrow"}></span> Checking Queue
                    Position....
                  </div>
                </div>

                <div className={"queue-depth-info"}>
                  <div className={"queue-depth-row"}>
                    <span className={"queue-depth-label"}>Total Depth</span>
                    <span className={"queue-depth-dashes"}>----------------</span>
                    <span className={"queue-depth-value"}>
                {qStatus?.totalQueue ?? 0}
              </span>
                  </div>
                  <div className={"queue-depth-row"}>
                    <span className={"queue-depth-label"}>Your Depth</span>
                    <span className={"queue-depth-dashes"}>----------------</span>
                    <span className={"queue-depth-value"}>
                {batchSize(qStatus?.currentIndex) ?? 0}
              </span>
                  </div>
                </div>
              </div>

              <div className={"queue-progress-container"}>
                <div className="queue-progress-bar">
                  {Array.from({length: 30}).map((_, i) => (
                      <div
                          key={i}
                          className={`queue-progress-segment ${
                              qStatus?.currentIndex <= 200 ? "queue-active" : ""
                          }`}
                      ></div>
                  ))}
                </div>

                {/*<div className="queue-options">*/}
                {/*    <div className="queue-buttons hide-on-mobile">*/}
                {/*        <img src="images/icon/explore.svg" className="btn-image"/>*/}
                {/*        <span>Explore Yogeshwari</span>*/}
                {/*    </div>*/}

                {/*    <div className="queue-buttons" onClick={handleRemoveQueue}>*/}
                {/*        <img src="images/icon/bin.png" className="btn-image"/>*/}
                {/*        <span>{queueRemoveLoading ? "Removing..." : "Exit From Queue"}</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="horizontal-buttons">
                  <button className="queue-button" onClick={handleNavigation}>
                    <img className="bicon" src="images/icon/explore.svg" width={30}/>
                    <div className="label">Explore Yogeshwari</div>
                  </button>

                  <button className="queue-button" onClick={handleRemoveQueue}>
                    <img className="cicon" src="images/icon/close.svg" width={30}/>
                    <div className="label">
                      {queueRemoveLoading ? "Removing..." : "Exit From Queue"}
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
