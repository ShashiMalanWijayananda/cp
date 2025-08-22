import React, { FC, useCallback, useEffect, useState } from "react";
import "./ZoneView.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/app.context";
import { useLogin } from "../../context/login.context";
import { ENQUEUE_LIST, FETCH_ZONE_CONFIGS } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { IAPIResponse, IEnqueue, IZone } from "../../interfaces/data.interfaces";
import Alert, { AlertProps } from "../../components/retro/Alert/Alert";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

const ZoneView: FC = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [selectedZone, setSelectedZone] = useState<IZone | null>(null);
  const { appContext } = useAppContext();
  const navigate = useNavigate();
  const { user } = useLogin();
  const [zones, setZones] = useState<IZone[]>([]);

  const [enqueue, { loading: enqueueLoading, data: enqueueData, error: enqueueError }] = useMutation(ENQUEUE_LIST);

  const {
    data: zoneConfigData,
    loading: zonesLoading,
    error: zonesError,
  } = useQuery(FETCH_ZONE_CONFIGS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "network-only",
  });

  // Handle zones data
  useEffect(() => {
    const response = zoneConfigData?.getZoneConfigs as IAPIResponse;
    if (response?.code === "CODE-700") {
      setZones(response?.data?.zones);
    }
  }, [zoneConfigData]);

  // Handle ESC key to go back
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        navigate("/mission", { replace: true });
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [navigate]);

  // Handle enqueue response
  useEffect(() => {
    const response = enqueueData?.enqueue as IAPIResponse;
    if (response?.code === "CODE-400") {
      if (response.data?.path?.includes("/purchase")) {
        navigate(response.data?.path, { replace: true });
      } else if (response.data?.path?.includes("/queue")) {
        navigate(response.data?.path, { replace: true });
      }
    } else if (response?.code === "CODE-405") {
      appContext.showErrorDialog("Enqueue Error", response?.error);
    }
  }, [enqueueData, navigate, appContext]);

  // Handle zone selection
  const handleZoneSelect = useCallback(
    async (zone: IZone): Promise<void> => {
      if (!user || !zone?.available) return;

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
        variables: { request },
        onError: (error) => {
          console.error("Enqueue error:", error);
          appContext.showErrorDialog("Enqueue Error", "Failed to join queue");
        },
      });
    },
    [user, enqueue, appContext]
  );

  // Sort zones for consistent ordering (Zone A first, then Zone Z)
  const sortedZones = [...(zones || [])].sort((a, b) =>
    a?.zoneId?.localeCompare(b?.zoneId)
  );

  // Generate scrolling footer text
  const scrollingText = `**** CHOOSE YOUR ZONE **** AGENT ${user?.lastName} **** YOUR ZONE DETERMINES WHAT YOU'LL SEE AND WHAT YOU WON'T **** `;

  return (
    <>
      {/* Page heading */}
      <div className="zone-view-page-heading">
        <h1>Zone Selection</h1>
      </div>

      {/* Main page container */}
      <main className="zone-view-page-container" role="main">

        {/* Alert messages */}
        <Alert
          message="Enqueue error occurred."
          visible={!!enqueueError}
          type="error"
          autoCloseDelay={5000}
          autoClose={true}
        />

        <Alert
          message="Zones fetch error."
          visible={!!zonesError}
          type="error"
          autoCloseDelay={5000}
          autoClose={true}
        />

        {/* Main content */}
        <div className="zone-view-content-main">

          {/* Zone layout */}
          <div className="zone-layout-container">

            {/* Zone A */}
            {sortedZones.find(zone => zone.zoneId === "zoneA") && (
              <div
                className={`zone-card zone-a ${
                  !sortedZones.find(zone => zone.zoneId === "zoneA")?.available ? '' : ''
                }`}
                onClick={() => {
                  const zoneA = sortedZones.find(zone => zone.zoneId === "zoneA");
                  if (zoneA) handleZoneSelect(zoneA);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Zone A - ${sortedZones.find(zone => zone.zoneId === "zoneA")?.available ? 'Available' : 'Capacity Maxed'}`}
              >
                <div className="zone-card-content">
                  <h2 className="zone-card-title">ZONE A</h2>
                  <p className="zone-card-slots">
                    {sortedZones.find(zone => zone.zoneId === "zoneA")?.available
                      ? `Available Slots: ${String(sortedZones.find(zone => zone.zoneId === "zoneA")?.remainingTicket || 0).padStart(4, "0")}`
                      : "Capacity Maxed"
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Stage */}
            <div className="zone-stage">
              <span>STAGE</span>
            </div>

            {/* Zone Z */}
            {sortedZones.find(zone => zone.zoneId === "zoneZ") && (
              <div
                className={`zone-card zone-z ${
                  !sortedZones.find(zone => zone.zoneId === "zoneZ")?.available ? 'sold-out' : ''
                }`}
                onClick={() => {
                  const zoneZ = sortedZones.find(zone => zone.zoneId === "zoneZ");
                  if (zoneZ) handleZoneSelect(zoneZ);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Zone Z - ${sortedZones.find(zone => zone.zoneId === "zoneZ")?.available ? 'Available' : 'Sold Out'}`}
              >
                <div className="zone-card-content">
                  <h2 className="zone-card-title">ZONE Z</h2>
                  <p className="zone-card-slots">
                    {sortedZones.find(zone => zone.zoneId === "zoneZ")?.available
                      ? `Available Slots: ${String(sortedZones.find(zone => zone.zoneId === "zoneZ")?.remainingTicket || 0).padStart(4, "0")}`
                      : "Capacity Maxed"
                    }
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Loading state */}
          {zonesLoading && (
            <div className="zone-loading">
              <p>Loading zones...</p>
            </div>
          )}

          {/* No zones available */}
          {!zonesLoading && zones.length === 0 && (
            <div className="zone-no-data">
              <p>No zones available for this event.</p>
            </div>
          )}

        </div>
      </main>

      {/* Global scrolling footer */}
      <GlobalFooter text={scrollingText} />
    </>
  );
};

export default ZoneView;
