const {Kafka}=require("kafkajs");

const kafka =  new  Kafka({
    clientId:'kafka-producer-app',
    brokers:['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const consumeMEssage = async () => {
    await consumer.connect();
    console.log("Consumer connected");
    
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message: ${message.value.toString()} from topic: ${topic}`);
        },
    });
}

consumeMEssage()
.catch(e => {
    console.error("Error in consuming message", e);
    process.exit(1);
});


