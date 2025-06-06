import { EventHubConsumerClient, ReceivedEventData, PartitionContext } from "@azure/event-hubs";

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
            console.log(`[${(new Date).toISOString()}] “No new events” — partition ${context.partitionId}`);
            return;
        }

        console.log(`[${(new Date).toISOString()}] Partition "${context.partitionId}": received ${events.length} event(s).`);

        for (const event of events) {
            console.log(`\n[${(new Date).toISOString()}] Event received:`);
            console.log(`  · Partition: ${context.partitionId}`);
            console.log(`  · Offset: ${event.enqueuedTimeUtc.toISOString()}`);
            console.log(`  · Sequence: ${event.sequenceNumber}`);
            console.log(`  · Body:`, JSON.stringify(event.body));
        }

        try {
            await context.updateCheckpoint(events[events.length - 1]);
            console.log(`[${(new Date).toISOString()}] Updated checkpoint for partition "${context.partitionId}", Seq#: ${events[events.length - 1].sequenceNumber}`);
        } catch (err) {
            console.error(`[${(new Date).toISOString()}] Error updating checkpoint on partition "${context.partitionId}":`, err);
        }
    }

    /**
     * @description Called whenever an error occurs in the Event Hub consumer.
     * @param {Error} err                - The encountered error.
     * @param {PartitionContext} context - Context object containing partition info where the error occurred.
     * @returns {Promise<void>}
     */
    private async processErrorHandler(err: Error, context: PartitionContext): Promise<void> {
        console.error(`\n[${(new Date).toISOString()}] Consumer error:`);
        console.error(`  · Partition: ${context.partitionId}`);
        console.error(`  · Message:`, err);
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