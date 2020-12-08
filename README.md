# VAVJS Project 3 - Eshop
## Image Sources
Products: https://ccsearch-dev.creativecommons.org/  
Add banner: fiit.stuba.sk  
## Access 
Adminer port: 8080 (http://localhost:8080/)  
Eshop port: 8085 (http://localhost:8085)  
Admin interface: #admin (http://localhost:8085/#admin) - page needs to be refreshed  
## Tests  
npm test
required local modules: mocha, node-fetch, fetch-cookie
## Database
Port: 3306  
Host: mydb  
User: root  
Password: root 
DB name: eshop 
### Structure  
* Customers
    * id int
    * name varchar(255)
    * phone_no int
    * email varchar(255)
    * street varchar(255)
    * city varchar(255)
    * country varchar(255)
    * post_code int

* Orders 
    * id int
    * amount int
    * customer_key int (foreign key)
    * product_key int (foreign key)
    * state varchar(255)

* Products
    * id int
    * name varchar(255)
    * cost float
    * image_src varchar(500)

* Counter
    * id int
    * hit_count int

## Sidenote
Pri opätovnom spustení mydb image po premazaní raz napísal Error Could not open the mysql.plugin table.  
Vám na cvičení pri tomto errore fungoval **docker system prune -a**, ja som potreboval **docker-compose rm mydb**.  
Predpokladám, že to bolo nesprávnym použitím Docker Desktop aplikácie, ale pre istotu prikladám riešenie.
