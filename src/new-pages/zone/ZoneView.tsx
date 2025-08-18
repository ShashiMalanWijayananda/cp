import React, {FC, useCallback, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppContext} from "../../context/app.context";
import {useLogin} from "../../context/login.context";
import {ENQUEUE_LIST, FETCH_ZONE_CONFIGS} from "../../graphql/queries";
import {useMutation, useQuery} from "@apollo/client";
import {IAPIResponse, IEnqueue, IZone,} from "../../interfaces/data.interfaces";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

const ZoneView: FC = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [selectedZone, setSelectedZone] = useState(null);
  const {appContext} = useAppContext();
  const navigate = useNavigate();
  const { user } = useLogin();
  const [zones, setZones] = useState<IZone[]>([]);
  const [
    enqueue,
    { loading: enqueueLoading, data: enqueueResponse, error: enqueueError },
  ] = useMutation(ENQUEUE_LIST);
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paragraphs = [
    `****`,
    `Agent ${user?.lastName}`,
    `Click a zone to enter the queue. ${
        !isMobile ? "Press ESC to cancel" : ""
    }`,
    "****",
  ];

  const {
    data: zoneConfigData,
    loading: zonesLoading,
    error: zonesError,
  } = useQuery(FETCH_ZONE_CONFIGS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const response = zoneConfigData?.getZoneConfigs as IAPIResponse;
    if (response?.code === "CODE-700") {
      setZones(response?.data?.zones);
    }
  }, [zoneConfigData]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        navigate("/mission", { replace: true });
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleZoneSelect = useCallback(
      async (zone: IZone) => {
        if (user === null) return;
        setSelectedZone(zone);
        localStorage.setItem("zoneId", zone?.zoneId);
        localStorage.setItem("eventId", zone?.eventId);
        localStorage.setItem("eventDate", zone?.eventDate);
        const request: IEnqueue = {
          requestId: user.id,
          zone: {
            zoneId: zone.zoneId,
            eventDate: zone.eventDate,
            eventId: zone.eventId,
          },
        };

        enqueue({
          variables: {request},
          onError: (error) => {
            console.error(error);
          },
        });
      },
      [user, enqueue, navigate, appContext]
  );

  useEffect(() => {
    const response = enqueueResponse?.enqueue as IAPIResponse;
    if (response?.code === "CODE-400") {
      if (response.data?.path?.includes("/purchase")) {
        navigate(response.data?.path, { replace: true });
      } else if (response.data?.path?.includes("/queue")) {
        navigate(response.data?.path, { replace: true });
      }
    } else if (response?.code === "CODE-405") {
      appContext.showErrorDialog("Enqueue Error", response?.error);
    }
  }, [enqueueResponse]);

  // Sort zones for consistent ordering
  const sortedZones = [...(zones || [])].sort((a, b) =>
      a?.zoneId?.localeCompare(b?.zoneId)
  );

  // Debug: Log zone data
  console.log("Zones data:", zones);

  const scrollingText =
      "Choose your zone - Your zone determines what you'll see — and what you won't  *** Choose your zone - Your zone determines what you'll see — and what you won't  *** ";

  return (
      <React.Fragment>
        <div className="w-full h-auto p-5 gap-4 fixed flex flex-col left-0 right-0 items-center justify-center ">

          {/*  <div className="zone-view">*/}
          {/*    <Alert*/}
          {/*        message={"Enqueue error....."}*/}
          {/*        visible={enqueueError === null ? true : false}*/}
          {/*        type={"error"}*/}
          {/*    />*/}
          {/*    <div className="h-[65vh] overflow-y-auto p-4 space-y-4">*/}
          {/*      <div className="zone-card-viewer">*/}

          {/*        {isMobile ? (*/}
          {/*            <>*/}
          {/*          {sortedZones[0] && (*/}
          {/*              <ZoneCard zone={sortedZones[0]} onClick={handleZoneSelect}/>*/}
          {/*          )}*/}
          {/*          <div className="stage">STAGE</div>*/}
          {/*          {sortedZones[1] && (*/}
          {/*              <ZoneCard zone={sortedZones[1]} onClick={handleZoneSelect}/>*/}
          {/*          )}*/}
          {/*          {sortedZones.slice(2).map((zone, index) => (*/}
          {/*              <ZoneCard*/}
          {/*                  key={zone?.id || `zone-${index + 2}`}*/}
          {/*                  zone={zone}*/}
          {/*                  onClick={handleZoneSelect}*/}
          {/*              />*/}
          {/*          ))}*/}
          {/*        </>*/}
          {/*    ) : (*/}
          {/*        <>*/}
          {/*          {sortedZones.map((zone, index) => (*/}
          {/*              <React.Fragment key={zone?.id || index}>*/}
          {/*                <ZoneCard zone={zone} onClick={handleZoneSelect}/>*/}
          {/*                {index === 0 && <div className="stage">STAGE</div>}*/}
          {/*              </React.Fragment>*/}
          {/*          ))}*/}
          {/*        </>*/}
          {/*        )}*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div
              className="w-full gap-4 min-[375px]:overflow-y-auto min-[375px]:h-[50vh] min-[414px]:h-[60vh] lg:h-full sticky  flex flex-col items-center justify-center ">
            <div
                className="grid grid-cols-1 grid-rows-3 gap-4 lg:grid-cols-3 lg:grid-rows-1 w-full md:w-1/2 place-items-center">
              {sortedZones.map((zone, index) => (
                  <React.Fragment key={zone?.id || index}>
                    <div onClick={() => zone?.available && handleZoneSelect(zone)}
                         className={`${zone?.available ? 'cursor-pointer' : 'cursor-not-allowed'} w-full h-[150px] flex flex-col items-center justify-center ${
                             zone?.zoneId === "zoneA" ? 'bg-brand-rose' : 'bg-brand-purple'
                         }`}>
              <span
                  className="text-[10px] min-[375px]:text-xl  md:text-2xl lg:text-3xl text-brand-forest font-medium font-jersey25">{zone?.zoneId?.replace("zone", "ZONE ") || "ZONE"}</span>
                      {zone?.available ? <span
                              className="text-[10px] min-[375px]:text-xl min-[1024px]:text-xl md:text-2xl lg:text-3xl font-medium text-brand-forest font-jersey25"> Available Slots:{" "} {zone?.remainingTicket?.toString()?.padStart(4, "0") || "0000"}</span>
                          : <span
                              className="text-[10px] min-[375px]:text-xl md:text-2xl lg:text-3xl font-medium text-brand-forest font-jersey25">SOLD OUT</span>}
                    </div>
                    {index === 0 && <div
                        className="border border-brand-lightGreen w-full flex items-center justify-center h-[80px] lg:h-[150px] text-[10px] min-[375px]:text-xl md:text-2xl lg:text-3xl font-medium font-jersey25 text-white">STAGE
                    </div>}

                  </React.Fragment>
              ))}

            </div>
          </div>
          <GlobalFooter
              text={scrollingText}
          />
        </div>
      </React.Fragment>
  );
};

export default ZoneView;
