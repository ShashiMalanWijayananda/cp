import {gql} from '@apollo/client';

export const FETCH_ZONE_CONFIGS = gql`
    query GetZoneConfigs($eventId: String!) {
        getZoneConfigs(eventId: $eventId)
    }
`;

export const FETCH_ZONE_CONFIG = gql`
    query GetZoneConfig($eventId: String!, $zoneId: String!) {
        getZoneConfig(eventId: $eventId, zoneId: $zoneId)
    }
`;

export const FETCH_EVENT_BY_ID = gql`
    query GetEventDetailByEventId($eventId: String!) {
        getEventDetailByEventId(eventId: $eventId)
    }
`;

export const QUEUE_SUBSCRIPTION = gql`
    subscription QueueUpdate($request: EnqueueInput!) {
        queueUpdate(request: $request)
    }
`;

export const CHECK_QUEUE_STATUS = gql`
    query CheckQueueStatus($request: EnqueueInput!) {
        checkQueueStatus(request: $request)
    }
`;

export const QUEUE_STATUS = gql`
    subscription QueueStatus($request: EnqueueInput!) {
        queueUpdate(request: $request)
    }
`;


export const CHECK_REQUEST_QUEUE = gql`
    query CheckRequestQueue($eventId: String!, $requestId: String!) {
        checkRequestQueue(eventId: $eventId,requestId: $requestId)
    }
`;

export const CHECK_QUEUE_BY_REQUEST = gql`
    query CheckRequestQueue($requestId: String!, $eventId: String!) {
        checkRequestQueue(requestId: $requestId, eventId: $eventId)
    }
`;

export const REQUEST_TICKET = gql`
    mutation RequestTicket($request: TicketRequestInput!) {
        requestTicket(request: $request)
    }
`;

export const GET_EVENTS = gql`
    query getEvents {
        getEvents
    }
`;

export const GET_MY_TICKETS = gql`
    query getMyTickets($requestId: String!) {
        getMyTickets(requestId: $requestId)
    }
`;

export const SHARE_TICKET = gql`
    mutation shareTicket($ticket: InputShareTicket!) {
        shareTicket(ticket: $ticket)
    }
`;

export const ENQUEUE_LIST = gql`
    mutation Enqueue($request: EnqueueInput!) {
        enqueue(request: $request)
    }
`;

export const CHECK_IS_EXIST_TICKET = gql`
    query CheckIsExistTicket($nic: String!, $eventId: String!) {
        checkIsExistTicket(nic: $nic, eventId: $eventId)
    }
`;


export const VALIDATE_REQUEST = gql`
    query ValidateRequest($queueId: String!) {
        validateRequest(
            queueId: $queueId)
    }
`;

export const UPDATE_PAYMENTS = gql`
    mutation UpdateFailedPayments($payments :PaymentsInput!) {
        updateFailedPayments(
            payments: $payments
        )
    }
`

export const APPLY_COUPON = gql`
    mutation ApplyCoupon($couponId:String!){
        applyCoupon(couponId: $couponId)
    }

`
export const GET_TICKET_BY_VIEW_ID = gql`
    query GetTicketByViewId($viewId: String!) {
        getTicketByViewId(viewId: $viewId) {
            code
            message
            data {
                id
                ticketId
                encryptId
                requestId
                zoneId
                price
                discount
                sequenceId
                generatedDate
                checking
                checkingTimeMill
                checkingDate
                processTimeMill
                qrData
                share
                event {
                    id
                    configName
                    eventName
                    eventId
                    eventDate
                    eventTime
                    eventDescription
                    eventLocation
                    maxTicket
                    organizer
                    image
                }
            }
        }
    }
`
export const GET_MY_PROFILE = gql`
    query GetMyProfile($userId: String!) {
        getMyProfile(userId: $userId)
    }
`;

export const UPDATE_PROFILE = gql`
    mutation UpdateUser($user: UserInput) {
        updateUser(user: $user)
    }
`
export const GET_ARCHIVE_CONCERT = gql`
    query GetConcertArchive($contact: String!) {
        getConcertArchive(contact: $contact)
    }

`
export const REMOVE_USER_QUEUE = gql`
    mutation RemoveUserQueue($queueId:String!) {
        removeUserQueue(queueId: $queueId)
    }
`;


export const GET_TICKET_COUNTS = gql`
    query GetTicketCount($requestId: String!, $eventId: String!) {
        getTicketCount(requestId: $requestId, eventId: $eventId)
    }
`;

export const ADD_CONCERT_ARCHIVE = gql`
    mutation AddToArchiveConcert($concert: InputConcertArchive) {
        addToArchiveConcert(concert: $concert)
    }

`
export const GET_PUZZLE_RESOLVER = gql`
    query ValidatePuzzleResolved($contact: String!) {
        validatePuzzleResolved(contactNumber: $contact)
    }

`
export const GENERATE_PAYHERE_HASH = gql`
    mutation GeneratePayHereHash($paymentRequest : PaymentHashRequestInput) {
        generatePayHereHash(paymentRequest: $paymentRequest)
    }

`
export const VALIDATE_PAYHERE_PAYMENT = gql`
    query ValidatePayhereRequest($orderId: String!) {
        validatePayhereRequest(orderId: $orderId)
    }
`

export const TICKET_VALIDATION = gql`
    mutation TicketValidation($request: TicketValidateInput!) {
        ticketValidation(request: $request)
    }

`
export const GET_QUEUE_IDS = gql`
    query GetQueueIds($requestId: String!) {
        getQueueIds(requestId: $requestId)
    }
`
