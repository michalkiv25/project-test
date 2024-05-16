"use strict";

function parsCSVDate(orderDate){
    const parts = orderDate.split(" ");
    const datePart = parts[0];
    let [year, month, day] = datePart.split("-");
    // Check if month is a string (i.e., abbreviation)

    if (isNaN(month)) {
        month = month.toUpperCase();
    }
    const [hours, minutes, seconds] = parts[1].split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds);
};

class VodOrders {
    constructor(vodRecords) {
        this.orders = vodRecords.map(record => {
            const [customerId, orderDate, genre, titleId, price] = record.split(',');
            
            return {
                customerId: customerId.trim(),
                orderDate: parsCSVDate(orderDate),
                genre: genre.trim(),
                titleId: titleId.trim(),
                price: parseFloat(price.trim())
            };
        });
    }

 
    createTotalCustomerUsage() {
        // const customerMonthlyUsage = {};
        // this.orders.forEach(order => {
        //     const monthYear = `${order.orderDate.getMonth() + 1}-${order.orderDate.getFullYear()}`;
        //     if (!customerMonthlyUsage[order.customerId]) {
        //         customerMonthlyUsage[order.customerId] = {};
        //     };
        //     if (!customerMonthlyUsage[order.customerId][monthYear]) {
        //         customerMonthlyUsage[order.customerId][monthYear] = 0;
        //     };
        //     customerMonthlyUsage[order.customerId][monthYear] += order.price;
        // });

        // console.log("create total customer usage report");
        // console.log("Customer ID,Month,Total Usage");
        // for (const customerId in customerMonthlyUsage) {
        //     for (const monthYear in customerMonthlyUsage[customerId]) {
        //         console.log(`${customerId},${monthYear},${customerMonthlyUsage[customerId][monthYear]}`);
        //     };
        // };
        const customerMonthlyUsage = {};
        const customerMonthlyDiscounts = {};
        this.orders.forEach(order => {
            const monthYear = `${order.orderDate.getMonth() + 1}-${order.orderDate.getFullYear()}`;
            if (!customerMonthlyUsage[order.customerId]) {
                customerMonthlyUsage[order.customerId] = {};
                customerMonthlyDiscounts[order.customerId] = {};
            }
            if (!customerMonthlyUsage[order.customerId][monthYear]) {
                customerMonthlyUsage[order.customerId][monthYear] = 0;
                customerMonthlyDiscounts[order.customerId][monthYear] = 0;
            }
            customerMonthlyUsage[order.customerId][monthYear] += order.price;
            customerMonthlyDiscounts[order.customerId][monthYear] += this.calculateDiscount(order.customerId, order.orderDate, order.genre);
        });
    
        console.log("Customer ID,Month,Total Usage,Total Discount");
        for (const customerId in customerMonthlyUsage) {
            for (const monthYear in customerMonthlyUsage[customerId]) {
                const totalUsage = customerMonthlyUsage[customerId][monthYear];
                const totalDiscount = customerMonthlyDiscounts[customerId][monthYear];
                console.log(`${customerId},${monthYear},${totalUsage},${totalDiscount}`);
            }
        }
        
    };

    calculateDiscount(customerId, orderDate, genre) {
        const ordersThisMonth = this.orders.filter(order =>
            order.customerId === customerId &&
            order.genre === genre &&
            order.orderDate.getMonth() === orderDate.getMonth() &&
            order.orderDate.getFullYear() === orderDate.getFullYear()
        );
        if (ordersThisMonth.length >= 3) {
            return ordersThisMonth.reduce((total, order) => total + order.price, 0) * 0.25;
        } else {
            return 0;
        }
    }



    createSummaryReport() {
        // const monthlyRevenue = {};
        // const monthlyOrders = {};
        // this.orders.forEach(order => {
        //     const monthYear = `${order.orderDate.getMonth() + 1}-${order.orderDate.getFullYear()}`;
        //     if (!monthlyRevenue[monthYear]) {
        //         monthlyRevenue[monthYear] = 0;
        //         monthlyOrders[monthYear] = 0;
        //     }
        //     monthlyRevenue[monthYear] += order.price;
        //     monthlyOrders[monthYear]++;
        // });

        // console.log("Create summery report:");
        // console.log("Month,Total Revenue,Total Orders");
        // for (const monthYear in monthlyRevenue) {
        //     console.log(`${monthYear},${monthlyRevenue[monthYear]},${monthlyOrders[monthYear]}`);
        // };
        const monthlyRevenue = {};
        const monthlyOrders = {};
        const monthlyDiscounts = {};
    
        this.orders.forEach(order => {
            const monthYear = `${order.orderDate.getMonth() + 1}-${order.orderDate.getFullYear()}`;
            if (!monthlyRevenue[monthYear]) {
                monthlyRevenue[monthYear] = 0;
                monthlyOrders[monthYear] = 0;
                monthlyDiscounts[monthYear] = 0;
            }
            monthlyRevenue[monthYear] += order.price;
            monthlyOrders[monthYear]++;
            monthlyDiscounts[monthYear] += this.calculateDiscount(order.customerId, order.orderDate, order.genre);
        });
    
        console.log("Month,Total Revenue,Total Orders,Total Discounts");
        for (const monthYear in monthlyRevenue) {
            const totalRevenue = monthlyRevenue[monthYear];
            const totalOrders = monthlyOrders[monthYear];
            const totalDiscounts = monthlyDiscounts[monthYear];
            console.log(`${monthYear},${totalRevenue},${totalOrders},${totalDiscounts}`);
        }
    };
};

// Example usage:
const vodRecords = [
"0238383,2024-APR-01 17:54:23, COMEDY,76737227,19.90", 
"0218354,2024-04-04 12:54:23, COMEDY,87227,10.50", 
"0338363,2024-04-02 13:56:23, ACTION,67667,19.90", 
"0238322,2024-04-01 17:52:23, COMEDY,47227,30.90", 
"0218354,2024-04-01 16:51:23, DRAMA,137227,19.90", 
"0238385,2024-05-01 17:54:23, NEWS,96737227,19.90", 
"0238322,2024-04-01 17:54:23, REALITY,96737227,29.90", 
"0238329,2024-05-01 17:54:23, REALITY,96737227,29.90",
"0238329,2024-05-01 17:54:23, REALITY,96737227,29.90",
"0238329,2024-05-01 17:54:23, REALITY,96737227,29.90",
"0238329,2024-05-01 17:54:23, REALITY,96737227,29.90",
"0238383,2024-05-01 18:54:23, COMEDY,5737227,00.90",
"0238383,2024-05-01 17:54:23, ACTION,137227,19.90",
"0238383,2024-05-01 17:54:23, ACTION,137227,19.90",
"0238383,2024-05-01 17:54:23, ACTION,137227,19.90",
"0238383,2024-05-01 17:54:23, ACTION,137227,19.90"
];

const vod = new VodOrders(vodRecords);
vod.createTotalCustomerUsage();
vod.createSummaryReport();

