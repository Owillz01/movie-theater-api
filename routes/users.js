const { Router } = require("express");
const { Show, User } = require("../models/");
const { check, validationResult } = require("express-validator");

const usersRoutes = new Router();

usersRoutes.post("/", [check("username").isEmail()], async (req, res) => {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.json({ error: err.array() });
  } else {
    let data = req.body;
    let newUser = await User.create(data);
    res.send(newUser);
  }
});

usersRoutes.get('/', async (req, res) => {
    console.log(req.params, "req.params");
    let allUsers = await User.findAll()
    res.send(allUsers);
})

usersRoutes.get("/:id", async (req, res) => {
  let user = await User.findByPk(req.params.id);
  res.send(user);
});

usersRoutes.get("/:id/shows", async (req, res) => {
  let userShows = await User.findByPk(req.params.id, {
    include: { model: Show },
  });
  if (!userShows){
    return res.stattus(404).send({err:'no show found'})
  } 
  res.send(userShows);
});

usersRoutes.put("/:id/shows/:show_id", async (req, res) => {
  let user = await User.findByPk(req.params.id);
   let show = await Show.findByPk(req.params.show_id);
    await user.addShow(show);
  let updateShow = await User.findByPk(req.params.id, {
    include: { model: Show, where: { id: req.params.show_id } },
  });
  res.send(updateShow);
});


module.exports = usersRoutes;