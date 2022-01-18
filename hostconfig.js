const defaultPort = 3000; 
const defaultHost = 'localhost'; 

// Retrieves a usable hostname from the command line args. 
// If a proper hostname was not entered in the command line, the default hostname is used.
exports.setHost = (commLineArgs) => 
{ 
    let invaildHost = false; 
    if (commLineArgs.length >= 1) 
    {
        // Potential host name would need to have 4 elements after the call to split for it to be a valid IP address.
        let userHost = commLineArgs[0].split('.'); 

        if (userHost.length == 4) 
        {
            for (let i = 0; i < userHost.length; i++) 
            {
                // isNaN considers empty strings to be numbers, which made hostnames such as "127..."
                // register as valid. The second clause was added to this if to check that the number entered
                // by the user has characters in it.
                if (!isNaN(userHost[i]) && !(userHost[i].length === 0)) 
                { 
                    let ip = parseInt(userHost[i]); ////parseInt function converts its first argument to a string, parses that string, then returns an integer or NaN
                    if (ip < 0 || ip > 255) 
                    {   ////IP addressing range goes from 0.0. 0.0 to 255.255. 255.255. 
                        ////The reason each number can only reach up to 255 is that each of the numbers is really an eight digit binary number
                        invaildHost = true;
                    }
                }
                else 
                {
                    invaildHost = true;
                }
            }
        }
        else 
        {
            invaildHost = true;
        }
    }
    if (invaildHost) 
    {
        console.log(`Invaild hostname entered!\nDefault hostname: \"${defaultHost}\" will be used\n`); 
    }
    return (commLineArgs.length >= 1 && !invaildHost ? commLineArgs[0] : defaultHost); 
}

// Retrieves a usable port from the command line args.
// If a proper port was not entered in the command line, the default port is used.
exports.setPort = (commLineArgs) => 
{ 
    let portUsed = defaultPort; 

    if (commLineArgs.length >= 2 && !isNaN(commLineArgs[1])) 
    {
        let userPort = parseInt(commLineArgs[1]);
        // The userPort is only used if its inside the acceptable range of port values (0 - 65535).
        if (userPort >= 0 && userPort <= 65535) 
        {
            portUsed = userPort;
        }
        else 
        {
            console.log(`Invaild port entered!\nDefault port: \"${defaultPort}\" will be used\n`); 
        }
    }
    else if (commLineArgs.length >= 2 && isNaN(commLineArgs[1])) 
    {
        console.log(`Invaild port entered!\nDefault port: \"${defaultPort}\" will be used\n`); 
    }
    return portUsed;
}
