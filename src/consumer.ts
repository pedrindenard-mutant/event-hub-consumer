import { EventHubConsumerClient, ReceivedEventData, PartitionContext } from "@azure/event-hubs";
import { timestamp } from "./utils";

/**
 * @class Consumer
 * @description Encapsulates the Azure Event Hub consumer client. Provides methods to subscribe to events, handle incoming messages, and handle errors.
 */
export default class Consumer {

    private client: EventHubConsumerClient;

    /**
     * @param {string} consumerGroup      - Name of the Event Hub consumer group.
     * @param {string} consumerConnection - Connection string or namespace for the Event Hub.
     * @param {string} consumerName       - Name of the Event Hub to subscribe to.
     */
    private constructor(consumerGroup: string, consumerConnection: string, consumerName: string) {
        this.client = new EventHubConsumerClient(
            consumerGroup,
            consumerConnection,
            consumerName
        );
    }

    /**
     * @description Instantiates a Consumer and begins subscribing to events.
     * @param {string} consumerGroup      - Name of the Event Hub consumer group.
     * @param {string} consumerConnection - Connection string or namespace for the Event Hub.
     * @param {string} consumerName       - Name of the Event Hub to subscribe to.
     * @returns {Consumer}                - The created Consumer instance.
     */
    public static start(consumerGroup: string, consumerConnection: string, consumerName: string): Consumer {
        const instance = new Consumer(consumerGroup, consumerConnection, consumerName);
        instance.subscribeToEvents();
        return instance;
    }

    /**
     * @description Called whenever new events arrive. Logs event metadata and body, then updates the checkpoint to mark processed events.
     * @param {ReceivedEventData[]} events - Array of events received from the partition.
     * @param {PartitionContext} context   - Context object containing partition info.
     * @returns {Promise<void>}
     */
    private async processEventsHandler(events: ReceivedEventData[], context: PartitionContext): Promise<void> {
        if (events.length === 0) {
            console.log(`[${timestamp()}] “No new events” — partition ${context.partitionId}`);
            return;
        }

        console.log(`[${timestamp()}] Partition "${context.partitionId}": received ${events.length} event(s).`);
        
        for (const event of events) {
            console.log(`[${timestamp(event.enqueuedTimeUtc)}] Event received:`);
            console.log(JSON.stringify(event.body, undefined, 4));
        }

        try {
            await context.updateCheckpoint(events[events.length - 1]);
        } catch (err) {
            console.error(`[${timestamp()}] Error updating checkpoint on partition "${context.partitionId}":`, err);
        }

        console.log(`\n`);
    }

    /**
     * @description Called whenever an error occurs in the Event Hub consumer.
     * @param {Error} err                - The encountered error.
     * @param {PartitionContext} context - Context object containing partition info where the error occurred.
     * @returns {Promise<void>}
     */
    private async processErrorHandler(err: Error, context: PartitionContext): Promise<void> {
        console.error(`\n[${timestamp()}] Consumer error:`);
        console.error(`  - Message:`, err);
    }

    /**
     * @description Subscribes to the Event Hub, providing handler functions for incoming events and errors.
     */
    private subscribeToEvents(): void {
        this.client.subscribe({
            processEvents: this.processEventsHandler.bind(this),
            processError: this.processErrorHandler.bind(this)
        });
    }

}