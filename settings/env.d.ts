declare namespace NodeJS {

    interface ProcessEnv {
        CONSUMER_GROUP: string;
        CONSUMER_CONNECTION: string;
        CONSUMER_NAME: string;
    }

}