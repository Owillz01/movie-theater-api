const { Router } = require("express");
const { Show, User } = require("../models/");
const { check, validationResult } = require("express-validator");

const usersRoutes = new Router();

usersRoutes.get('/', async (req, res) => {
    let allUsers = await User.findAll()
    res.send(allUsers);
})

usersRoutes.get("/:id", async (req, res) => {
  let user = await User.findByPk(req.params.id);
  res.send(user);
});

usersRoutes.get("/:id/shows", async (req, res) => {
  let userShows = await User.findByPk(req.params.user_shows, {
    include: { model: Show },
  });
  res.send(userShows);
});

usersRoutes.put("/:id/shows/:show_id", async (req, res) => {
  let user = await User.findByPk(req.params.id);
   let show = await Show.findByPk(req.params.show_id);
  let updateShow = await user.addShow(show);
  res.send(updateShow);
});


module.exports = usersRoutes;