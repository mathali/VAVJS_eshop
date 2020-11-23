const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.use(express.static('public'));

app.listen(8080, ()=>{
    console.log("[INFO] Listening");
})

/*app.get('/index.html', function(req, res){
    res.sendFile(__dirname+"/index.html");
});*/

var connection = mysql.createConnection({
    host : 'mydb',      // lebo docker
    user : 'root',
    password : 'root',
    database : 'eshop'
})

connection.connect();

var createCustomers = `CREATE TABLE \`customers\` (
                \`id\` int unsigned NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) CHARACTER SET utf8 COLLATE utf8_slovak_ci NOT NULL,
                \`phone_no\` int unsigned NOT NULL,
                \`email\` varchar(255) CHARACTER SET utf8 COLLATE utf8_slovak_ci NOT NULL,
                \`street\` varchar(255) CHARACTER SET utf8 COLLATE utf8_slovak_ci NOT NULL,
                \`city\` varchar(255) CHARACTER SET utf8 COLLATE utf8_slovak_ci NOT NULL,
                \`country\` varchar(255) CHARACTER SET utf8 COLLATE utf8_slovak_ci NOT NULL,
                \`post_code\` int unsigned NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`name\` (\`name\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovak_ci;`;


var createOrders = `CREATE TABLE \`orders\` (
                \`id\` int unsigned NOT NULL AUTO_INCREMENT,
                \`amount\` int unsigned NOT NULL,
                \`customer_key\` int unsigned NOT NULL,
                \`product_key\` int unsigned NOT NULL,
                \`state\` varchar(255) CHARACTER SET utf8 COLLATE utf8_slovak_ci NOT NULL,
                PRIMARY KEY (\`id\`),
                KEY \`customer_key\` (\`customer_key\`),
                KEY \`product_key\` (\`product_key\`),
                CONSTRAINT \`order_ibfk_1\` FOREIGN KEY (\`customer_key\`) REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`order_ibfk_2\` FOREIGN KEY (\`product_key\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovak_ci;`;

var createProducts = `CREATE TABLE \`products\` (
                \`id\` int unsigned NOT NULL AUTO_INCREMENT,
                \`name\` char(255) CHARACTER SET utf8 COLLATE utf8_slovak_ci NOT NULL,
                \`cost\` float NOT NULL,
                \`image_src\` varchar(500) COLLATE utf8_slovak_ci NOT NULL,
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovak_ci; `;


var createCounter = `CREATE TABLE \`counter\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`hit_count\` int unsigned NOT NULL,
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovak_ci;`;

//seed
var products = [
    {
        name: 'test1',
        cost: '100.0',
        image_src: 'fiit.stuba.sk'
    },
    {
        name: 'test2',
        cost: '200.0',
        image_src: 'fiit.stuba.sk'
    },
    {
        name: 'test3',
        cost: '300.0',
        image_src: 'fiit.stuba.sk'
    },
];

var strCtr = 'INSERT INTO counter (hit_count) VALUES (\'0\')';
var str = 'INSERT INTO products (name, cost, image_src) VALUES ';
var strProducts = products.map(product => {
    return '(\'' + product.name+'\', \'' + product.cost+'\', \'' + product.image_src+'\')';
});

str += strProducts.join(',');
str += ';';

var customersTest = `SELECT *
            FROM information_schema.tables
            WHERE table_schema = 'eshop'
            AND table_name = 'customers';`;

var ordersTest = `SELECT *
            FROM information_schema.tables
            WHERE table_schema = 'eshop'
            AND table_name = 'orders';`;

var productsTest = `SELECT *
            FROM information_schema.tables
            WHERE table_schema = 'eshop'
            AND table_name = 'products';`;

var counterTest = `SELECT *
            FROM information_schema.tables
            WHERE table_schema = 'eshop'
            AND table_name = 'counter';`;

var tableTest = [false, false, false];

function queryPromise(str){
    return new Promise((resolve, reject) => {connection.query(str, function (error, results, fields){
            var flag;
            if(error) throw error;
            if(results[0] == undefined){
                flag = true;
                
            }else{
                flag = false;
            }
            resolve(flag);
        });
    });
}

queryPromise(customersTest).then(res =>{
    if(res){
        connection.query(createCustomers, function (error, results, fields){
            if(error) throw error;
        });
    }
 })
.then(res => {queryPromise(productsTest).then(res =>{
    if(res){
        connection.query(createProducts, function (error, results, fields){
            if(error) throw error;
        });
    }
}).then(res => {
    queryPromise('SELECT * FROM products').then(res =>{
        if(res){
            queryPromise(str);
        };
    }).then(res => {
        queryPromise('SELECT * FROM counter').then(res =>{
            if(res){
                queryPromise(strCtr);
            };
    }).then(res=>{
        connection.end();
        });
    }) 
    
})})
.then(res => {queryPromise(ordersTest).then(res =>{
    if(res){
        connection.query(createOrders, function (error, results, fields){
            if(error) throw error;
        });
    }
})})
.then(res => {queryPromise(counterTest).then(res =>{
    if(res){
        connection.query(createCounter, function (error, results, fields){
            if(error) throw error;
        });
    }
})})
   
 
// treba vycistit docker, vsetko premazat, pozriet command