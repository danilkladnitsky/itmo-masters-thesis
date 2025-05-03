
export interface CreateHttpModule {
    port: number;
}

export interface HttpModule {
    stop: () => void;
}