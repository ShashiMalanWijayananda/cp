import "./Mission-Selection.css";
import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../context/app.context";
import {IAPIResponse, IEvent, IZone} from "../../interfaces/data.interfaces";
import {CHECK_QUEUE_BY_REQUEST, GET_EVENTS, GET_TICKET_COUNTS,} from "../../graphql/queries";
import {useLogin} from "../../context/login.context";
import {useLazyQuery, useQuery} from "@apollo/client";
import Alert from "../../components/retro/Alert/Alert";
import ReactGA from "react-ga4";
import MissionCard from "./MissionCard/MissionCard";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

const missions = [
  {
    id: "67dfe5fd2c1d252daf311534",
    eventOrder: 2,
    configName: "event",
    eventName: "YOGESHWARI",
    eventId: "yogeshwari-2",
    eventDate: "2025-11-30",
    eventTime: "19:00",
    eventDescription: "Sample Description",
    eventLocation: "SLPA Beira New Yard",
    eventLocationLong: "Sri Lanka Ports Authority Beira New Yard",
    locationCode: "CMB",
    maxTicket: 4000,
    organizer: "Organizer",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/22/Charitha_at_Kuweni_Live_in_Concert.jpg",
    theme: "green",
    available: true,
    description: null,
    eventDateString: "NOV-30",
  },
  {
    id: "67d01ada3c5a4f220ef1f992",
    eventOrder: 1,
    configName: "event",
    eventName: "YOGESHWARI",
    eventId: "yogeshwari-1",
    eventDate: "2025-11-29",
    eventTime: "19:00",
    eventDescription: "Sample Description",
    eventLocation: "SLPA Beira New Yard",
    eventLocationLong: "Sri Lanka Ports Authority Beria New Yard",
    locationCode: "CMB",
    maxTicket: 4000,
    organizer: "Organizer",
    image:
      "https://i.ytimg.com/vi/1LrqYZtk0Hg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDUg6R4aw2uKWYWrOj9x3vOggXjGQ",
    theme: "white",
    available: true,
    description: null,
    eventDateString: "NOV-29",
  },
];

const scrollingText =
  "*** Choose your mission *** Choose your mission *** Choose your mission *** Choose your mission *** Choose your mission *** Choose your mission *** Choose your mission  *** Choose your mission *** Choose your mission ***";

const MissionSelection: FC = () => {
  const navigate = useNavigate();
  const { appContext } = useAppContext();
  const [concerts, setConcerts] = useState<IEvent[]>([]);
  const {
    data: eventsResponse,
    loading: loadingEvents,
    error: eventFetchError,
  } = useQuery(GET_EVENTS, { fetchPolicy: "network-only" });

  const [getQueueStatus, { loading: loadingQueue, error: queueError }] =
    useLazyQuery(CHECK_QUEUE_BY_REQUEST, { fetchPolicy: "network-only" });
  const { user } = useLogin();
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });

  useEffect(() => {
    const response = eventsResponse?.getEvents as IAPIResponse;
    console.log("Events ", eventsResponse)
    if (response?.code === "CODE-900") {
      const events = response?.data as IEvent[];

      setConcerts(
          [...events]?.sort((a, b) => a?.eventOrder - b?.eventOrder) ?? []
      );
    } else if (response?.code === "CODE-901") {
      appContext.showErrorDialog("Error", response.error);
    }
  }, [eventsResponse]);

  const [
    checkTicketCount,
    {
      data: ticketCountResponse,
      loading: ticketCountResponseLoading,
      error: ticketCountResponseLoadingError,
    },
  ] = useLazyQuery(GET_TICKET_COUNTS, {
    fetchPolicy: "network-only",
  });

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
          "You've already reached the maximum number(4) of tickets allowed."
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error("Ticket check failed:", error);
      return false;
    }
  };

  const handleClickConcert = async (zone: IZone) => {
    if (user === null) return;
    const isInvalid = await validateTicketCount(zone);
    if (isInvalid) return;

    getQueueStatus({
      variables: { requestId: user.id, eventId: zone.eventId },
      onCompleted: (res) => {
        const response = res?.checkRequestQueue as IAPIResponse;

        if (response?.code === "CODE-402") {
          const path = response?.data?.path;

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

  return (
    <React.Fragment>
      <div className="w-full h-auto p-5 gap-4 fixed flex flex-col left-0 right-0 items-center justify-center ">


        <Alert
            message={"Communication error..."}
            visible={queueError === null ? true : false}
            type={"error"}
        />

        <Alert
            message={"Missions fetch error..."}
            visible={eventFetchError === null ? true : false}
            type={"error"}
        />


        <div
            className="grid grid-cols-1 md:grid-cols-2 md:w-1/2 min-[375px]:overflow-y-auto  gap-4 min-[375px]:h-[60vh] min-[414px]:h-[60vh] lg:h-full sticky">
          {concerts &&
              concerts?.length > 0 &&
              concerts?.map((event, index) => (
                  <MissionCard
                      key={event?.id || index}
                      concert={event}
                      onEnter={handleClickConcert}
                      loader={ticketCountResponseLoading}
                  />
              ))}
        </div>
        <GlobalFooter
            text={scrollingText}
        />
      </div>

    </React.Fragment>
  );
};

export default MissionSelection;
