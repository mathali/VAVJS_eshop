var assert = require('assert');
const nodeFetch = require('node-fetch')
const fetch = require('fetch-cookie')(nodeFetch)

var order_id;

describe('Server tests', function() {
    describe('Seed products', function() {
        it('Digital Cherries', async function() {
            await fetch('http://localhost:8085/product_data')
            .then(res => res.json())
            .then(data => { assert.strictEqual(data[0].name, 'Digital Cherries');});
       });
        it('Battle for the Galaxy', async function() {
            await fetch('http://localhost:8085/product_data')
            .then(res => res.json())
            .then(data => { assert.strictEqual(data[1].name, 'Battle for the Galaxy');});
       });
        it('GTA', async function() {
            await fetch('http://localhost:8085/product_data')
            .then(res => res.json())
            .then(data => { assert.strictEqual(data[2].name, 'GTA');});
       });
        it('Pachinko', async function() {
            await fetch('http://localhost:8085/product_data')
            .then(res => res.json())
            .then(data => { assert.strictEqual(data[3].name, 'Pachinko');});
       });
        it('Magpie City', async function() {
            await fetch('http://localhost:8085/product_data')
            .then(res => res.json())
            .then(data => { assert.strictEqual(data[4].name, 'Magpie City');});
       });
        it('Piechart man', async function() {
            await fetch('http://localhost:8085/product_data')
            .then(res => res.json())
            .then(data => { assert.strictEqual(data[5].name, 'Piechart man');});
       });
    });

    describe('Inserting into the shopping cart', function(){
        it('First insert', async function(){
            await fetch('http://localhost:8085/to_cart',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({title: 'GTA'}),
                    credentials: 'same-origin'
                })
                .then(res => res.json())
                .then(data=>{
                    assert.strictEqual(data[0].key, 'GTA');
                });
        });
        it('Increase amount', async function(){
            await fetch('http://localhost:8085/to_cart',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({title: 'GTA'}),
                    credentials: 'same-origin'
                })
                .then(res => res.json())
                .then(data=>{
                    assert.strictEqual(data[0].amount, 2);
                });
        });
        it('New item', async function(){
            await fetch('http://localhost:8085/to_cart',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({title: 'Digital Cherries'}),
                    credentials: 'same-origin'
                })
                .then(res => res.json())
                .then(data=>{
                    assert.strictEqual(data[1].key, 'Digital Cherries');
                });
        });
    });
    
    describe('Checking cart', function(){
        it('First item', async function(){
            await fetch('http://localhost:8085/cart_data',{
                    method: 'GET',
                    credentials: 'same-origin'
                })
                .then(res => res.json())
                .then(data=>{
                    assert.strictEqual(data[0].title, 'GTA');
            });
        });
        it('Second item', async function(){
            await fetch('http://localhost:8085/cart_data',{
                    method: 'GET',
                    credentials: 'same-origin'
                })
                .then(res => res.json())
                .then(data=>{
                    assert.strictEqual(data[1].title, 'Digital Cherries');
            });
        });
    });

    describe('Create order', function(){
        it('Order', async function(){
            var customer = {
                name: "Tester",
                phone_no: 12345,
                email: "tester@testing.test",
                street: "Testlane",
                city: "Testington",
                country: "Testlandia",
                postcode: 54321
            };

            var order = [{
                title: "GTA",
                amount: 1
            }];

            await fetch('http://localhost:8085/create_order',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    customer: customer,
                    order: order
                }),
            credentials: 'same-origin'
            })
            .then(res => res.json())
            .then(data=>{
                assert.strictEqual(data, true);
            });
        });
    });

    describe('Admin interface', function(){
        it('Orders list', async function(){
            await fetch('http://localhost:8085/admin_orders',{
                    method: 'GET',
                    credentials: 'same-origin'
                })
                .then(res => res.json())
                .then(data=>{
                    order_id = data.result[0].id;
                    assert.notStrictEqual(data.result, undefined);
            });
        });
        
        it('Ad click counter', async function(){
            await fetch('http://localhost:8085/admin_orders',{
                    method: 'GET',
                    credentials: 'same-origin'
                })
                .then(res => res.json())
                .then(data=>{
                    assert.notStrictEqual(data.hit_count, undefined);
            });
        });
    });

    describe('Update order state', function(){
        it('State changed', async function(){
            fetch('http://localhost:8085/update_state',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: order_id,
                    state: "Processing"
                }),
                credentials: 'same-origin'
            })
            .then(res => res.json())
            .then(data=>{
                assert.strictEqual(data, 1);
            });
        });
    });
});