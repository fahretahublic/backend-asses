# backend-asses
submission for backend apprenticeship 
# FetchRewards :
-Node.js web service 
    -Langauge: JavaScript
        -accepts HTTP requests and returns responses
## Description
Enables users to send GET/POST/PUT requests to track, update, and "spend" points. Points are stored based on the payer. The transactions are tracked via the timestamp provided by the user. Spending
the oldest accrued points first. Once a payer has been added through a transaction, the service will not allow to payer's balance to drop below 0;
## Required software:
Node.js v16.13.2.
Postman  v9.9.0 (OR similar program)

## How to run:
    1. download and install the latest version of Node.js.
        https://nodejs.org/en/download/

    2. download Postmans send HTTP requests 
        https://www.postman.com/downloads/

    3. Download the four .js files
        main.js, hostconfig.js, payerClass.js, and points.js

    4. Open your command lineprogram and cd to the directory containing all four .js files

    5. run the command:
       a. node index.js [hostname] [port]
            (omitting hostname or port will prompt the default options of 'localhost' '3000')

    6. launch postman
        a. enter URL where postman says "Enter request URL" 
            http://localhost:3000/ <--default

        b. below the URL box, click the 'Body' tab
            select the 'raw' radio button below the body tab
                select 'JSON' as the data type from the drop-down menu to the right of 'GraphQL.'

        c. Enter a JSON string following the below example
            { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }

        d. Select 'POST' from the drop-down menu next to the URL and click 'send.'
            This will add the transaction.

        e. Select 'GET'  and click send to get a log of current balances

        f. To spend points:
            i. enter your spend request following the below example
                { "points": 5000 }
            ii. select 'PUT' from the drop-down menu and click send

    7. To stop service close your command line program
