var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var method_override = require("method-override");
var ejs_layout_engine = require("ejs-mate")
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/referencexyz_test");
var models = require("./models.js"),
	Language = models.Language,
	Property = models.Property;

// cloudinary.config({
// 	cloud_name: "codigofacilito",
// 	api_key: "",
// 	api_secret: ""
// });
var app = express();

app.engine("ejs",ejs_layout_engine);
app.use(express.static('public'));
app.set('view engine', 'ejs');

var router = express.Router();

/* Lenguajes REST */

router.route("/lenguajes")
		.post(function(req,res){
			var data = {
				title: req.body.nombre,
				description: req.body.descripcion
			}
			var language = Language.new(data);
			language.save(function(err){
				res.redirect("/languages/"+language._id);
			});
		})

		.get(function(req,res){
			Language.find({},function(err,languages){
				res.render("languages/index",{languages: languages});	
			});

		});

router.route("/lenguajes/:id")
	.get(function(req,res){
		if(req.params.id === "new"){
			res.render("languages/new");	
		}else{
			Language.findById(req.params.id,function(err,language){
				properties = Property.find({language: language._id},function(err,propiedades){
					res.render("languages/show",{language: language, propiedades: propiedades});
				});
				
			});
		}
	})
	.put(function(req,res){
		Language.findById(req.params.id,function(err,language){
			language.title = req.body.nombre;
			language.description = req.body.descripcion;

			language.save(function(){
				res.redirect("/languages/"+language._id);
			});

		})
	});

app.get("lenguajes/new",function(req,res){
	res.render("languages/new");
});

app.get("lenguajes/:id/edit",function(req,res){
	Language.findById(req.params.id,function(err,language){
		res.render("languages/edit",{language: language});
	});	
});

/* Propiedades REST */
router.route("/propiedades")
		.post(function(req,res){
			var data = {
				title: req.body.nombre,
				description: req.body.descripcion,
				lenguaje: req.body.lenguaje_id
			}
			var property = Property.new(data);
			property.save(function(err){
				res.redirect("/propiedades/"+property._id);
			});
		})

		.get(function(req,res){
			Property.find({},function(err,propiedades){
				res.render("properties/index",{propiedades: propiedades});	
			});

		});


router.route("/propiedades/:id")
	.get(function(req,res){
		if(req.params.id === "new"){
			Language.find({},function(err,languages){
				console.log("\n\n\n\n"+languages+"\n\n\n\n")
				res.render("properties/new",{languages: languages});	
			});			
		}else{
			Property.findById(req.params.id,function(err,propiedad){
				Language.findById(propiedad.language,function(err,language){
					res.render("properties/show",{propiedad: propiedad, language: language});	
				});			
			});	
		}
		
	})
	.put(function(req,res){
		Property.findById(req.params.id,function(err,propiedad){
			propiedad.title = req.body.nombre;
			propiedad.description = req.body.descripcion;

			propiedad.save(function(){
				res.redirect("/propiedades/"+propiedad._id);
			});

		})
	});

app.get("propiedades/:id/edit",function(req,res){
	Property.findById(req.params.id,function(err,propiedad){
		res.render("propiedades/edit",{propiedad: propiedad});
	});	
});

app.get("/",function(req,res){
	res.render("index");
});

app.use("/",router);
app.listen(8080);
