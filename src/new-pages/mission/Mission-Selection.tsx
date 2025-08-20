import React, { FC, useEffect, useState } from "react";
import "./Mission-Selection.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app.context";
import { IAPIResponse, IEvent, IZone } from "../../interfaces/data.interfaces";
import { CHECK_QUEUE_BY_REQUEST, GET_EVENTS, GET_TICKET_COUNTS } from "../../graphql/queries";
import { useLogin } from "../../context/login.context";
import { useLazyQuery, useQuery } from "@apollo/client";
import Alert, { AlertProps } from "../../components/retro/Alert/Alert";
import ReactGA from "react-ga4";
import MissionCard from "./MissionCard/MissionCard";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

/** Static fallback for local/dev preview */
const fallbackMissions: IEvent[] = [
  {
    id: "67d01ada3c5a4f220ef1f992",
    eventOrder: 1,
    configName: "event",
    eventName: "YOGESHWARI",
    eventId: "yogeshwari-1",
    eventDate: "2025-11-29",
    eventTime: "18:30",
    eventDescription: "First night of Yogeshwari Concert",
    eventLocation: "SLPA Beira New Yard",
    eventLocationLong: "Sri Lanka Ports Authority Beira New Yard",
    locationCode: "CMB",
    maxTicket: 4000,
    organizer: "Organizer",
    image: "https://i.ytimg.com/vi/1LrqYZtk0Hg/hq720.jpg",
    theme: "green",
    available: true,
    description: null,
    eventDateString: "NOV-29",
  },
  {
    id: "67dfe5fd2c1d252daf311534",
    eventOrder: 2,
    configName: "event",
    eventName: "YOGESHWARI",
    eventId: "yogeshwari-2",
    eventDate: "2025-11-30",
    eventTime: "18:30",
    eventDescription: "Second night of Yogeshwari Concert",
    eventLocation: "SLPA Beira New Yard",
    eventLocationLong: "Sri Lanka Ports Authority Beira New Yard",
    locationCode: "CMB",
    maxTicket: 4000,
    organizer: "Organizer",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/22/Charitha_at_Kuweni_Live_in_Concert.jpg",
    theme: "white",
    available: true,
    description: null,
    eventDateString: "NOV-30",
  },
];

const MissionSelection: FC = () => {
  const navigate = useNavigate();
  const { appContext } = useAppContext();
  const [concerts, setConcerts] = useState<IEvent[]>([]);
  const { user } = useLogin();

  // GraphQL queries and mutations
  const {
    data: eventsResponse,
    loading: loadingEvents,
    error: eventFetchError,
  } = useQuery(GET_EVENTS, { fetchPolicy: "network-only" });

  const [getQueueStatus, { error: queueError }] = useLazyQuery(CHECK_QUEUE_BY_REQUEST, {
    fetchPolicy: "network-only",
  });

  const [checkTicketCount, { loading: ticketCountResponseLoading }] = useLazyQuery(
    GET_TICKET_COUNTS,
    { fetchPolicy: "network-only" }
  );

  // Google Analytics tracking
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });
  }, []);

  // Handle events response
  useEffect(() => {
    const response = eventsResponse?.getEvents as IAPIResponse | undefined;

    if (response?.code === "CODE-900") {
      const events = (response.data as IEvent[]) ?? [];
      setConcerts([...events].sort((a, b) => a.eventOrder - b.eventOrder));
    } else if (response?.code === "CODE-901") {
      appContext.showErrorDialog("Error", response.error);
      setConcerts([]);
    }
  }, [eventsResponse, appContext]);

  // Validate ticket count before proceeding
  const validateTicketCount = async (zone: IZone): Promise<boolean> => {
    try {
      const { data } = await checkTicketCount({
        variables: { requestId: user?.id, eventId: zone?.eventId },
      });
      const response = data?.getTicketCount as IAPIResponse;
      const ticketCount = response?.data?.ticketCount ?? 0;

      if (response?.code === "CODE-404" && ticketCount >= 4) {
        appContext.showErrorDialog(
          "Ticket Limit Reached",
          "You've already reached the maximum number (4) of tickets allowed."
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Ticket check failed:", error);
      return false;
    }
  };

  // Handle concert/mission selection
  const handleClickConcert = async (concert: IEvent): Promise<void> => {
    if (!user) return;
    
    // Create zone object from concert data
    const zone: IZone = {
      eventId: concert.eventId,
      eventName: concert.eventName,
      eventDate: concert.eventDate,
      eventTime: concert.eventTime,
      locationCode: concert.locationCode,
    } as IZone;
    
    const isInvalid = await validateTicketCount(zone);
    if (isInvalid) return;

    getQueueStatus({
      variables: { requestId: user.id, eventId: zone.eventId },
      onCompleted: (res) => {
        const response = res?.checkRequestQueue as IAPIResponse;
        if (response?.code === "CODE-402") {
          const path = response?.data?.path as string | undefined;

          if (path?.includes("/queue")) {
            localStorage.setItem("zoneId", response?.data?.queue?.zoneId);
            localStorage.setItem("eventId", response?.data?.queue?.eventId);
            localStorage.setItem("eventDate", response?.data?.queue?.eventDate);
            navigate(path);
          } else if (path?.includes("/zones")) {
            navigate(`/zones?eventId=${zone.eventId}`);
          }
        } else if (response?.code === "CODE-403") {
          appContext.showErrorDialog("Error", response.error);
        }
      },
      onError: (error) => {
        appContext.showErrorDialog("Enqueue Error", JSON.stringify(error));
      },
    });
  };

  // Skeleton loading component
  const MissionSkeleton: React.FC = () => (
    <div className="mission-skeleton">
      <div className="mission-skeleton-text">Loading Mission...</div>
    </div>
  );

  // Use either fetched concerts or fallback missions
  const missionsToRender = concerts?.length ? concerts : fallbackMissions;

  // Generate scrolling footer text
  const scrollingText = `**** CHOOSE YOUR MISSION **** AGENT ${user?.lastName} **** SELECT YOUR DEPLOYMENT ZONE **** MISSION BRIEFING READY **** `;

  return (
    <>
      {/* Page heading */}
      <div className="mission-selection-page-heading">
        <h1>Mission Selection</h1>
      </div>

      {/* Main page container */}
      <main className="mission-selection-page-container" role="main">
        
        {/* Main content */}
        <div className="mission-selection-content-main">
          
          {/* Alert messages */}
          <Alert 
            message="Enqueue error occurred." 
            visible={!!queueError} 
            type="error" 
            autoCloseDelay={5000}
            autoClose={true}
          />
          <Alert 
            message="Missions fetch error." 
            visible={!!eventFetchError} 
            type="error" 
            autoCloseDelay={5000}
            autoClose={true}
          />
          
          {/* Mission cards section */}
          <section className="mission-card-viewer">
            
            {/* Mission label for mobile */}
            <div className="mission-card-viewer-label">
              <h2>Available Missions</h2>
            </div>

            {/* Mission cards grid */}
            <div className="mission-cards-grid">
              {loadingEvents ? (
                <>
                  <MissionSkeleton />
                  <MissionSkeleton />
                </>
              ) : (
                missionsToRender.map((event, index) => {
                  return (
                    <MissionCard
                      key={event?.id || `mission-${index}`}
                      concert={event}
                      onEnter={handleClickConcert}
                      loader={ticketCountResponseLoading}
                    />
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Global scrolling footer */}
      <GlobalFooter text={scrollingText} />
    </>
  );
};

export default MissionSelection;