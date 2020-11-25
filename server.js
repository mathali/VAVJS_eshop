const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.use(express.static('public'));
var sessionParser = require('express-session')({
	secret:"secret",
    resave: true,
	saveUninitialized: true,
	cookie: { secure: false },
});
app.use(cookieParser('your secret here'));
app.use(session(sessionParser));

app.listen(8080, ()=>{
    console.log("[INFO] Listening");
})

app.get('/product_data', (req, res) =>{
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/cart_data', (req, res) =>{
    var output = [];
    if(req.session.items != undefined){
        connection.query('SELECT * FROM products', function (error, results, fields) {
            if (error) throw error;
            for(var i = 0; i < req.session.items.length; i++){
                for(var j = 0; j < results.length; j++){
                    if(req.session.items[i].key == results[j].name){
                        output.push({
                            title: req.session.items[i].key,
                            amount: req.session.items[i].amount,
                            total_cost: req.session.items[i].amount * results[j].cost,
                        })
                        break;
                    }
                }
            }
            res.json(output);
        });
    }else{
        res.send('[Err] Cart is empty');
    }
});

app.post('/to_cart', (req, res)=>{
    var in_cart = false;
    if (req.session.items === undefined) {
        req.session.items = [];
    }else{
        for(var i = 0; i < req.session.items.length; i++){
            if(req.session.items[i].key == req.body['title']){
                req.session.items[i].amount += 1;
                in_cart = true;
                break;
            }
        }
    }
    if(!in_cart){
        req.session.items.push({
            key: req.body['title'],
            amount: 1,
        });
    }
    res.send('OK');
});

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
        name: 'Digital Cherries',
        cost: '60.0',
        image_src: 'https://live.staticflickr.com/5088/5298033534_7728d6e608_b.jpg'
    },
    {
        name: 'Battle for the Galaxy',
        cost: '70.0',
        image_src: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Battle_for_the_Galaxy%2C_video_game_logo_screen.png'
    },
    {
        name: 'GTA',
        cost: '80.0',
        image_src: 'https://live.staticflickr.com/2210/2272200180_bfdf7d6b43_b.jpg'
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
        //connection.end();     //TODO: figure out where to place it
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