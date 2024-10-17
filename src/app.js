const express = require('express');
const usersRoutes = require('../routes/users');
const showsRoutes = require('../routes/shows');
const app = express()

app.use(express.json())
app.use(express.urlencoded());
app.use("/users", usersRoutes);
app.use("/shows", showsRoutes);


module.exports = app
