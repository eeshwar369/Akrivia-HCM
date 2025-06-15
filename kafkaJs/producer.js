const {Kafka}=require("kafkajs");

const kafka =  new  Kafka({
    clientId:'kafka-producer-app',
    brokers:['localhost:9092']
});

const producer =kafka.producer();

const produceMessage = async () => {
    await producer.connect();
    console.log("Producer connected");
    const result = await producer.send({
        topic: 'test-topic',
        messages: [
            { value: 'Hello KafkaJS user!' },
        ],
    });
    console.log("Message sent successfully", result);
    await producer.disconnect();
}   

produceMessage()
.catch(e => {
    console.error("Error in producing message", e);
    process.exit(1);
});

