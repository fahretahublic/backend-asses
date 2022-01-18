const { Console } = require("console");
const http = require("http");

// This is the file that will track and process payer data and
// requests done to that data.
const points = require("./points")   //// changed to points
const Points = points.Points; //// changed to points

// This allows setting the IP and Port through the command line.
const hostconfig = require("./hostconfig");
const cLineArgs = process.argv.slice(2);   ////argv is used to get the arguments passed to the node. js process when run in the command line.
const hostname = hostconfig.setHost(cLineArgs);  //// changed var to cLineArgs
const port = hostconfig.setPort(cLineArgs);

let hostStatus = true;    //// changed var name to host Status
const service  = http.createServer((request, response) => {////converted to arrow function https://nodejs.dev/learn/get-http-request-body-data-using-nodejs (covering line 16 to 24)
        // Server message will contain the response that gets sent
        // back to the client that is making the requst.
        let serviceMessage = " "; //// changed message and var to serviceMessage
        let jsonString = '';

        request.on('data', (chunk) => { //// data is stored in chunk in hex
            jsonString += chunk; //// empty  jsonString convertes chunk to string 
            });

        request.on('end', () => {
                switch (request.method) {
                    // GET is used to get the current balance point balance for each payer.
                    case 'GET':
//// line not needed                        //console.log("GET request detected"); //
                        serviceMessage = Points.getPoints();
                        break;

                    // POST is used to add transactions from payers which allow the account to accumulate points.
                    case 'POST':
                        try {
                           // console.log(jsonString)
                            const jsonData = JSON.parse(jsonString);
 //// line not needed                               console.log("POST request detected, parsing request data");
                            serviceMessage = Points.addTransaction(jsonData);
                        }
                        catch (e) {
                            console.log(e);
                            serviceMessage = { error: e.message };
                        }
                        break;
                    // PUT is used to spend points that have accumulated in the account.
                    case 'PUT':
                        try {
                            const jsonData = JSON.parse(jsonString);
 //// line not needed                            console.log("PUT request detected, parsing request data");
                            serviceMessage = Points.spendPoints(jsonData);
                        }
                        catch (e) {
                            console.log(e);
                            serviceMessage = { error: e.message };
                        }
                        break;


                    // At this point, either GET, PUT, or POST would not have been detected.
                    default:                        
                        serviceMessage =`PLease only use GET, POST, or PUT`; //// changed from a struct to just a string
                        break;
                }
                response.setHeader('Content-Type', 'application/json'); 
                response.end(JSON.stringify(serviceMessage)); //// converting the service message to a string
            });
    }).listen(port, hostname); 

service.on('error', (e) => {   //// this is the standard way
        hostStatus = false;
        console.log("Service failed to establish a connection\n");
        console.log(e);
        service.close();
    });

if(hostStatus) {
    console.log(`service online @ http://${hostname}:${port}/\n`);  
}



