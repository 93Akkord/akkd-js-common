declare global {
    interface Console {
        save(data: any, filename: string): void;
    }
}
export {};
