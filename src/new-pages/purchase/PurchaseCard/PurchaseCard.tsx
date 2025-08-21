import React, {FC, useEffect, useRef, useState} from "react";
import "./PurchaseCard.css";
import "../../../App.css";

import {
  APPLY_COUPON,
  CHECK_REQUEST_QUEUE,
  FETCH_EVENT_BY_ID,
  FETCH_ZONE_CONFIG,
  GET_TICKET_COUNTS,
  REMOVE_USER_QUEUE,
} from "../../../graphql/queries";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {IAPIResponse, IEnqueue, IEvent, IZone,} from "../../../interfaces/data.interfaces";
import Alert from "../../../components/retro/Alert/Alert";
import {useLogin} from "../../../context/login.context";
import ReactGA from "react-ga4";
import {useNavigate} from "react-router-dom";
import GlobalFooter from "../../../components/GlobalFooter/GlobalFooter";
import {useAppContext} from "../../../context/app.context";

interface PurchaseCardProps {
  eventId: string;
  zoneId: string;
  onTap: (couponCode, numberOfTicket, totalPrice) => void;
}

const PurchaseCard: FC<PurchaseCardProps> = ({ onTap, eventId, zoneId }) => {
  const formatAmount = (n: number) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
  const getThemeClass = (zid?: string, zname?: string) => {
    const name = (zname || "").toLowerCase();
    const id = (zid || "").toLowerCase();
    if (id === "zonea" || id === "a" || name.includes("zone a")) return "blue";
    if (id === "zonez" || name.includes("zone z")) return "blue";
    return "green";
  };
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const navigation = useNavigate();
  const [ticketCount, setTicketCount] = useState<number>(1);
  const { user } = useLogin();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [couponResponse, setCouponResponse] = useState<string>("");
  const [zone, setZone] = useState<IZone>(null);
  const [event, setEvent] = useState<IEvent | null>(null);
  const [tc, setTc] = useState<number>(0);
  const [queueRequest, setQueueRequest] = useState<IEnqueue | null>(null);
  const [couponResponseType, setCouponResponseType] = useState<"success" | "error" | "">("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [createAt, setCreateAt] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState(0);
  const maxMinutes = 15;
  const maxMilliseconds = maxMinutes * 60 * 1000;
  const {appContext} = useAppContext();
  useEffect(() => {
    if (!createAt) return;
    const currentTime = Date.now();
    const elapsedTime = currentTime - createAt;
    const remainingTime = Math.max(0, maxMilliseconds - elapsedTime);

    setTimeLeft(remainingTime);
  }, [createAt, maxMilliseconds]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1000;
        return newTime <= 0 ? 0 : newTime;
      });
      if (minutes == 0) {
        //navigate("/menu", {replace: true})
        if ((window as any).payhere) {
          (window as any).payhere.onDismissed = function onDismissed() {
            console.log("Payment dismissed");
          };
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const [
    applyCoupon,
    {
      loading: loadinCoupon,
      data: couponApplyResponse,
      error: couponApplyError,
    },
  ] = useMutation(APPLY_COUPON, {fetchPolicy: "network-only"});

  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });

  const [
    loadZoneConfig,
    { loading: loadingZone, data: zoneConfig, error: zoneConfigError },
  ] = useLazyQuery(FETCH_ZONE_CONFIG, {
    fetchPolicy: "network-only",
  });

  const [enqueue, { error: enqueueError, loading: enqueueLoading }] =
      useLazyQuery(CHECK_REQUEST_QUEUE, { fetchPolicy: "network-only" });

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
    if (!eventId || !user?.id) return;
    appContext.showSuccessDialog("MISSION ACCESS GRANTED!", "Agent, your access has been approved. You now have 15 minutes to secure your mission ticket.");
    enqueue({
      variables: {requestId: user.id, eventId},
      onCompleted: (res) => {
        const response = res?.checkRequestQueue as IAPIResponse;
        if (response?.code === "CODE-402") {
          if (response?.data?.queue?.expired) {
            navigate("/menu", {replace: true})
          } else {
            setCreateAt(response?.data?.queue?.createAt as number)
            const request: IEnqueue = {
              requestId: user.id,
              zone: {
                eventId: eventId,
                zoneId: response?.data?.queue?.zoneId,
                eventDate: response?.data?.queue?.eventDate,
              },
            };
            setQueueRequest(request);
          }
        }
      },
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    });
  }, [enqueue, eventId, user?.id]);

  const {
    data: eventConfigData,
    loading: eventConfigLoading,
    error: eventConfigError,
  } = useQuery(FETCH_EVENT_BY_ID, {
    fetchPolicy: "network-only",
    variables: { eventId: zone?.eventId },
    skip: !zone,
  });

  const {
    data: ticketCountResponse,
    loading: ticketCountResponseLoading,
    error: ticketCountResponseLoadingError,
  } = useQuery(GET_TICKET_COUNTS, {
    variables: { requestId: user?.id, eventId: zone?.eventId },
    fetchPolicy: "network-only",
    skip: !zone,
  });

  useEffect(() => {
    const ticketCResponse = ticketCountResponse?.getTicketCount as IAPIResponse;
    if (ticketCResponse?.code === "CODE-404") {
      setTc(ticketCResponse?.data?.ticketCount as number);
    }
  }, [ticketCountResponse]);

  useEffect(() => {
    if (!eventConfigData) return;
    const response = eventConfigData?.getEventDetailByEventId as IAPIResponse;
    if (response?.code === "CODE-1000") {
      const eventConfig = response?.data as IEvent;
      setEvent(eventConfig);
    } else if (response?.code === "CODE-1001") {
      // Handle error
    }
  }, [eventConfigData]);

  useEffect(() => {
    loadZoneConfig({
      variables: { eventId, zoneId },
      onCompleted: (res) => {
        const response = res?.getZoneConfig as IAPIResponse;
        if (response.code === "CODE-700") {
          setZone(response.data);
        } else if (response?.code === "CODE-701") {
          // Handle error
        }
      },
      onError: (error) => {
        // Handle error
      },
    });
  }, []);

  const totalPrice = ticketCount * zone?.price;
  const grandTotal = totalPrice - discountAmount;

  useEffect(() => {
    const response = couponApplyResponse?.applyCoupon as IAPIResponse;
    if (response?.code === "CODE-2002") {
      const discount = response?.data?.discount as number;
      setDiscountPercentage(discount);
      setDiscountAmount(zone?.price * (discount / 100));
      setCouponResponse(`Discount Code Verified: ${discount}% off applied`);
      setCouponResponseType("success");
      setIsCouponApplied(true);
    } else if (response?.code === "CODE-2004") {
      setCouponResponse("Invalid or expired discount code");
      setCouponResponseType("error");
      setIsCouponApplied(false);
      setDiscountAmount(0);
      setDiscountPercentage(0);
    }
  }, [couponApplyResponse, totalPrice]);

  useEffect(() => {
    if (isCouponApplied && discountPercentage > 0) {
      setDiscountAmount(zone.price * (discountPercentage / 100));
    } else {
      setDiscountAmount(0);
    }
  }, [ticketCount, totalPrice, isCouponApplied, discountPercentage]);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponResponse("");
    setCouponResponseType("");

    applyCoupon({
      variables: { couponId: couponCode },
    })
        .then((response) => {
          console.log("Coupon applied successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error applying coupon:", error.message);
          setCouponResponse("Error processing discount code");
          setCouponResponseType("error");
          setIsCouponApplied(false);
          setDiscountAmount(0);
          setDiscountPercentage(0);
        });
  };

  useEffect(() => {
    const queueResponse = queueSuccess?.removeUserQueue as IAPIResponse;
    if (queueResponse?.data?.status === "success") {
      navigate("/menu", { replace: true });
    }
  }, [queueSuccess]);

  const handleIncrement = () => {
    setTicketCount((prev) => Math.min(4 - tc, prev + 1));
  };

  const handleDecrement = () => {
    setTicketCount((prev) => Math.max(1, prev - 1));
  };

  const handlePurchase = () => {
    onTap(couponCode, ticketCount, grandTotal);
  };

  const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    if (isCouponApplied) {
      setCouponResponse("");
      setCouponResponseType("");
      setIsCouponApplied(false);
      setDiscountAmount(0);
      setDiscountPercentage(0);
    }
  };

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
    removeQueue({
      variables: { queueId },
    });
  };

  const scrollingText = `!!WARNING!! This session will end within ${String(minutes).padStart(2, '0')} Mins ${String(seconds).padStart(2, '0')} Secs. Complete purchase before timeout.`;

  return (
      <React.Fragment>
        <div className="p-view-new">

          {/* Alert Components */}
          <Alert
              message={"Cannot process discount code"}
              visible={!!couponApplyError}
              type={"error"}
              autoClose={true}
              autoCloseDelay={3000}
          />

          {/* Main Purchase Card */}
          <div className={`purchase-card ${getThemeClass(zoneId, zone?.name)}`}>

            {/* Card Header - Zone Name */}
            <div className="purchase-card-header">
              <span>{zone?.name}</span>
            </div>

            {/* Main Card Box */}
            <div className="purchase-card-box">

              {/* Box Header - Event Name */}
              <div className="purchase-card-box-header">
                <span>{event?.eventName ?? ""}</span>
              </div>

              {/* Box Content */}
              <div className="purchase-card-box-content">
                <div className="purchase-card-inner-box">
                  <div className="inner-box-content">

                    {/* Ticket Selection Label */}
                    <div className="content-text">Select Tickets:</div>

                    {/* Ticket Counter */}
                    <div className="ticket-counter">
                      <button
                          className="circle-button"
                          onClick={handleDecrement}
                          aria-label="Decrease ticket count"
                      >
                        <img src="/images/icon/negative.svg" alt="Decrease"/>
                      </button>
                      <div className="number-of-ticket">{ticketCount}</div>
                      <button
                          className="circle-button"
                          onClick={handleIncrement}
                          disabled={
                            ticketCount >= zone?.remainingTicket || tc >= 4
                                ? true
                                : false
                          }
                          aria-label="Increase ticket count"
                      >
                       <img src="/images/icon/plus.svg" alt="Increase"/>
                      </button>
                    </div>

                    {/* Coupon Code Input */}
                    <div className="content-row">
                      <input
                          placeholder="Discount Code (Optional)"
                          value={couponCode}
                          onChange={handleCouponCodeChange}
                          aria-label="Discount code input"
                      />
                      <button
                          className="custom-button apply-btn"
                          onClick={handleApplyCoupon}
                          disabled={loadinCoupon || !couponCode}
                          aria-label="Apply discount code"
                      >
                        {loadinCoupon ? "Verifying..." : "APPLY"}
                      </button>
                    </div>

                    {/* Coupon Response Message */}
                    {couponResponse && (
                        <div className="content-row">
                          <div
                              className={`content-text ${
                                  couponResponseType === "success"
                                      ? "success-text"
                                      : "error-text"
                              }`}
                          >
                            {couponResponse}
                          </div>
                        </div>
                    )}

                    {/* Remaining Slots Warning */}
                    {zone?.remainingTicket <= 4 && (
                        <div className="content-row">
                          <div className="content-text">Remaining Slots:</div>
                          <div className="content-text">
                            {zone?.remainingTicket - ticketCount}
                          </div>
                        </div>
                    )}

                    {/* Price per Entry */}
                    <div className="content-row">
                      <div className="content-text">Price per Entry</div>
                      <div className="content-text">
                        {formatAmount(zone?.price ?? 0)}
                      </div>
                    </div>

                    {/* Mission Discount (if applied) */}
                    {isCouponApplied && discountAmount > 0 && (
                        <div className="content-row">
                          <div className="content-text">
                            Mission Discount ({discountPercentage}%)
                          </div>
                          <div className="content-text">
                            -{discountAmount.toFixed(2)} LKR
                          </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="content-row-dot"></div>

                    {/* Total Cost */}
                    <div className="content-row">
                      <div className="content-text">Total Mission Cost</div>
                      <div className="content-text">
                        {formatAmount(Math.round(grandTotal))}
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <button
                        className="purchase-btn custom-button"
                        disabled={
                          ticketCount > zone?.remainingTicket || tc >= 4
                              ? true
                              : false
                        }
                        onClick={handlePurchase}
                        aria-label="Confirm mission entry purchase"
                    >
                      Confirm Mission Entry
                    </button>

                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="horizontal-buttons">
              <button
                  className="queue-button"
                  onClick={handleRemoveQueue}
                  aria-label="Abort mission queue"
              >
                <img className="cicon" src="/images/icon/close.svg" width={30} alt="Close"/>
                <div className="label">
                  {queueRemoveLoading ? "Aborting..." : "Abort Mission Queue"}
                </div>
              </button>
            </div>

          </div>

        </div>

        {/* Global scrolling footer message */}
        <GlobalFooter text={scrollingText} />

      </React.Fragment>
  );
};

export default PurchaseCard;
