export {};

declare global {
    interface Window {
        easyPack: {
            open: (config: {
                mapType?: string;
                onpoint?: (point: { name: string }) => void;
                onclose?: () => void;
            }) => void;
            init: (config: { mapType?: string; apiKey?: string }) => void;
        };
    }
}
