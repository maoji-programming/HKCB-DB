const express = require("express");
const pg = require('pg')
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config.json");

module.exports = {
    exec: function(dbConfig){
        var conString = "postgres://"+dbConfig.user+":"+dbConfig.password+"@"+dbConfig.host+"/"+dbConfig.database //Can be found in the Details page
        var client = new pg.Client(conString);
        client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        
        const app = express();
        const router = express.Router();
        const SQL_FIND_PERSON_BY_PHONE = "SELECT * FROM hkcb WHERE phone = $1 LIMIT 1";

        app.use(cors())
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(express.json())
        

        router.post("/",(req, res) => {
            try{
                record = {};
                if(req != undefined){
                    console.log("Request received");
                    const phone = req != null ? req.body.phone : ""
                    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
                    console.log("request from: "+ip)
                    client.query(SQL_FIND_PERSON_BY_PHONE,[config.phonePrefix+phone], (err , fields) => {
                        if(fields != undefined){
                            record = JSON.stringify(fields.rows[0]);
                            res.json(record === undefined? "" :record);
                        }else{
                            console.log("Response sent. fields undefined:"+err);
                        }
                    })
                }else{
                    res.json(record);
                    console.log("Response empty.");
                }
                
            }catch(err){
                console.log(err);
                res.status(500).json({ msg: "something bad has occurred." });
            }
        })
        app.use("/",router);
        app.listen(3004, () => {
            console.log("listen on port 3004")
        })
    })
}}

