const { Router } = require("express");
const { Show, User } = require("../models/");
const { check, validationResult } = require("express-validator");

const showsRoutes = new Router();

showsRoutes.get('/', async (req, res) => {
  let genre = req.query.genre;
  if(genre){
    let show = await Show.findAll({ where: { genre: genre } });
    console.log(show, "show");
    res.send(show);
  }else {
    let allShows = await Show.findAll();
    console.log(req.query.genre, "<<<<req.query.genre");
    res.send(allShows);
  }
  
})

showsRoutes.get("/:id", async (req, res) => {
  console.log(req.query, "<<<<req.params");
  let user = await Show.findByPk(req.params.id);
  res.send(user);
});

showsRoutes.get("/:id/users", async (req, res) => {
  let userShows = await Show.findByPk(req.params.id, {include:{model: User }});
  res.send(userShows);
});


showsRoutes.get("/genre/:genre", async (req, res) => {
  console.log(req.query.genre, "<<<<req.query.genre");

  let show = await Show.findAll({ where: { genre: req.params.genre } });
  console.log(show, "show");

  res.send(show);
});

//  showsRoutes.get("/filter", async (req, res) => {
//    const genre = req.query.genre;
//    const found = await Show.findAll({ where: { genre: genre } });
//    res.json(found);
//  });

showsRoutes.put("/:id/:props", [check('title').isLength({max:25})], async (req, res) => {
  let errors = validationResult(res)
  if(!errors.isEmpty()){
    res.json({errors: errors.array()});
  }{
    let show = await Show.findByPk(req.params.id);
    let data = {
      available : !show.available
    };
    let updatedShow = await show.update(data);
    res.send(updatedShow);
  }
});

showsRoutes.delete("/:id", async (req, res) => {
  console.log(req.params.id, "req.params.id");
  let show = await Show.findByPk(req.params.id);
  if(show){
    let deletedShow = await show.destroy();
    res.send(deletedShow);
  }else{
    res.send('No such movie exist')
  }
});



module.exports = showsRoutes;