import {v5 as uuid5} from 'uuid';


const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export function generateUUIDFromString(input?: string): string {
    return input && input !== "" ? uuid5(input, MY_NAMESPACE) : uuid5("", MY_NAMESPACE);
}
export function generateRandomEmail() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const usernameLength = Math.floor(Math.random() * 10) + 5;
    let username = '';
    for (let i = 0; i < usernameLength; i++) {
        username += chars[Math.floor(Math.random() * chars.length)];
    }
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${randomDomain}`;
}

