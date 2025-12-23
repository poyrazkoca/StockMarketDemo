/**
 * Subscriber - Receives and Processes Stock Price Updates
 * 
 * The Subscriber component in the Publish-Subscribe pattern:
 * 1. Subscribes to topics (stock symbols) of interest
 * 2. Receives messages asynchronously from the broker
 * 3. Processes messages independently without knowing the publisher
 * 
 * This class demonstrates:
 * - Asynchronous message reception (via callback mechanism)
 * - Dynamic subscriptions (can subscribe/unsubscribe at runtime)
 * - Decoupled communication (subscriber only interacts with broker)
 * - Message history tracking
 * 
 * Architecture Pattern: Publish-Subscribe
 * Multiple subscribers can subscribe to the same topic and receive
 * messages independently, demonstrating one-to-many communication.
 */
export class Subscriber {
    /**
     * Constructor - Initialize a subscriber
     * 
     * @param {string} id - Unique identifier for this subscriber
     * @param {string} name - Human-readable name for display
     * @param {Broker} broker - Reference to the central message broker
     */
    constructor(id, name, broker) {
        this.id = id; // Unique subscriber identifier
        this.name = name; // Display name
        this.broker = broker; // Reference to broker for subscription management
        this.receivedMessages = []; // Message history (last 50 messages)
        this.updateCallback = null; // Callback function for asynchronous notifications
    }

    /**
     * Set callback function to be called when message is received
     * @param {Function} callback - Callback function
     */
    setUpdateCallback(callback) {
        this.updateCallback = callback;
    }

    /**
     * Receive a Message from the Broker
     * 
     * This method is called by the broker when a message is published to a topic
     * that this subscriber is subscribed to. This demonstrates asynchronous message
     * delivery in the publish-subscribe pattern.
     * 
     * Key aspects:
     * - Asynchronous invocation: Called by broker when messages arrive
     * - Message-driven: Triggered by message publication events
     * - Decoupled: Subscriber doesn't know which publisher sent the message
     * - Callback pattern: Uses callback for asynchronous UI updates
     * 
     * @param {string} topic - The topic (stock symbol) the message was published to
     * @param {Object} message - The message data containing price update information
     */
    receive(topic, message) {
        /**
         * Store message in history
         * This allows subscribers to track received messages over time
         */
        this.receivedMessages.push({
            topic,
            message,
            receivedAt: new Date().toISOString()
        });

        /**
         * Limit message history to prevent memory issues
         * Keep only the last 50 messages (FIFO queue)
         */
        if (this.receivedMessages.length > 50) {
            this.receivedMessages.shift();
        }

        /**
         * Invoke callback for asynchronous UI updates
         * This callback pattern allows the subscriber to notify external code
         * (like UI components) when messages are received, demonstrating
         * asynchronous, event-driven programming
         */
        if (this.updateCallback) {
            this.updateCallback(topic, message);
        }

        console.log(`Subscriber ${this.name} (${this.id}) received update for ${topic}:`, message);
    }

    /**
     * Subscribe to a Topic
     * 
     * Subscribes this subscriber to a specific topic (stock symbol).
     * After subscription, the subscriber will receive all messages published
     * to that topic. This demonstrates dynamic subscription management.
     * 
     * @param {string} topic - The topic (stock symbol) to subscribe to
     */
    subscribe(topic) {
        this.broker.subscribe(topic, this);
    }

    /**
     * Unsubscribe from a Topic
     * 
     * Unsubscribes this subscriber from a specific topic.
     * After unsubscription, the subscriber will no longer receive messages
     * for that topic. This demonstrates runtime subscription changes.
     * 
     * @param {string} topic - The topic (stock symbol) to unsubscribe from
     */
    unsubscribe(topic) {
        this.broker.unsubscribe(topic, this);
    }

    /**
     * Get message history
     * @returns {Array} Array of received messages
     */
    getMessageHistory() {
        return this.receivedMessages;
    }
}

