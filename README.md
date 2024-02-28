# DatabaseLogger-API-capstone-project-
Created a DataBase logger using the Jade Diabetes API 
This program assumes that you have already created an Account with the Jade Diabetes App. 
To start, please use `npm i` to download all the node dependencies and to start the server, type in `nodemon index.js`

Please note that due to a problem in the API, for updating logs, instead of retaining the original time of the log, the time is updated to the time when you update the log. 

E.g. if you first added in the log on 27th Februrary 12pm, and you wanted to update a value on 28th February 1pm. After updating, the time in the system records the log to be added on 28th February and not 27th February, which might end up with some confusion

4 functions:
1. Add log
2. Update Log
3. Delete Log
4. Check Log range

The logs will be added onto the dashboard in the Jade website or app through the API. 
