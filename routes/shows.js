const { Router } = require("express");
const { Show, User } = require("../models");
const { check, validationResult } = require("express-validator");

const showsRoutes = new Router();

showsRoutes.get('/', async (req, res) => {
    let allShows = await Show.findAll()
    res.send(allShows);
})

showsRoutes.get("/:id", async (req, res) => {
  let user = await Show.findByPk(req.params.id);
  res.send(user);
});

showsRoutes.get("/:id/users", async (req, res) => {
  let userShows = await Show.findByPk(req.params.user_shows, {include:{model: User }});
  res.send(userShows);
});

showsRoutes.get("/:id/:genre", async (req, res) => {
  let show = await Show.findAll({ where: { genre: req.params.genre } });
  res.send(show);
});

showsRoutes.put("/:id/:props", [check('title').isLength({max:25})], async (req, res) => {
  let errors = validationResult(res)
  if(!errors.isEmpty()){
    res.json({errors: errors.array()});
  }{
    let data = req.body
    let show = await Show.findByPk(req.params.id);
    let updatedShow = await show.update(data);
    res.send(updatedShow);
  }
});

showsRoutes.delete("/:id", async (req, res) => {
  let show = await Show.destroy({ where: { id: req.params.id } });
  res.send(show);
});



module.exports = showsRoutes;