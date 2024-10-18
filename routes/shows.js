const { Router } = require("express");
const { Show, User } = require("../models/");
const { check, validationResult } = require("express-validator");

const showsRoutes = new Router();

showsRoutes.get('/', async (req, res) => {
  let genre = req.query.genre;
  if(genre){
    let show = await Show.findAll({ where: { genre: genre } });
    res.send(show);
  }else {
    let allShows = await Show.findAll();
    res.send(allShows);
  }
  
})

showsRoutes.get("/:id", async (req, res) => {
  console.log(req.query, "<<<<req.params");
  let show = await Show.findByPk(req.params.id);
  if (show) {
    res.send(show);
  } else {
    res.status(404).send({error: 'show not found'})
  }
});

showsRoutes.get("/:id/users", async (req, res) => {
  let userShows = await Show.findByPk(req.params.id, {include:{model: User }});
  res.send(userShows);
});


// showsRoutes.get("/genre/:genre", async (req, res) => {
//   let show = await Show.findAll({ where: { genre: req.params.genre } });
//   res.send(show);
// });

showsRoutes.post("/",[check("title").isLength({ min: 1, max: 25 })],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(404).send({ err: "Title must be at least 2 and most 25 characters long" });
    } else {
      let data = req.body;
      let show = await Show.create(data);
      res.send(show);
    }
  }
);

showsRoutes.put("/:id/:props", [check('title').isLength({min: 1, max: 25})], async (req, res) => {
  let errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(404).send({ err: "Title must be at least 2 and most 25 characters long" });
  }else {
    let show = await Show.findByPk(req.params.id);
    let data = {available : !show.available};
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