declare module 'baffle' {
    interface BaffleOptions {
        characters?: string;
        exclude?: string[];
        speed?: number;
    }

    interface Baffle {
        start(): void;
        stop(): void;
        text(fn: (text: string) => string): void;
        reveal(duration?: number, delay?: number): void;
    }

    function baffle(element: HTMLElement | string, options?: BaffleOptions): Baffle;
    export = baffle;
}
