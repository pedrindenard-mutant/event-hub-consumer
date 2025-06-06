import Consumer from "./consumer";
import Config from "./config";

// Gracefully shuts down the application by exiting the process.
export const shutdown = async () => process.exit(0);

// Listen for termination signals and invoke shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the Event Hub consumer with environment-provided configuration
Consumer.start(
    Config.consumer_group,
    Config.consumer_connection,
    Config.consumer_name
);