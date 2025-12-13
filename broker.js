/**
 * Broker - Central message broker for Publish-Subscribe pattern
 * Manages subscriptions and routes messages from publishers to subscribers
 */
export class Broker {
    constructor() {
        // Map of topic -> Set of subscribers
        this.subscriptions = new Map();
        // Store message history for new subscribers
        this.messageHistory = new Map();
    }

    /**
     * Subscribe a subscriber to a topic
     * @param {string} topic - The topic to subscribe to (e.g., stock symbol)
     * @param {Subscriber} subscriber - The subscriber instance
     */
    subscribe(topic, subscriber) {
        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, new Set());
        }
        this.subscriptions.get(topic).add(subscriber);
        
        // Send recent message history to new subscriber
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
     * @param {string} topic - The topic to publish to
     * @param {Object} message - The message data
     */
    publish(topic, message) {
        // Store message in history
        this.messageHistory.set(topic, message);
        
        // Notify all subscribers
        if (this.subscriptions.has(topic)) {
            const subscribers = this.subscriptions.get(topic);
            subscribers.forEach(subscriber => {
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

