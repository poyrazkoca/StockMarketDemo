import { Broker } from './broker.js';
import { Publisher } from './publisher.js';
import { Subscriber } from './subscriber.js';

// Initialize the broker
const broker = new Broker();

// Publisher instances for different stocks
const publishers = new Map();
let currentPublisher = null;
let subscriberCounter = 0;
const subscribers = new Map();

// Initialize publishers for all stocks
const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
stockSymbols.forEach(symbol => {
    const publisher = new Publisher(broker, symbol);
    publishers.set(symbol, publisher);
});

// Set default publisher
currentPublisher = publishers.get('AAPL');

// DOM Elements
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

// Event Listeners
startPublishingBtn.addEventListener('click', () => {
    if (currentPublisher) {
        currentPublisher.startPublishing(2000);
        publisherState.textContent = 'Publishing';
        publisherState.parentElement.classList.add('publishing');
        updatePublisherStatus();
    }
});

stopPublishingBtn.addEventListener('click', () => {
    if (currentPublisher) {
        currentPublisher.stopPublishing();
        publisherState.textContent = 'Stopped';
        publisherState.parentElement.classList.remove('publishing');
    }
});

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

addSubscriberBtn.addEventListener('click', () => {
    subscriberCounter++;
    const subscriber = new Subscriber(
        `sub-${subscriberCounter}`,
        `Subscriber ${subscriberCounter}`,
        broker
    );
    
    subscribers.set(subscriber.id, subscriber);
    
    // Set up update callback
    subscriber.setUpdateCallback((topic, message) => {
        updateSubscriberCard(subscriber.id, topic, message);
    });
    
    // Add to dropdown
    const option = document.createElement('option');
    option.value = subscriber.id;
    option.textContent = subscriber.name;
    subscriberSelect.appendChild(option);
    
    // Create subscriber card
    createSubscriberCard(subscriber);
    
    // Auto-subscribe to current stock
    subscriber.subscribe(stockSymbolSelect.value);
    updateSubscriberCard(subscriber.id);
});

removeSubscriberBtn.addEventListener('click', () => {
    if (subscribers.size === 0) return;
    
    const lastSubscriberId = Array.from(subscribers.keys())[subscribers.size - 1];
    const subscriber = subscribers.get(lastSubscriberId);
    
    // Unsubscribe from all topics
    stockSymbols.forEach(symbol => {
        subscriber.unsubscribe(symbol);
    });
    
    // Remove from map
    subscribers.delete(lastSubscriberId);
    
    // Remove from dropdown
    const option = Array.from(subscriberSelect.options).find(
        opt => opt.value === lastSubscriberId
    );
    if (option) option.remove();
    
    // Remove card
    const card = document.getElementById(`subscriber-${lastSubscriberId}`);
    if (card) card.remove();
});

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

// Create subscriber card in UI
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

// Update subscriber card with current state
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

// Create a UI subscriber to display latest updates
const uiSubscriber = new Subscriber('ui-display', 'UI Display', broker);
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

// Update publisher status
function updatePublisherStatus() {
    if (currentPublisher) {
        // Subscribe UI to current publisher's stock
        stockSymbols.forEach(symbol => {
            uiSubscriber.unsubscribe(symbol);
        });
        uiSubscriber.subscribe(currentPublisher.symbol);
    }
}

// Initialize UI
updatePublisherStatus();
currentStock.textContent = stockSymbolSelect.value;

// Add initial subscriber for demo
setTimeout(() => {
    addSubscriberBtn.click();
}, 500);

