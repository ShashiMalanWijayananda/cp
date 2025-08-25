import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import './PurchaseTickets.css';
import PurchaseCard from './PurchaseCard/PurchaseCard';
import Alert from '../../components/retro/Alert/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLogin } from '../../context/login.context';
import {
  IAPIResponse,
  IEvent,
  IPayHereRecord,
  IPaymentRequestInput,
  IRequest,
  ITicket,
  ITicketValidation,
  IZone,
} from '../../interfaces/data.interfaces';

import {
  FETCH_EVENT_BY_ID,
  FETCH_ZONE_CONFIG,
  GENERATE_PAYHERE_HASH,
  REQUEST_TICKET,
  TICKET_VALIDATION,
  VALIDATE_PAYHERE_PAYMENT,
  VALIDATE_REQUEST,
} from '../../graphql/queries';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useAppContext } from '../../context/app.context';
import GlobalFooter from '../../components/GlobalFooter/GlobalFooter';

interface OnePayResult {
  code: '201' | '400';
  transaction_id: string;
  status: 'SUCCESS' | 'FAIL';
}

type OnePayEvent = CustomEvent<OnePayResult>;

const PurchaseTickets: FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
  }>({ minutes: 15, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<any>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const navigation = useNavigate();
  const SESSION_KEY = 'purchase_session_timer';
  const { user } = useLogin();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  const eventDate = searchParams.get('eventDate');
  const zoneId = searchParams.get('zoneId');
  const isDirect = searchParams.get('direct');
  const navigate = useNavigate();
  const queueId = `${user?.id}-${eventDate}-${eventId}-${zoneId}`;
  const [event, setEvent] = useState<IEvent | null>(null);
  const [zone, setZone] = useState<IZone>(null);
  const { appContext } = useAppContext();
  const [error, setError] = useState<string>('');
  const couponRef = useRef<string>('');
  const numberOfTicketRef = useRef<number>(1);
  const amountRef = useRef<number>(0.0);

  //Payhere JS
  useEffect(() => {
    // Load the PayHere script dynamically
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [getPayhereHash, {}] = useMutation(GENERATE_PAYHERE_HASH);

  const [validateRequest, {}] = useLazyQuery(VALIDATE_REQUEST, {
    fetchPolicy: 'network-only',
  });

  const [
    validatPayhereRequest,
    {
      data: validateResponse,
      loading: loadingRequest,
      refetch: reftechRequest,
    },
  ] = useLazyQuery(VALIDATE_PAYHERE_PAYMENT, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const response = validateResponse?.validateRequest as IAPIResponse;
    if (response?.code === 'CODE-403') {
      if ((response?.data?.ack as Boolean) === true) {
        setTimeout(() => {
          appContext.showDialog({
            title: 'MISSION ACCESS GRANTED!',
            message:
              'Agent, your access has been approved.  \n' +
              'You now have 15 minutes to secure your mission ticket.',
            onOk: () => {
              console.log('ack');
            },
          });
        }, 500);
      } else {
        setTimeout(() => {
          navigate('/menu');
        }, 2000);
      }
    }
  }, [validateResponse]);

  const [loadZoneConfig, { loading: zoneLoading, error: zoneLoadingError }] =
    useLazyQuery(FETCH_ZONE_CONFIG, {
      fetchPolicy: 'network-only',
    });

  const {
    data: eventConfigData,
    loading: eventConfigLoading,
    error: eventConfigError,
  } = useQuery(FETCH_EVENT_BY_ID, {
    variables: { eventId: zone?.eventId },
    skip: !zone,
    fetchPolicy: 'network-only',
  });

  const [
    createTicketRequest,
    {
      data: ticketRequestData,
      loading: ticketRequestLoading,
      error: ticketRequestError,
    },
  ] = useMutation(REQUEST_TICKET);

  const [ticketValidation, {}] = useMutation(TICKET_VALIDATION, {
    fetchPolicy: 'network-only',
  });

  function generateOrderId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 5; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return Date.now().toString(36).toUpperCase() + randomPart;
  }

  const handleBuyTicket = useCallback(
    (couponCode, numberOfTicket, amount) => {
      couponRef.current = couponCode;
      numberOfTicketRef.current = numberOfTicket;
      amountRef.current = amount;

      const validateRequest: ITicketValidation = {
        requestId: user?.id,
        ticketCount: numberOfTicket,
        timestamp: new Date().getTime(),
        zoneId: zone?.zoneId,
        eventId: event?.eventId,
        orderId: user?.id,
        eventDate: event?.eventDate,
      };

      ticketValidation({
        variables: {
          request: validateRequest,
        },
      })
        .then((res) => {
          const response = res?.data?.ticketValidation as IAPIResponse;
          if (response?.code === 'CODE-4000') {
            if (!response?.data?.validate) {
              appContext?.showErrorDialog(
                'No enough ticket(s)',
                response?.data?.error
              );
            } else {
              if (amount > 0) {
                const generatedOrderId = generateOrderId();
                const currency = 'LKR';
                const item = 'YOGESHWARI';
                const request: IPaymentRequestInput = {
                  orderId: generatedOrderId,
                  amount: amount,
                  item: item,
                  currency: currency,
                };
                getPayhereHash({
                  variables: { paymentRequest: request },
                })
                  .then((res) => {
                    const hashResponse = res?.data
                      ?.generatePayHereHash as IAPIResponse;
                    if (hashResponse?.code === 'CODE-910') {
                      const payment = {
                        sandbox: true,
                        merchant_id: hashResponse?.data?.merchantId,
                        return_url: '',
                        cancel_url: '',
                        notify_url:
                          'https://backend-ticketing-v1-ewddbygwhxh5atgd.southeastasia-01.azurewebsites.net/ticketing/payments/ack',
                        order_id: generatedOrderId,
                        items: item,
                        amount: amount,
                        currency: currency,
                        first_name: user?.firstName,
                        last_name: user?.lastName,
                        email: user?.email,
                        phone: user?.contact,
                        address: user?.address,
                        city: 'N/A',
                        country: 'N/A',
                        hash: hashResponse?.data?.hash,
                      };
                      if ((window as any).payhere) {
                        (window as any).payhere.startPayment(payment);
                      } else {
                        alert('PayHere SDK is not loaded yet.');
                      }
                    }
                  })
                  .catch((err) => {
                    console.error('Error:', err);
                  });
                if ((window as any).payhere) {
                  (window as any).payhere.onCompleted = function onCompleted(
                    orderId: string
                  ) {
                    console.log('Payment completed for orderId:', orderId);
                    setTimeout(() => {
                      validatPayhereRequest({
                        variables: { orderId: orderId },
                      })
                        .then((res) => {
                          const payHereRecordResponse = res?.data
                            ?.validatePayhereRequest as IAPIResponse;
                          if (payHereRecordResponse?.code === 'CODE-912') {
                            const record: IPayHereRecord =
                              payHereRecordResponse?.data;
                            if (record?.statusCode === '2') {
                              const tickets: ITicket[] = Array.from(
                                { length: numberOfTicket },
                                () => ({
                                  requestId: user?.id,
                                  zoneId: zone?.zoneId,
                                  type: 'general',
                                  price: zone?.price,
                                  discount: zone?.discount,
                                  assigner: null,
                                  event: event,
                                })
                              );
                              const newRequest: IRequest = {
                                requestId: user?.id,
                                requester: user,
                                owner: user,
                                timestamp: new Date().getTime(),
                                description: 'Ticket purchase via PayHere',
                                issueDate: new Date().toLocaleString(),
                                event: event,
                                numberOfTicket: numberOfTicket,
                                tickets: tickets,
                                zoneId: zone.zoneId,
                                payments: {
                                  transactionId: orderId,
                                  transactionDateTime:
                                    new Date().toLocaleString(),
                                  transactionStatus: 'SUCCESS',
                                  email: user?.email,
                                  contact: user?.contact,
                                  amount: amount,
                                  discount: zone?.discount * numberOfTicket,
                                  couponId: couponCode || null,
                                },
                              };
                              createTicketRequest({
                                variables: { request: newRequest },
                                onCompleted: (data) => {
                                  const response =
                                    data?.requestTicket as IAPIResponse;
                                  if (response?.code === 'CODE-014') {
                                    appContext.showSuccessDialog(
                                      'Success',
                                      data?.requestTicket?.message
                                    );
                                  } else if (response?.code === 'CODE-011') {
                                    appContext.showSuccessDialog(
                                      'Info',
                                      'Ticket purchasing success'
                                    );
                                    navigate('/my-tickets', { replace: true });
                                  } else {
                                    appContext.showSuccessDialog(
                                      'Error',
                                      'Ticket processing error'
                                    );
                                  }
                                },
                                onError: (error) => {
                                  console.error(
                                    'Error creating tickets:',
                                    error
                                  );
                                  appContext.showErrorDialog(
                                    'Error',
                                    'Failed to create tickets. Please contact support.'
                                  );
                                },
                              });
                            } else if (record?.statusCode === '0') {
                              appContext.showErrorDialog(
                                'Payment⚠',
                                'Payment process is still pending, please try again later..'
                              );
                            } else if (record?.statusCode === '-1') {
                              appContext.showErrorDialog(
                                'Payment⚠',
                                'Payment cancelled..'
                              );
                            } else if (record?.statusCode === '-2') {
                              appContext.showErrorDialog(
                                'Payment⚠',
                                'Payment failed..'
                              );
                            } else if (record?.statusCode === '-3') {
                              appContext.showErrorDialog(
                                'Payment⚠',
                                'Payment chargeback..'
                              );
                            } else {
                              appContext.showErrorDialog(
                                'Payment⚠',
                                `Unknown payment status: ${record?.statusCode}`
                              );
                            }
                          } else {
                            appContext.showErrorDialog(
                              'Error⚠',
                              'Failed to validate payment. Please contact support.'
                            );
                          }
                        })
                        .catch((err) => {
                          console.error('Error:', err);
                          appContext.showErrorDialog(
                            'Error⚠',
                            'Network error occurred. Please try again.'
                          );
                        });
                    }, 2000);
                  };
                  (window as any).payhere.onError = function onError(
                    error: any
                  ) {
                    console.error('PayHere Error:', error);
                    appContext.showErrorDialog(
                      'Payment Erroâš r',
                      'Payment process failed. Please try again.'
                    );
                  };
                  (window as any).payhere.onDismissed = function onDismissed() {
                    console.log('Payment dismissed by user');
                    appContext.showErrorDialog(
                      'Payment⚠',
                      'Payment process was cancelled.'
                    );
                  };
                }
              } else {
                const tickets: ITicket[] = Array.from(
                  { length: numberOfTicket },
                  () => ({
                    requestId: user?.id,
                    zoneId: zone?.zoneId,
                    type: 'general',
                    price: zone?.price,
                    discount: zone?.discount,
                    assigner: null,
                    event: event,
                  })
                );
                const newRequest: IRequest = {
                  requestId: user?.id,
                  requester: user,
                  owner: user,
                  timestamp: new Date().getTime(),
                  description: '',
                  issueDate: new Date().toLocaleString(),
                  event: event,
                  numberOfTicket: numberOfTicket,
                  tickets: tickets,
                  zoneId: zone.zoneId,
                  payments: {
                    transactionId: 'Applied Coupon',
                    transactionDateTime: new Date().toLocaleString(),
                    transactionStatus: 'SUCCESS',
                    email: user.email,
                    contact: user.contact,
                    amount: amount,
                    discount: zone.discount,
                    couponId: couponCode || null,
                  },
                };
                createTicketRequest({
                  variables: { request: newRequest },
                  onCompleted: (data) => {
                    const response = data?.requestTicket as IAPIResponse;
                    if (response?.code === 'CODE-014') {
                      appContext.showSuccessDialog(
                        'Success',
                        data?.requestTicket?.message
                      );
                    } else if (response?.code === 'CODE-011') {
                      appContext.showSuccessDialog(
                        'Info',
                        'Ticket purchasing success'
                      );
                      navigate('/my-tickets', { replace: true });
                    } else {
                      appContext.showSuccessDialog(
                        'Error',
                        'Ticket processing error'
                      );
                    }
                  },
                  onError: (error) => {
                    console.error('Error creating tickets:', error);
                    appContext.showErrorDialog(
                      'Error',
                      'Failed to create tickets. Please contact support.'
                    );
                  },
                });
              }
            }
          }
        })
        .catch((error) => {
          appContext?.showErrorDialog('Error', 'Ticket validation failed');
          console.error(error);
        });
    },
    [user, zone, event, createTicketRequest]
  );

  useEffect(() => {
    if (!reftechRequest) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      reftechRequest();
    }, 1000 * 60 * 3);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [reftechRequest]);

  useEffect(() => {
    if (!user) return;

    if (isDirect === 'true') {
      loadZoneConfig({
        variables: { eventId, zoneId },
        onCompleted: (res) => {
          const response = res?.getZoneConfig as IAPIResponse;
          if (response.code === 'CODE-700') {
            setZone(response.data);
          } else if (response?.code === 'CODE-701') {
            appContext.showErrorDialog('Zone fetching error', response?.error);
          }
        },
        onError: (error) => {
          appContext.showErrorDialog('Error', JSON.stringify(error));
        },
      });
    } else {
      validateRequest({
        variables: { queueId },
        onCompleted: (res) => {
          const response = res?.validateRequest as IAPIResponse;
          if (response?.data?.ack === false) {
            navigate('/menu', { replace: true });
          } else {
            loadZoneConfig({
              variables: { eventId, zoneId },
              onCompleted: (res) => {
                const response = res?.getZoneConfig as IAPIResponse;
                if (response.code === 'CODE-700') {
                  setZone(response.data);
                } else if (response?.code === 'CODE-701') {
                  appContext.showErrorDialog(
                    'Zone fetching error',
                    response?.error
                  );
                }
              },
              onError: (error) => {
                appContext.showErrorDialog('Error', JSON.stringify(error));
              },
            });
          }
        },
        onError: (error) => {
          appContext.showErrorDialog('Error', JSON.stringify(error));
        },
      });
    }
  }, [user?.id, eventId, zoneId, isDirect]);

  useEffect(() => {
    if (!eventConfigData) return;

    const response = eventConfigData?.getEventDetailByEventId as IAPIResponse;
    if (response?.code === 'CODE-1000') {
      const eventConfig = response?.data as IEvent;
      setEvent(eventConfig);
    } else if (response?.code === 'CODE-1001') {
      appContext.showErrorDialog('Event fetching error', response?.error);
    }
  }, [eventConfigData]);

  useEffect(() => {
    if (ticketRequestData) {
      setError('');
      const response = ticketRequestData?.requestTicket as IAPIResponse;
      if (response.code === 'CODE-011') {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('eventId');
        localStorage.removeItem('eventDate');
        localStorage.removeItem('zoneId');
        setTimeout(() => {
          navigate('/my-tickets', { replace: true });
          appContext.setOpenDialog(false);
        }, 1000);
        appContext.showDialog({
          title: 'Purchasing Success',
          message:
            'You have successfully purchased ticket, Please visit my-tickets',
          onOk: () => {
            navigate('/my-tickets', { replace: true });
          },
        });
      }
      if (response.code === 'CODE-014') {
        setError('Ticket not available');
      }
    }

    if (ticketRequestError) {
      setError(
        ticketRequestError.message ||
          'Failed to complete your purchase. Please try again.'
      );
    }
  }, [ticketRequestData, ticketRequestError]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const confirmCancel = window.confirm(
          'Are you sure you want to cancel this purchase session?'
        );
        if (confirmCancel) {
          sessionStorage.removeItem(SESSION_KEY);
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          navigation('/menu', { replace: true });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {/* Main page container without heading - direct purchase card display */}
      <main className="purchase-page-container-direct" role="main">
        <section className="purchase-content-main">
          <div className="purchase-content-wrapper">
            {/* Alert Components */}
            <Alert
              message={'Zone fetching error....'}
              visible={!!zoneLoadingError}
              type={'error'}
              autoClose={true}
              autoCloseDelay={3000}
            />
            <Alert
              message={error}
              visible={!!error}
              type={'error'}
              autoClose={true}
              autoCloseDelay={3000}
            />

            {/* Purchase Card Component */}
            <div className="purchase-component-container">
              {zone && event ? (
                <PurchaseCard
                  eventId={eventId}
                  zoneId={zoneId}
                  onTap={handleBuyTicket}
                />
              ) : (
                <div className="purchase-loading">
                  <div className="loading-text">Loading mission data...</div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Global scrolling footer message - will be added by PurchaseCard */}
      <div className="space"></div>
    </>
  );
};

export default PurchaseTickets;
