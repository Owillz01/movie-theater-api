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
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ error: "User not found" });
  }
});

usersRoutes.get("/:id/shows", async (req, res) => {
  let userShows = await User.findByPk(req.params.id, {include: { model: Show },});
  if (!userShows){
    res.status(404).send({err:'no show found'})
  } 
  else{res.send(userShows); }
});

usersRoutes.put("/:id/shows/:show_id", async (req, res) => {
  let user = await User.findByPk(req.params.id);
   let show = await Show.findByPk(req.params.show_id);
   if (user && show) {
     await user.addShow(show);
     let updateShow = await User.findByPk(req.params.id, {
       include: { model: Show, where: { id: req.params.show_id } },
     });
     res.send(updateShow);
   } else {
     res.status(404).send({ error: "user or show not found" });
   }
});


module.exports = usersRoutes;