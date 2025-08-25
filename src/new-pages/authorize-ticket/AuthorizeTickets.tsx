import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import './AuthorizeTickets.css';
import TicketCard from '../../components/TicketCard/TicketCard';
import { IAPIResponse, ITicket } from '../../interfaces/data.interfaces';
import {
  CHECK_IS_EXIST_TICKET,
  GET_MY_TICKETS,
  SHARE_TICKET,
} from '../../graphql/queries';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useLogin, User } from '../../context/login.context';
import { useAppContext } from '../../context/app.context';
import RetroTextBox from '../../components/retro/RetroTextBox/RetroTextBox';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import axiosClient from '../../axios/axiosClient';
import { saveAs } from 'file-saver';
import Alert, { AlertProps } from '../../components/retro/Alert/Alert';
import GlobalFooter from '../../components/GlobalFooter/GlobalFooter';

/** ==========================================================================
 *  Authorize Tickets Page (content-only styling)
 *  - Header/Logo/Fonts/Colors come from global theme
 *  - This page only arranges content to match the finalized Figma
 *  ========================================================================== */

interface SharedUserData {
  nic: string;
  contact: string;
  email: string;
  selfAssigned: boolean;
}

interface ShareTicket {
  ticketId: string;
  assigner: User;
  eventId: string;
  selfAssigned: boolean;
}

interface ShareTicketContentProps {
  ticket: ITicket;
  user: User;
  onAssign: (value: boolean) => void;
  onDataChange: (data: { assigner: SharedUserData }) => void;
}

// ---------------------------------------------------------------------------
// Enhanced touch swipe functionality for ticket navigation
// ---------------------------------------------------------------------------
const useSwipeNavigation = (
  currentIndex: number,
  totalTickets: number,
  onChange: (index: number) => void,
  setTrackX: (pct: number) => void,
  setIsAnimating: (v: boolean) => void
) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent): void => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent): void => {
    if (!touchStart) return;
    const currentTouchEnd = e.targetTouches[0].clientX;
    setTouchEnd(currentTouchEnd);

    const distance = touchStart - currentTouchEnd;
    const element = e.currentTarget as HTMLElement;

    const maxDrag = 30;
    const dragDistance = Math.max(-maxDrag, Math.min(maxDrag, -distance * 0.3));
    element.style.transform = `translateX(${dragDistance}px)`;
  };

  const onTouchEnd = (e: React.TouchEvent): void => {
    const element = e.currentTarget as HTMLElement;
    element.style.transform = 'translateX(0px)';

    if (!touchStart || !touchEnd) {
      setIsSwiping(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < totalTickets - 1) {
      onChange(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      onChange(currentIndex - 1);
    }

    setIsSwiping(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    className: isSwiping ? 'swiping' : '',
  };


// ---------------------------------------------------------------------------
// Smooth touch swipe with follow-your-finger + snap (v2)
// ---------------------------------------------------------------------------
const useSwipeNavigation2 = (
  currentIndex: number,
  totalTickets: number,
  onChange: (index: number) => void,
  setTrackX: (pct: number) => void,
  setIsAnimating: (v: boolean) => void
) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const lastDxRef = useRef(0);

  const onTouchStart = (e: React.TouchEvent): void => {
    const el = e.currentTarget as HTMLElement;
    setContainerWidth(el.clientWidth || window.innerWidth);
    setTouchStartX(e.targetTouches[0].clientX);
    lastDxRef.current = 0;
    setIsSwiping(true);
    setIsAnimating(false); // disable easing while dragging
  };

  const onTouchMove = (e: React.TouchEvent): void => {
    if (touchStartX == null || !containerWidth) return;
    const x = e.targetTouches[0].clientX;
    const dx = x - touchStartX; // right = positive
    lastDxRef.current = dx;
    const base = -currentIndex * 100;
    const deltaPct = (dx / containerWidth) * 100;
    setTrackX(base + deltaPct); // follow the finger
  };

  const onTouchEnd = (): void => {
    if (touchStartX == null || !containerWidth) {
      setIsSwiping(false);
      return;
    }
    const thresholdPx = 0.18 * containerWidth; // 18% swipe to change
    let nextIndex = currentIndex;

    if (lastDxRef.current <= -thresholdPx) nextIndex = Math.min(currentIndex + 1, totalTickets - 1);
    else if (lastDxRef.current >= thresholdPx) nextIndex = Math.max(currentIndex - 1, 0);

    setIsAnimating(true);
    setTrackX(-nextIndex * 100);
    if (nextIndex !== currentIndex) onChange(nextIndex);

    setIsSwiping(false);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    className: isSwiping ? 'swiping' : '',
  };
};
};

const ShareTicketContent: React.FC<ShareTicketContentProps> = ({
  ticket,
  onAssign,
  onDataChange,
  user,
}) => {
  const [isAssignToMe, setIsAssignToMe] = useState<boolean>(false);
  const [assigner, setAssigner] = useState<SharedUserData>({
    email: '',
    nic: '',
    contact: '',
    selfAssigned: false,
  });

  useEffect(() => {
    const initialData: SharedUserData = {
      email: '',
      nic: '',
      contact: '',
      selfAssigned: false,
    };

    setAssigner(initialData);
    setIsAssignToMe(false);
    onDataChange({ assigner: initialData });
  }, [ticket?.id, onDataChange]);

  const handleAssigner = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    const updatedAssigner = {
      ...assigner,
      [name]: value,
    };

    setAssigner(updatedAssigner);
    onDataChange({ assigner: updatedAssigner });
  };

  const handleAssignToggle = (value: boolean): void => {
    setIsAssignToMe(value);
    onAssign(value);

    if (value) {
      const currentUser: SharedUserData = {
        email: user?.email,
        nic: user?.nic,
        contact: user?.contact,
        selfAssigned: true,
      };
      setAssigner(currentUser);
      onDataChange({ assigner: currentUser });
    } else {
      const resetAssigner: SharedUserData = {
        email: '',
        nic: '',
        contact: '',
        selfAssigned: false,
      };
      setAssigner(resetAssigner);
      onDataChange({ assigner: resetAssigner });
    }
  };

  if (!ticket) return <div>No ticket selected</div>;

  return (
    <div className="authorize-tickets-share-dialog">
      <div className="authorize-tickets-share-option">
        <span>Assign to friend</span>
        <InputSwitch
          checked={isAssignToMe}
          onChange={(e) => handleAssignToggle(e.value)}
        />
        <span>Assign to Me</span>
      </div>

      {isAssignToMe ? (
        <div className="authorize-tickets-share-info">
          <span>Ticket will be assigned to you.</span>
        </div>
      ) : (
        <div>
          <RetroTextBox
            labelText="NIC/Passport:"
            type="text"
            name="nic"
            id="nic"
            value={assigner.nic}
            onChange={handleAssigner}
            required
          />

          <RetroTextBox
            labelText="Phone:"
            type="text"
            name="contact"
            id="contact"
            value={assigner.contact}
            onChange={handleAssigner}
          />

          <RetroTextBox
            labelText="Email:"
            type="text"
            name="email"
            id="email"
            value={assigner.email}
            onChange={handleAssigner}
          />
        </div>
      )}
    </div>
  );
};

const AuthorizeTickets: FC = () => {
  const { user } = useLogin();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const { appContext } = useAppContext();
  const [sharedUser, setSharedUser] = useState<SharedUserData>({
    nic: '',
    contact: '',
    email: '',
    selfAssigned: false,
  });
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const selectedTicketRef = useRef<ITicket | null>(null);
  const currentFormDataRef = useRef<SharedUserData>({
    nic: '',
    contact: '',
    email: '',
    selfAssigned: false,
  });
  const [assignToMe, setAssignToMe] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertProps>({
    visible: false,
    message: '',
    type: 'info',
  });
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>(0);

const [trackX, setTrackX] = useState<number>(-currentTicketIndex * 100);
const [isAnimating, setIsAnimating] = useState<boolean>(false);

useEffect(() => {
  setIsAnimating(true);
  setTrackX(-currentTicketIndex * 100);
  const t = setTimeout(() => setIsAnimating(false), 320);
  return () => clearTimeout(t);
}, [currentTicketIndex]);

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSharedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
    setSelectedTicket(null);
    setSharedUser({ nic: '', contact: '', email: '', selfAssigned: false });
  };

  const handleShareTicket = async (): Promise<void> => {
    if (
      !selectedTicket ||
      !sharedUser.nic ||
      !sharedUser.contact ||
      !sharedUser.email
    ) {
      appContext.showErrorDialog(
        'Validation Error',
        'Please fill in all required fields'
      );
      return;
    }

    try {
      const response = await shareMyTicket({
        variables: {
          ticketId: selectedTicket?.id,
          nic: sharedUser?.nic,
          contact: sharedUser?.contact,
          email: sharedUser?.email,
          eventId: selectedTicket?.event?.eventId,
        },
      });

      if (response.data?.shareTicket?.code === 'CODE-204') {
        appContext.showSuccessDialog('Success', 'Ticket shared successfully');
        handleCloseDialog();
        refetchTickets();
      } else {
        appContext.showErrorDialog(
          'Share Error',
          response.data?.shareTicket?.error || 'Failed to share ticket'
        );
      }
    } catch (error) {
      appContext.showErrorDialog(
        'Share Error',
        'An error occurred while sharing the ticket'
      );
    }
  };

  const {
    data: myTickets,
    loading: loadingTicket,
    error: errorMyTickets,
    refetch: refetchTickets,
  } = useQuery(GET_MY_TICKETS, {
    variables: { requestId: user?.id },
    fetchPolicy: 'network-only',
    skip: !user?.id,
  });

  const [shareMyTicket, { loading: loadingShare, error: shareErrorResponse }] =
    useMutation(SHARE_TICKET);

  const [
    checkIsExistTicket,
    {
      loading: loadingCheckIsExistTicket,
      error: checkIsExistTicketErrorResponse,
    },
  ] = useLazyQuery(CHECK_IS_EXIST_TICKET, { fetchPolicy: 'network-only' });

  useEffect(() => {
    if (myTickets?.getMyTickets) {
      const response = myTickets.getMyTickets as IAPIResponse;
      if (response?.code === 'CODE-204') {
        if (response?.data?.length > 0) {
          setTickets(response?.data as ITicket[]);
        } else {
          setTickets([]);
        }
      } else if (response?.code === 'CODE-205') {
        appContext.showErrorDialog('Ticket fetching error', response?.error);
      }
    }
  }, [myTickets, appContext]);

  // AFTER
const swipeHandlers = useSwipeNavigation(
  currentTicketIndex,
  tickets.length,
  setCurrentTicketIndex,
  setTrackX,
  setIsAnimating
);

  useEffect(() => {
    if (currentTicketIndex >= tickets.length && tickets.length > 0) {
      setCurrentTicketIndex(0);
    }
  }, [tickets.length, currentTicketIndex]);

  const processTicketSharing = async (
    assignerData: SharedUserData
  ): Promise<boolean> => {
    const currentTicket = selectedTicketRef.current;
    setAlert((prev) => ({
      ...prev,
      visible: true,
      type: 'info',
      message: 'Checking...',
    }));

    if (!currentTicket) {
      console.error('No ticket available for sharing');
      return false;
    }

    if (!validateNIC(user?.nic)) {
      console.error('NIC number not valid.');
      return false;
    }

    if (!validateEmail(user?.email)) {
      console.error('Email is not valid.');
      return false;
    }

    try {
      const result = await checkIsExistTicket({
        variables: {
          nic: currentFormDataRef?.current?.nic,
          eventId: currentTicket.event.eventId,
        },
      });

      if (result?.data?.checkIsExistTicket?.data?.exists) {
        setAlert((prev) => ({
          ...prev,
          visible: true,
          type: 'warning',
          message: 'Ticket already shared...',
        }));
        return false;
      }

      const shareTicket: ShareTicket = {
        ticketId: currentTicket.id,
        assigner: {
          nic: currentFormDataRef?.current?.nic,
          email: currentFormDataRef?.current?.email,
        } as User,
        eventId: currentTicket?.event?.eventId,
        selfAssigned: currentFormDataRef?.current?.selfAssigned,
      };

      const shareResult = await shareMyTicket({
        variables: { ticket: shareTicket },
      });

      const response = shareResult?.data?.shareTicket as IAPIResponse;

      if (response?.code === 'CODE-200') {
        appContext.setOpenDialog(true);
        setAlert((prev) => ({
          ...prev,
          visible: true,
          type: 'warning',
          message: 'Ticket already shared...',
        }));
      } else if (response?.code === 'CODE-202') {
        refetchTickets();
        setAlert((prev) => ({
          ...prev,
          visible: true,
          type: 'info',
          message: 'Ticket shared successfully...',
        }));
        appContext.setOpenDialog(false);
        currentFormDataRef.current = {
          email: '',
          contact: '',
          nic: '',
          selfAssigned: false,
        };
        return true;
      } else if (response?.code === 'CODE-203') {
        setAlert((prev) => ({
          ...prev,
          visible: true,
          type: 'error',
          message: `Ticket share failed...${response?.error}`,
        }));
      }

      return false;
    } catch (error) {
      console.error('Error sharing ticket:', error);
      setAlert((prev) => ({
        ...prev,
        visible: true,
        type: 'error',
        message: 'Ticket share failed...',
      }));
      return false;
    }
  };

  const validateNIC = (nic: string | null | undefined): boolean => {
    if (!nic) return false;
    const oldNicRegex = /^\d{9}[VXvx]$/;
    const newNicRegex = /^\d{12}$/;
    return oldNicRegex.test(nic) || newNicRegex.test(nic);
  };

  const validateEmail = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.includes('@')) return false;
    if (email.indexOf('@') !== email.lastIndexOf('@')) return false;

    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const [localPart, domain] = parts;
    if (localPart.length === 0) return false;
    if (domain.length === 0) return false;
    if (!domain.includes('.')) return false;

    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];
    if (tld.length === 0) return false;

    return emailRegex.test(email);
  };

  const handleDownload = async (ticket: ITicket): Promise<void> => {
    setAlert((prev) => ({
      ...prev,
      visible: true,
      type: 'info',
      message: 'Downloading...',
    }));

    try {
      const response = await axiosClient.get(`/download/ticket/${ticket?.id}`, {
        responseType: 'arraybuffer',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      setAlert((prev) => ({
        ...prev,
        visible: false,
        type: 'info',
        message: '',
      }));
      saveAs(blob, `Yogeshwari.pdf`);
    } catch (error) {
      setAlert((prev) => ({
        ...prev,
        visible: true,
        type: 'error',
        message: `Error downloading...`,
      }));
    }
  };

  const handlingCloseAlert = (): void => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  const handleAssignTicket = (ticket: ITicket): void => {
    setSelectedTicket(ticket);
    selectedTicketRef.current = ticket;

    appContext.showDialog({
      title: 'Assign Tickets',
      content: (
        <ShareTicketContent
          ticket={ticket}
          user={user}
          onAssign={(assignToMe) => setAssignToMe(assignToMe)}
          onDataChange={(data) => {
            if (data?.assigner) {
              currentFormDataRef.current = {
                email: data.assigner.email || '',
                nic: data.assigner.nic || '',
                contact: data.assigner.contact || '',
                selfAssigned: data?.assigner.selfAssigned || false,
              };
            }
          }}
        />
      ),
      primaryAction: {
        label: 'Assign',
        onClick: async () => {
          if (assignToMe) {
            if (user !== null) {
              const assignMe: SharedUserData = {
                email: user?.email,
                nic: user?.nic,
                contact: user?.contact,
                selfAssigned: true,
              };
              await processTicketSharing(assignMe);
            } else {
              console.error('User not found in the context');
            }
          } else {
            await processTicketSharing(currentFormDataRef.current);
          }
        },
      },
      secondaryAction: {
        label: 'Cancel',
        onClick: () => appContext.setOpenDialog(false),
      },
      showCustomActions: true,
    });
  };

  // -----------------------------------------------------------------------
  // UI content to match Figma
  // -----------------------------------------------------------------------

  // Figma shows "AUTHORIZE TICKETS" in the page heading
  const pageTitle = 'AUTHORIZE TICKETS';

  // Figma footer copy for this page (lock state notice)
  const scrollingText =
    '**** CLICK ON ASSIGN BUTTON TO UNLOCK, TICKETS SHOULD UNLOCK UNDER NIC ****';

  // Mobile indicator: always render up to 3 compact dots (very small)
  const indicatorCount = Math.min(3, Math.max(1, tickets.length));
  let activeDot = 0;
  if (tickets.length <= 3) {
    activeDot = currentTicketIndex;
  } else {
    if (currentTicketIndex === 0) activeDot = 0;
    else if (currentTicketIndex === tickets.length - 1) activeDot = 2;
    else activeDot = 1;
  }

  const defaultHeader = (
    <div className="retro-dialog-header">
      <span className="retro-dialog-header-text">Share Ticket</span>
    </div>
  );

  const customActionsFooter = (
    <div className="retro-dialog-footer">
      <Button
        label="Share"
        icon="pi pi-share-alt"
        className="retro-dialog-button retro-dialog-button-primary"
        onClick={handleShareTicket}
        disabled={
          loadingShare ||
          !sharedUser.nic ||
          !sharedUser.contact ||
          !sharedUser.email
        }
      />

      <Button
        label="Close"
        icon="pi pi-times"
        className="retro-dialog-button retro-dialog-button-secondary"
        onClick={handleCloseDialog}
        disabled={loadingShare}
      />
    </div>
  );

  const dialogContent = (
    <div>
      <RetroTextBox
        labelText="NIC/Passport:"
        type="text"
        name="nic"
        id="nic"
        value={sharedUser.nic}
        onChange={handleUserInput}
        placeholder="Enter NIC or Passport number"
        required
      />

      <RetroTextBox
        labelText="Contact:"
        type="text"
        name="contact"
        id="contact"
        value={sharedUser.contact}
        onChange={handleUserInput}
        placeholder="Enter contact number"
        required
      />

      <RetroTextBox
        labelText="Email:"
        type="text"
        name="email"
        id="email"
        value={sharedUser.email}
        onChange={handleUserInput}
        placeholder="Enter email address"
        required
      />
    </div>
  );

  return (
    <>
      {/* Main page container */}
      <main className="authorize-tickets-page-container" role="main">
        {/* Alerts */}
        <Alert
          message={alert.message}
          type={alert.type}
          visible={alert.visible}
          autoCloseDelay={3000}
          autoClose={true}
          onClose={handlingCloseAlert}
        />

        <Alert
          message="Fetching error..."
          type="error"
          visible={!!errorMyTickets}
          autoCloseDelay={3000}
          autoClose={true}
          onClose={handlingCloseAlert}
        />

        <Alert
          message="Processing share..."
          type="info"
          visible={loadingShare}
          autoCloseDelay={3000}
          autoClose={true}
          onClose={handlingCloseAlert}
        />

        <Alert
          message="Sharing error..."
          type="error"
          visible={!!shareErrorResponse}
          autoCloseDelay={3000}
          autoClose={true}
          onClose={handlingCloseAlert}
        />

        <Alert
          message="Checking error"
          type="error"
          visible={!!checkIsExistTicketErrorResponse}
          autoCloseDelay={3000}
          autoClose={true}
          onClose={handlingCloseAlert}
        />

        {/* Main content */}
        <section className="authorize-tickets-content-main">
          {/* No tickets message */}
          {tickets?.length <= 0 && (
            <div className="authorize-tickets-error">
              <p>Ticket(s) not available</p>
            </div>
          )}

          {/* Ticket layout */}
          {tickets?.length > 0 && (
            <div className="authorize-tickets-layout">
              {/* Desktop View */}
              <div className="authorize-tickets-desktop-view">
                {tickets.map((ticket, index) => (
                  <TicketCard
                    key={index}
                    onClick={handleAssignTicket}
                    ticket={ticket}
                    onDownload={handleDownload}
                  />
                ))}
              </div>

              {/* Mobile View with Slider */}
              <div
                className={`authorize-tickets-mobile-view ${
                  tickets.length === 1 ? 'single-ticket' : ''
                }`}
              >
                <div
                  className="authorize-tickets-counter"
                  aria-live="polite"
                >
                  {tickets.length > 0 && (
                    <span>{`Ticket ${currentTicketIndex + 1} of ${tickets.length}`}</span>
                  )}
                </div>
<div
                  className={`authorize-tickets-mobile-container ${swipeHandlers.className}`}
                  {...swipeHandlers}
                >
                  <div
                    className={`authorize-tickets-track ${isAnimating ? 'animating' : ''}`}
                    style={{ transform: `translateX(${trackX}%)` }}
                  >
                    {tickets.map((ticket, i) => (
                      <div className="ticket-slide" key={i}>
                        <TicketCard
                          ticket={ticket}
                          onClick={handleAssignTicket}
                          onDownload={handleDownload}
                          // index={i}
                          // total={tickets.length}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="slider-edge left" />
                  <div className="slider-edge right" />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Dialog for sharing tickets */}
        <Dialog
          visible={isOpenDialog}
          onHide={handleCloseDialog}
          header={defaultHeader}
          footer={customActionsFooter}
          className="retro-dialog"
          style={{ width: '800px', height: '800px' }}
          modal
          resizable={false}
          draggable={false}
          closeOnEscape
          dismissableMask
        >
          {dialogContent}
        </Dialog>
      </main>

      {/* Global scrolling footer */}
      <GlobalFooter text={scrollingText} />
    </>
  );
};

export default AuthorizeTickets;
