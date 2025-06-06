import dotenv from "dotenv";

// Load variables from .env into process.env
dotenv.config();

/**
 * @property {string} consumer_group      - The name of the Event Hub consumer group.
 * @property {string} consumer_connection - The connection string or namespace for Event Hubs.
 * @property {string} consumer_name       - The name of the Event Hub to connect to.
 */
interface EnvConfig {
    consumer_group: string;
    consumer_connection: string;
    consumer_name: string;
}

/**
 * @description Reads and exposes required environment variables. Make sure to define:
 *   - CONSUMER_GROUP
 *   - CONSUMER_CONNECTION
 *   - CONSUMER_NAME
 */
const config: EnvConfig = {
    consumer_group: process.env.CONSUMER_GROUP || "",
    consumer_connection: process.env.CONSUMER_CONNECTION || "",
    consumer_name: process.env.CONSUMER_NAME || ""
};

export default config;