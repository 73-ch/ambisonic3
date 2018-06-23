import cable from "actioncable";

let consumer;

function createChannel(...args) {
    console.log(...args);
    if (!consumer) {
        consumer = cable.createConsumer();
    }

    return consumer.subscriptions.create(...args);
}

export default createChannel;