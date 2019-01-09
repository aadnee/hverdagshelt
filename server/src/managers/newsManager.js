import { News } from '../models.js';
import jwt from 'jsonwebtoken';

module.exports = {

  addArticle: function(req, res){
    const title = req.body.title
    const description = req.body.description
    const status = req.body.status
    const categoryId = req.body.categoryId
    const lat = req.body.lat
    const lon = req.body.lon

    if (
      title == null ||
      title == '' ||
      description == null ||
      description == '' ||
      status == null ||
      status == '' ||
      categoryId == null ||
      categoryId == '' ||
      lat == null ||
      lat == '' ||
      lon == null ||
      lon == ''
    ) {
      res.json({
        success: false,
        message: 'Fields cannot be empty.'
      });
    } else {
      News.create({
        title: title,
        description: description,
        status: status,
        categoryId: categoryId,
        lat: lat,
        lon: lon
      });
      res.json({
        success: true,
        message: 'Article added.'
      });
    }
  },

  updateNews: function(req, res) {
    const title = req.body.title
    const description = req.body.description
    const status = req.body.status
    const categoryId = req.body.categoryId
    const companyId = req.body.companyId

    News.findOne({ where: { id: req.params.id} }).then(article => {
      if (!article ||
        title == null ||
        title == '' ||
        description == null ||
        description == '' ||
        status == null ||
        status == '' ||
        categoryId == null ||
        categoryId == '') {
        res.json({
          success: false,
          message: 'Article not found.'
        });
      }
      else if (article){
        News.update({
          title: req.body.title,
          description: req.body.title,
          status: req.body.status,
          categoryId: req.body.categoryId,
          companyId: req.body.companyId
        },
        {
          where: {id: req.params.id}
        }
        )
        res.json({
          success: true,
          message: 'Article updated successfully'
        })
      }
    })
  },

getLocalNews: function(req, res){
   jwt.verify(req.cookies['token'], process.env.JWT, function(err, decoded) {
     if (decoded && decoded.municipalId) {
       News.findAll({where: {municipalId: decoded.municipalId}}).then(news => res.send(news))
     } else {
       res.sendStatus(403);
     }
   });
 }

};
