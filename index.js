import express from "express";
import SequelizeStore from "connect-session-sequelize"





app.listen(process.env.APP_PORT, ()=>{
    console.log('Server up and running...');
});