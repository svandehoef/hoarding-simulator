// configuration
let config = {
    customers: 100,
    consumptionInterval: 24, // per 24 ticks
    deliveryInterval: 24,
    defaultPrivateStock: 5,
    adaptedPrivateStock: 30,
    reserve: 8,
    stockSizeDays: 2
};

config.stockLevel = config.stockSizeDays * config.customers * config.deliveryInterval / config.consumptionInterval;
console.log(`stocklevel ${config.stockLevel}`);


let clock = 0;

let stock = config.stockLevel;
let timeSinceLastDelivery = 0;
let customers = [];
for (let i = 0; i < config.customers; i++) {
    customers.push({
        stock: config.defaultPrivateStock + Math.floor(Math.random() * 10),
        stockLevel: config.defaultPrivateStock,
        timeSinceLastConsumption: Math.floor(Math.random() * 24)
    })
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function updateCustomer(customer) {
    customer.timeSinceLastConsumption += 1;
    if (customer.timeSinceLastConsumption >= config.consumptionInterval && customer.stock > 0) {
        customer.stock -= 1;
        customer.timeSinceLastConsumption = 0;
    }
    if (customer.stock < customer.stockLevel) {
        let buyQuantity = customer.stockLevel - customer.stock + config.reserve;
        let amount = Math.min(buyQuantity, stock);
        customer.stock += amount;
        stock -= amount;
        if (amount === 0) {
            customer.stockLevel = config.adaptedPrivateStock;
        }
    }
}

function update() {
    clock += 1;
    timeSinceLastDelivery += 1;
    if (timeSinceLastDelivery === 24) {
        console.log('delivery');
        stock = config.stockLevel;
        timeSinceLastDelivery = 0;
    }
    shuffle(customers);
    for (let customer of customers) {
        updateCustomer(customer);
    }
    if (clock === 100) {
        stock = 0;
    }
    let numHoarders = 0;
    for (let customer of customers) {
        if (customer.stockLevel === config.adaptedPrivateStock) {
            numHoarders += 1;
        }
    }
    console.log(`clock: ${clock}: stock ${stock} hoarders ${numHoarders}`);
}

// setInterval(update, 1000);

for (let i = 0; i < 1000; i++) {
    update();
}