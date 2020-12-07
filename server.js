// Matej Halinkovic
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');


/*


        Express section 


*/

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

// Data for the home page
app.get('/product_data', (req, res) =>{
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

// Data for the shopping cart
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
                            cost: results[j].cost,
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

// Store title and amount added to cart
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
    res.json(req.session.items);
});

// Push created order into the DB
app.post('/create_order', (req,res)=>{
    var response = res;
    var cust_id;
    var success = false;
    if(req.body['order'] != undefined && req.body['order'].length > 0){
        // Create a customer profile if it doesn't exist
        queryPromise('SELECT * FROM customers WHERE name=\''+req.body['customer'].name+'\'').then(res=>{
            if(res){
                connection.query('INSERT INTO customers (name, phone_no, email, street, city, country, post_code) VALUES '+
                    '(\'' + req.body['customer'].name+'\', \'' + req.body['customer'].phone_no+'\', \'' + req.body['customer'].email+
                    '\', \'' + req.body['customer'].street + '\', \''+ req.body['customer'].city + '\', \'' + req.body['customer'].country +
                    '\', \'' + req.body['customer'].postcode + '\')', function (error, results, fields){
                        if(error) throw error;
                });
            }
        }).then(res=>{              // Get the customers id to be used as a foreign key
            connection.query('SELECT id FROM customers WHERE name=\''+req.body['customer'].name+'\'', function(error,results,fields){
                if(error) throw error;
                cust_id = results[0].id;
            });
        }).then(res=>{              // Get the product ids that get used as foreign keys
            var amount_order = 0;
            success = true;
            for(var i = 0; i < req.body['order'].length; i++){
                selectPromise('SELECT id FROM products WHERE name=\''+req.body['order'][i].title+'\'').then(res=>{
                    connection.query('INSERT INTO orders (amount, customer_key, product_key, state) VALUES ' + 
                        '(\''+ req.body['order'][amount_order++].amount + '\', \'' + cust_id + '\', \'' + res[0].id + '\', \' Awaiting payment\')', 
                            function(error,results,fields){
                                if(error) throw error;
                                sucess=true;
                        }
                    );
                });
            }
            response.json(success);
        });
    }else{
        response.json(success);
    }
});

// Ad clicl counter increment
app.post('/update_counter', (req,res)=>{
    connection.query('UPDATE counter SET hit_count = hit_count + 1 WHERE id=1', function(error,results,fields){
                if(error) throw error;
            });
    res.send('OK');
});


// Join tables to get the necessary info for the admin interface
app.get('/admin_orders', (req,res)=>{
    var adminQuery = `SELECT 
                        o.id, 
                        o.amount,
                        c.name as 'customerName',
                        c.email as 'customerEmail',
                        p.name as 'productName',
                        o.state as 'state'
                    FROM \`orders\` o
                    JOIN \`customers\` c on c.id = o.customer_key
                    JOIN \`products\` p on p.id = o.product_key`;

    var counterQuery = 'SELECT hit_count FROM counter WHERE id=1';

    res.type('application/json')
    selectPromise(adminQuery).then(result=>{
        var res_ph = result;
        selectPromise(counterQuery).then(hit_count=>{
            res.send({
                result: res_ph,
                hit_count: hit_count[0],
            });
        })
    });
});

// Process admin's requests to change order state
app.post('/update_state', (req, res)=>{
    connection.query('UPDATE orders SET state = \'' + req.body['state'] + '\' WHERE id=' + req.body['id'], function(error,results,fields){
                if(error) throw error;
                res.json(results.changedRows);
            });
});


/*


        End of express section 


*/

/*


        Mysql section 


*/

var connection
const connect = async function(callback){
    connection = mysql.createConnection({
        host : 'mydb',      
        user : 'root',
        password : 'root',
        //database : 'eshop'               // Name of the current database 
    });
    connection.connect(err => {
        if(err){
            console.log("[INFO] Database not available:");
            console.log(err);
            connection.end(err=>{console.log(err)});
            setTimeout(()=>{
                connect(callback)
            }, 5000);
        }else {
            callback();
        }
    });
}

connect(()=>{
    app.listen(8080, ()=>{
        console.log("[INFO] Listening");
    });
    validateDB();
});


var createDatabase = `CREATE DATABASE IF NOT EXISTS \`eshop\` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_slovak_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;`

// SQL commands that create all needed tables if they don't exist in our database

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

// Product seed
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
    {
        name: 'Pachinko',
        cost: '100.0',
        image_src: 'https://live.staticflickr.com/3060/3250235509_2525167f57_b.jpg'
    },
    {
        name: 'Magpie City',
        cost: '30.0',
        image_src: 'https://live.staticflickr.com/153/401319471_590d5b5d54_b.jpg'
    },
    {
        name: 'Piechart man',
        cost: '40.0',
        image_src: 'https://live.staticflickr.com/5219/5494178341_1c1a366749.jpg'
    },
];


// Mapping of INSERT commands
var strCtr = 'INSERT INTO counter (hit_count) VALUES (\'0\')';
var str = 'INSERT INTO products (name, cost, image_src) VALUES ';
var strProducts = products.map(product => {
    return '(\'' + product.name+'\', \'' + product.cost+'\', \'' + product.image_src+'\')';
});

str += strProducts.join(',');
str += ';';

var databaseTest = "SELECT * FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'eshop'";

// Tests that are used to determine which tables exist
var customersTest = `SELECT *
            FROM information_schema.tables
            WHERE table_schema = 'eshop'            
            AND table_name = 'customers';`;             // Name 'eshop' determined by the connection

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


// Support function used in places where we need to wait for a command to finish - checks if the command returns something
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

// Return the contents of the command response
function selectPromise(str){
    return new Promise((resolve, reject) => {connection.query(str, function (error, results, fields){
            if(error) throw error;
            resolve(results);
        });
    });
}

function validateDB(){
    // Test the database if it has the necessary structure, create anything that's missing
    queryPromise(createDatabase).then(res=>{
        connection.changeUser({database : 'eshop'}, function(err) {
            if (err) throw err;
        });
        
    })
    .then(res=>{
        queryPromise(customersTest).then(res =>{
            if(res){
                connection.query(createCustomers, function (error, results, fields){
                    if(error) throw error;
                });
            }
        })
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
            //connection.end();     
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
}
/*


        End of mysql section 


*/
