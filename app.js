/**
 * Stock Market Demo - Publish-Subscribe Architecture Implementation
 * 
 * This application demonstrates the Publish-Subscribe (Pub-Sub) architectural pattern
 * in the context of a stock market price update system. The pattern enables:
 * 
 * 1. Decoupled Communication: Publishers and Subscribers don't know about each other
 * 2. Asynchronous Messaging: Messages are broadcast asynchronously through the broker
 * 3. Scalability: Multiple subscribers can receive the same message simultaneously
 * 4. Dynamic Subscriptions: Subscribers can subscribe/unsubscribe at runtime
 * 
 * Architecture Components:
 * - Broker: Central message router that manages subscriptions and message distribution
 * - Publisher: Publishes stock price updates to specific topics (stock symbols)
 * - Subscriber: Receives updates for subscribed topics via the broker
 * 
 * Message Flow:
 * Publisher -> Broker -> All Subscribed Subscribers
 */

import { Broker } from './broker.js';
import { Publisher } from './publisher.js';
import { Subscriber } from './subscriber.js';

/**
 * Initialize the central message broker
 * The broker acts as the intermediary between publishers and subscribers,
 * managing subscriptions and routing messages asynchronously.
 */
const broker = new Broker();

/**
 * Application State Management
 * 
 * Publishers: Map of stock symbols to Publisher instances
 * Each publisher publishes price updates for a specific stock symbol (topic)
 */
const publishers = new Map();
let currentPublisher = null; // Currently active publisher for UI controls

/**
 * Subscribers: Map of subscriber IDs to Subscriber instances
 * Each subscriber can subscribe to multiple stock symbols (topics)
 */
let subscriberCounter = 0; // Counter for generating unique subscriber IDs
const subscribers = new Map();

/**
 * Initialize publishers for all available stocks
 * Each stock symbol acts as a topic in the publish-subscribe pattern
 */
const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
stockSymbols.forEach(symbol => {
    const publisher = new Publisher(broker, symbol);
    publishers.set(symbol, publisher);
});

// Set default publisher for initial UI state
currentPublisher = publishers.get('AAPL');

/**
 * DOM Element References
 * These elements are used to interact with the UI and display real-time updates
 */
const startPublishingBtn = document.getElementById('startPublishing');
const stopPublishingBtn = document.getElementById('stopPublishing');
const stockSymbolSelect = document.getElementById('stockSymbol');
const addSubscriberBtn = document.getElementById('addSubscriber');
const removeSubscriberBtn = document.getElementById('removeSubscriber');
const subscriberSelect = document.getElementById('subscriberSelect');
const topicSelect = document.getElementById('topicSelect');
const subscribeBtn = document.getElementById('subscribeBtn');
const unsubscribeBtn = document.getElementById('unsubscribeBtn');
const publisherState = document.getElementById('publisherState');
const currentStock = document.getElementById('currentStock');
const latestUpdateContent = document.getElementById('latestUpdateContent');
const subscribersContainer = document.getElementById('subscribersContainer');

/**
 * Event Listeners - Publisher Controls
 * 
 * These handlers demonstrate the publisher's ability to start/stop publishing
 * and switch between different stock symbols (topics)
 */

/**
 * Start Publishing Handler
 * Initiates asynchronous price updates at regular intervals (2000ms)
 * When publishing starts, the publisher sends messages to the broker,
 * which then broadcasts them to all subscribed subscribers
 */
startPublishingBtn.addEventListener('click', () => {
    if (currentPublisher) {
        currentPublisher.startPublishing(2000);
        publisherState.textContent = 'Publishing';
        publisherState.parentElement.classList.add('publishing');
        updatePublisherStatus();
    }
});

/**
 * Stop Publishing Handler
 * Stops the asynchronous publishing process
 * Note: Subscribers remain subscribed but won't receive new updates
 */
stopPublishingBtn.addEventListener('click', () => {
    if (currentPublisher) {
        currentPublisher.stopPublishing();
        publisherState.textContent = 'Stopped';
        publisherState.parentElement.classList.remove('publishing');
    }
});

/**
 * Stock Symbol Change Handler
 * Switches the active publisher to a different stock symbol
 * Demonstrates how publishers can be dynamically changed
 */
stockSymbolSelect.addEventListener('change', (e) => {
    const symbol = e.target.value;
    if (currentPublisher) {
        currentPublisher.stopPublishing();
    }
    currentPublisher = publishers.get(symbol);
    currentStock.textContent = symbol;
    updatePublisherStatus();
    if (publisherState.textContent === 'Publishing') {
        currentPublisher.startPublishing(2000);
    }
});

/**
 * Event Listeners - Subscriber Management
 * 
 * These handlers demonstrate dynamic subscriber creation and subscription management,
 * showcasing the flexibility of the publish-subscribe pattern
 */

/**
 * Add Subscriber Handler
 * Creates a new subscriber instance and adds it to the system
 * Demonstrates:
 * 1. Dynamic subscriber creation at runtime
 * 2. Callback-based message handling (asynchronous notification)
 * 3. Automatic subscription to current stock for demo purposes
 */
addSubscriberBtn.addEventListener('click', () => {
    subscriberCounter++;
    const subscriber = new Subscriber(
        `sub-${subscriberCounter}`,
        `Subscriber ${subscriberCounter}`,
        broker
    );
    
    subscribers.set(subscriber.id, subscriber);
    
    /**
     * Set up update callback for asynchronous message handling
     * This callback is invoked whenever the subscriber receives a message
     * from the broker, demonstrating the asynchronous nature of the pattern
     */
    subscriber.setUpdateCallback((topic, message) => {
        updateSubscriberCard(subscriber.id, topic, message);
    });
    
    // Add subscriber to dropdown for subscription management
    const option = document.createElement('option');
    option.value = subscriber.id;
    option.textContent = subscriber.name;
    subscriberSelect.appendChild(option);
    
    // Create visual representation of subscriber
    createSubscriberCard(subscriber);
    
    // Auto-subscribe to current stock for demonstration
    subscriber.subscribe(stockSymbolSelect.value);
    updateSubscriberCard(subscriber.id);
});

/**
 * Remove Subscriber Handler
 * Removes the last created subscriber from the system
 * Demonstrates dynamic unsubscription and cleanup
 */
removeSubscriberBtn.addEventListener('click', () => {
    if (subscribers.size === 0) return;
    
    const lastSubscriberId = Array.from(subscribers.keys())[subscribers.size - 1];
    const subscriber = subscribers.get(lastSubscriberId);
    
    // Unsubscribe from all topics before removal
    stockSymbols.forEach(symbol => {
        subscriber.unsubscribe(symbol);
    });
    
    // Remove from internal data structures
    subscribers.delete(lastSubscriberId);
    
    // Remove from dropdown
    const option = Array.from(subscriberSelect.options).find(
        opt => opt.value === lastSubscriberId
    );
    if (option) option.remove();
    
    // Remove visual card
    const card = document.getElementById(`subscriber-${lastSubscriberId}`);
    if (card) card.remove();
});

/**
 * Subscribe Handler
 * Allows a selected subscriber to subscribe to a specific stock symbol (topic)
 * Demonstrates runtime subscription management
 */
subscribeBtn.addEventListener('click', () => {
    const subscriberId = subscriberSelect.value;
    const topic = topicSelect.value;
    
    if (subscriberId && topic) {
        const subscriber = subscribers.get(subscriberId);
        if (subscriber) {
            subscriber.subscribe(topic);
            updateSubscriberCard(subscriberId);
        }
    }
});

/**
 * Unsubscribe Handler
 * Allows a selected subscriber to unsubscribe from a specific stock symbol (topic)
 * Demonstrates runtime unsubscription management
 */
unsubscribeBtn.addEventListener('click', () => {
    const subscriberId = subscriberSelect.value;
    const topic = topicSelect.value;
    
    if (subscriberId && topic) {
        const subscriber = subscribers.get(subscriberId);
        if (subscriber) {
            subscriber.unsubscribe(topic);
            updateSubscriberCard(subscriberId);
        }
    }
});

/**
 * UI Helper Functions
 * These functions manage the visual representation of subscribers and their state
 */

/**
 * Create Subscriber Card
 * Creates a visual card in the UI to represent a subscriber
 * Shows subscriber information, subscriptions, and received messages
 * @param {Subscriber} subscriber - The subscriber instance to display
 */
function createSubscriberCard(subscriber) {
    const card = document.createElement('div');
    card.id = `subscriber-${subscriber.id}`;
    card.className = 'subscriber-card';
    
    card.innerHTML = `
        <div class="subscriber-header">
            <span class="subscriber-name">${subscriber.name}</span>
            <span class="subscriber-id">${subscriber.id}</span>
        </div>
        <div class="subscriptions-list">
            <strong>Subscriptions:</strong> <span id="subs-${subscriber.id}">None</span>
        </div>
        <div class="latest-message" id="msg-${subscriber.id}">
            <h4>Latest Message:</h4>
            <div class="message-content">No messages received yet</div>
        </div>
    `;
    
    subscribersContainer.appendChild(card);
    updateSubscriberCard(subscriber.id);
}

/**
 * Update Subscriber Card
 * Updates the visual representation of a subscriber with current state
 * This function is called asynchronously when messages are received,
 * demonstrating real-time updates in the publish-subscribe pattern
 * 
 * @param {string} subscriberId - The ID of the subscriber to update
 * @param {string} topic - The topic (stock symbol) of the received message (optional)
 * @param {Object} message - The message data received (optional)
 */
function updateSubscriberCard(subscriberId, topic = null, message = null) {
    const subscriber = subscribers.get(subscriberId);
    if (!subscriber) return;
    
    const card = document.getElementById(`subscriber-${subscriberId}`);
    const subsElement = document.getElementById(`subs-${subscriberId}`);
    const msgElement = document.getElementById(`msg-${subscriberId}`);
    
    // Update subscriptions
    const subscriptions = [];
    stockSymbols.forEach(symbol => {
        const subs = broker.getSubscribers(symbol);
        if (subs.includes(subscriberId)) {
            subscriptions.push(symbol);
        }
    });
    
    if (subscriptions.length > 0) {
        subsElement.innerHTML = subscriptions.map(s => 
            `<span class="subscription-badge">${s}</span>`
        ).join('');
        card.classList.add('active');
    } else {
        subsElement.textContent = 'None';
        card.classList.remove('active');
    }
    
    // Update latest message
    if (message) {
        const changeClass = message.change >= 0 ? 'positive' : 'negative';
        const changeSign = message.change >= 0 ? '+' : '';
        
        msgElement.innerHTML = `
            <h4>Latest Message (${topic}):</h4>
            <div class="message-content">
                <div class="message-price">$${message.price.toFixed(2)}</div>
                <div class="message-change ${changeClass}">
                    ${changeSign}${message.change.toFixed(2)}%
                </div>
                <div style="font-size: 0.8em; color: #666; margin-top: 5px;">
                    ${new Date(message.timestamp).toLocaleTimeString()}
                </div>
            </div>
        `;
    }
}

/**
 * UI Display Subscriber
 * A special subscriber used to display the latest published updates in the UI
 * This demonstrates how subscribers can be used for different purposes
 * (e.g., UI updates, logging, analytics, etc.)
 */
const uiSubscriber = new Subscriber('ui-display', 'UI Display', broker);

/**
 * Set callback for UI subscriber to update the latest update display
 * This callback is invoked asynchronously whenever a message is published
 * to the subscribed topic, demonstrating asynchronous message-driven updates
 */
uiSubscriber.setUpdateCallback((topic, message) => {
    if (topic === currentPublisher?.symbol) {
        const changeClass = message.change >= 0 ? 'positive' : 'negative';
        const changeSign = message.change >= 0 ? '+' : '';
        
        latestUpdateContent.innerHTML = `
            <div><strong>Symbol:</strong> ${message.symbol}</div>
            <div><strong>Price:</strong> <span class="message-price">$${message.price.toFixed(2)}</span></div>
            <div><strong>Change:</strong> <span class="message-change ${changeClass}">${changeSign}${message.change.toFixed(2)}%</span></div>
            <div><strong>Time:</strong> ${new Date(message.timestamp).toLocaleString()}</div>
        `;
    }
});

/**
 * Update Publisher Status
 * Manages the UI subscriber's subscription to match the current publisher
 * Demonstrates dynamic subscription changes based on user selection
 */
function updatePublisherStatus() {
    if (currentPublisher) {
        // Unsubscribe from all stocks first
        stockSymbols.forEach(symbol => {
            uiSubscriber.unsubscribe(symbol);
        });
        // Subscribe to current publisher's stock
        uiSubscriber.subscribe(currentPublisher.symbol);
    }
}

/**
 * Application Initialization
 * Sets up the initial state of the UI and creates a demo subscriber
 */
updatePublisherStatus();
currentStock.textContent = stockSymbolSelect.value;

/**
 * Create initial subscriber for demonstration purposes
 * This helps users immediately see the pattern in action
 */
setTimeout(() => {
    addSubscriberBtn.click();
}, 500);

