const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config.json");

module.exports = {
    exec: function(dbConfig){

        const db = mysql.createPool(
        dbConfig
        //   {
        //     "host": process.env.HOST,
        //     "user": process.env.DB_USER,
        //     "password": process.env.DB_PASSWORD,
        //     "database": process.env.DATABASE,
        //     "acquireTimeout ": 20000
        //   }
        );
        const app = express();
        const router = express.Router();
        const SQL_FIND_PERSON_BY_PHONE = "SELECT * FROM hkcb WHERE phone = ? LIMIT 1";

        app.use(cors())
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(express.json())

        var checkConfig = () => {
        if(config == null){
            console.log("config is not ready..")
            return false;
        }
        if(config.isTestdataMode === undefined || config.isTestdataMode == null){
            console.log("testdate mode is invalid..")
            return false;
        }
        if(config.phonePrefix === undefined || config.phonePrefix == null){
            console.log("phone prefix is invalid..")
            return false;
        }
        return true;
        }

        router.post('/', (req, res) => {
        try{
            record = {};
            if(req != undefined){
            console.log("Request received");
            const phone = req != null ? req.body.phone : ""
            var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
            console.log("request from: "+ip)
            if(!checkConfig()){
                console.log("Setting failed");
            }

            db.query(SQL_FIND_PERSON_BY_PHONE,[config.phonePrefix+phone], async (err , fields) => {
                if(fields != undefined){
                record = await JSON.stringify(fields[0]);
                await res.json(record === undefined? "" :record);
                await console.log("Response sent.");
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

        app.listen(443, () => {
            console.log("listen on port 443")
        })
    }
}