import {User} from "../context/login.context";

export interface IZone {
    id?: string | null;
    configName?: string | null;
    eventId?: string | null;
    zoneId?: string | null;
    name?: string | null;
    price?: number | null;
    discount?: number | null;
    available?: boolean | null;
    maxTicket?: number | null;
    remainingTicket?: number | null;
    soldTicket?: number | null;
    eventDate?: string | null;
    image?: string | null;
    labelColor?: string | null;
    labelPosition?: string | null;
    eventDateString?: string;
}

export interface IQueueStatus {
    currentIndex?: number;
    eventDate?: string;
    eventId?: string;
    path?: string;
    queueKey?: string;
    totalQueue?: string;
}

export interface ITicketRequest {
    zone: IZone | null;

}

export interface IEvent {
    id?: string;
    configName?: string;
    eventName?: string;
    eventId?: string;
    eventDate?: string;
    eventTime?: string;
    eventLocation?: string;
    eventLocationLong?: string;
    locationCode?: string;
    maxTicket?: number;
    remainingTicket?: number;
    soldTicket?: number;
    eventDescription?: string;
    organizer?: string;
    price?: number;
    discount?: number;
    image?: string;
    theme?: string;
    available?: boolean;
    description?: string;
    eventDateString?: string;
    eventOrder?: number;
}


export interface IRequest {
    requestId?: string | null;
    requester?: User | null;
    owner?: User | null;
    timestamp?: number | null;
    description?: string | null;
    issueDate?: string | null;
    event?: IEvent | null;
    numberOfTicket: number;
    tickets?: ITicket[] | null;
    zoneId?: string | null;
    payments?: IPayments;
}

export interface IPayments {
    transactionId: string;
    transactionDateTime: string;
    transactionStatus: string;
    email: string;
    contact: string;
    amount: number;
    discount: number;
    couponId: string
}

export interface ITicket {
    id?: string;
    zoneId?: string;
    seatNo?: string;
    price?: number;
    discountPrice?: number;
    sequenceId?: number;
    timestamp?: number;
    generatedDate?: Date;
    requestId?: string;
    publishId?: string;
    owner?: User;
    requester?: User;
    assigner?: User;
    qrData?: string;
    event?: IEvent;
    share?: boolean
}

export interface IAPIResponse {
    code?: string;
    message?: string
    data?: any;
    error?: any;
}

export interface IEnqueue {
    requestId?: string;
    zone?: IZone
}

export interface IQueue {
    currentIndex: number;
    queueKey: string;
    totalQueue: number;
}

export interface IEnqueue {
    requestId?: string;
    zone?: IZone
}

export interface IQueue {
    currentIndex: number;
    queueKey: string;
    totalQueue: number;
}


export interface IAConcert {
    name?: string;
    nic?: string;
    concert?: string;
    contactNumber?: string;
    userId?: string;
    type?: string;
}

export interface IGroupedConcert {
    concert: string;
    record: IAConcert;
}

export interface IPaymentRequestInput {
    orderId?: string;
    amount?: number;
    currency?: string;
    item?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    returnUrl?: string;
    cancelUrl?: string;
    notifyUrl?: string;
    deliveryAddress?: string;
    deliveryCity?: string;
    deliveryCountry?: string;
    custom1?: string;
    custom2?: string;
}

export interface IPayHereRecord {
    id: string;
    merchantId: string;
    orderId: string;
    paymentId: string;
    capturedAmount: string;
    payhereAmount: string;
    payhereCurrency: string;
    statusCode: string;
    md5sig: string;
    custom1: string;
    custom2: string;
    method: string;
    statusMessage: string;
    cardHolderName: string;
    cardNo: string;
    cardExpiry: string;
    recurring: string;
}

export interface ITicketValidation {
    requestId?: string;
    ticketCount?: number;
    timestamp?: number;
    zoneId?: string;
    eventId?: string;
    orderId?: string;
    eventDate?: string;
}






