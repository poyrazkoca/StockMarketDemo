/**
 * Broker - Central Message Broker for Publish-Subscribe Pattern
 * 
 * The Broker is the core component of the Publish-Subscribe architectural pattern.
 * It acts as an intermediary between publishers and subscribers, enabling:
 * 
 * 1. Decoupled Communication: Publishers and subscribers don't know about each other
 * 2. Asynchronous Message Routing: Messages are distributed asynchronously to all subscribers
 * 3. Dynamic Subscriptions: Subscribers can subscribe/unsubscribe at runtime
 * 4. Topic-Based Filtering: Messages are routed based on topics (stock symbols)
 * 
 * Architecture Pattern: Publish-Subscribe (Pub-Sub)
 * - Publishers publish messages to topics without knowing who will receive them
 * - Subscribers subscribe to topics without knowing who publishes to them
 * - The broker manages all routing and message distribution
 * 
 * Message Flow:
 * Publisher -> Broker.publish(topic, message) -> Broker routes to all subscribers of topic
 */
export class Broker {
    /**
     * Constructor - Initialize the broker
     * Creates data structures to manage subscriptions and message history
     */
    constructor() {
        /**
         * Subscriptions Map
         * Key: Topic (stock symbol, e.g., "AAPL")
         * Value: Set of Subscriber instances subscribed to that topic
         * This enables efficient message routing to all subscribers of a topic
         */
        this.subscriptions = new Map();
        
        /**
         * Message History Map
         * Key: Topic (stock symbol)
         * Value: Last message published to that topic
         * Used to send recent messages to newly subscribed subscribers
         */
        this.messageHistory = new Map();
    }

    /**
     * Subscribe a subscriber to a topic
     * 
     * This method demonstrates the dynamic subscription capability of the pattern.
     * Subscribers can subscribe to topics at any time, and will immediately
     * receive the latest message if available (demonstrating message persistence).
     * 
     * @param {string} topic - The topic to subscribe to (e.g., stock symbol like "AAPL")
     * @param {Subscriber} subscriber - The subscriber instance to add to the topic
     */
    subscribe(topic, subscriber) {
        // Create topic entry if it doesn't exist
        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, new Set());
        }
        
        // Add subscriber to the topic's subscriber set
        // Using Set ensures no duplicate subscriptions
        this.subscriptions.get(topic).add(subscriber);
        
        /**
         * Send recent message history to new subscriber
         * This ensures new subscribers receive the latest state immediately,
         * demonstrating message persistence in the publish-subscribe pattern
         */
        if (this.messageHistory.has(topic)) {
            const lastMessage = this.messageHistory.get(topic);
            subscriber.receive(topic, lastMessage);
        }
        
        console.log(`Subscriber ${subscriber.id} subscribed to topic: ${topic}`);
    }

    /**
     * Unsubscribe a subscriber from a topic
     * @param {string} topic - The topic to unsubscribe from
     * @param {Subscriber} subscriber - The subscriber instance
     */
    unsubscribe(topic, subscriber) {
        if (this.subscriptions.has(topic)) {
            this.subscriptions.get(topic).delete(subscriber);
            console.log(`Subscriber ${subscriber.id} unsubscribed from topic: ${topic}`);
        }
    }

    /**
     * Publish a message to all subscribers of a topic
     * 
     * This is the core method that implements the publish-subscribe pattern.
     * When a publisher calls this method:
     * 1. The message is stored in history for new subscribers
     * 2. The message is asynchronously distributed to all subscribers of the topic
     * 3. Each subscriber receives the message independently (decoupled communication)
     * 
     * This demonstrates asynchronous, message-driven communication where:
     * - Publishers don't need to know who receives the message
     * - Multiple subscribers can receive the same message simultaneously
     * - The broker handles all routing logic
     * 
     * @param {string} topic - The topic to publish to (e.g., stock symbol)
     * @param {Object} message - The message data to broadcast
     */
    publish(topic, message) {
        /**
         * Store message in history
         * This allows new subscribers to receive the latest state when they subscribe
         */
        this.messageHistory.set(topic, message);
        
        /**
         * Notify all subscribers asynchronously
         * This loop iterates through all subscribers and calls their receive method.
         * In a real-world scenario, this could be implemented with async/await or
         * message queues for true asynchronous processing.
         * 
         * The forEach loop demonstrates the broadcast nature: one message -> many receivers
         */
        if (this.subscriptions.has(topic)) {
            const subscribers = this.subscriptions.get(topic);
            subscribers.forEach(subscriber => {
                // Each subscriber receives the message independently
                subscriber.receive(topic, message);
            });
        }
        
        console.log(`Published message to topic ${topic}:`, message);
    }

    /**
     * Get list of subscribers for a topic
     * @param {string} topic - The topic
     * @returns {Array} List of subscriber IDs
     */
    getSubscribers(topic) {
        if (!this.subscriptions.has(topic)) {
            return [];
        }
        return Array.from(this.subscriptions.get(topic)).map(sub => sub.id);
    }

    /**
     * Get all topics
     * @returns {Array} List of all topics
     */
    getAllTopics() {
        return Array.from(this.subscriptions.keys());
    }
}

