
/*
 * Inventory.
 */

var fs = require('fs');
var mkdirp = require("mkdirp");

var mongoose = require('mongoose');


mongoose.createConnection('mongodb://localhost/houseAndLot');

var InventorySchema = new mongoose.Schema({
		title: String,
		description: String,
		mainphoto : String,
		datecreated: { type: Date, default: Date.now }
});

Inventory = mongoose.model('Inventory', InventorySchema);


exports.add = function(req, res){

	var inputtedvalues = new Array();
	inputtedvalues['title'] = '';
	inputtedvalues['description'] = '';

	res.render('inventoryAdd',{ inputtedvalues: inputtedvalues });
};

exports.addValidate = function(req, res){

	var title = req.body.title;
	var description = req.body.description;

	var allowableFileExtensions = new Array('image/jpeg');

	var inputtedvalues = new Array();
	inputtedvalues['title'] = title;
	inputtedvalues['description'] = description;


	if( title == "" ) {
		res.render('inventoryAdd', { error: 'no_title', message: 'Please provide a title.', inputtedvalues: inputtedvalues });
	}
	else if( description == "" ) {
		res.render('inventoryAdd', { error: 'no_description', message: 'Please provide a description.', inputtedvalues: inputtedvalues });
	}
	else if( req.files.mainPhoto.name == "" ) {
		res.render('inventoryAdd', { error: 'no_mainphoto', message: 'Please provide a photo.', inputtedvalues: inputtedvalues });
	}
	else if ( req.files.mainPhoto.type != 'image/jpeg' ) {
		res.render('inventoryAdd', { error: 'filetype_exception', message: 'File type not supported. Must be of image/jpeg format.', inputtedvalues: inputtedvalues });
	}
	else {

		// SAVE INVENTORY
		new Inventory({
				title: title,
				description: description,
				mainphoto: req.files.mainPhoto.name,
			}).save(function(err, inventory){

				if(err) res.json(err);

				// res.send(inventory._id);
				
				// SAVE IMAGE
				fs.readFile(req.files.mainPhoto.path, function (err, data) {

					mkdirp(__dirname + '../../public/images/inventory/'+inventory._id);

					var path = __dirname + '../../public/images/inventory/'+inventory._id+'/'+req.files.mainPhoto.name ;


					fs.writeFile(path, data, function (err) {

						if(err) res.send(err);

						res.send('success');
					});
				}); //END SAVE IMAGE
			});


		
		
	}

	// res.send(req.files.mainPhoto.type);
};


// http://howtonode.org/really-simple-file-uploads
// http://jasny.github.io/bootstrap/javascript/#fileinput
/*
{
  "mainPhoto": {
	"fieldName": "mainPhoto",
	"originalFilename": "5291_1094217930060_437507_n.jpg",
	"path": "C:\\Users\\Jowi\\AppData\\Local\\Temp\\5256-3qyqau.jpg",
	"headers": {
	  "content-disposition": "form-data; name=\"mainPhoto\"; filename=\"5291_1094217930060_437507_n.jpg\"",
	  "content-type": "image/jpeg"
	},
	"ws": {
	  "_writableState": {
		"highWaterMark": 16384,
		"objectMode": false,
		"needDrain": false,
		"ending": true,
		"ended": true,
		"finished": true,
		"decodeStrings": true,
		"defaultEncoding": "utf8",
		"length": 0,
		"writing": false,
		"sync": false,
		"bufferProcessing": false,
		"writecb": null,
		"writelen": 0,
		"buffer": []
	  },
	  "writable": true,
	  "domain": null,
	  "_events": {
		"error": [
		  null
		],
		"close": [
		  null
		]
	  },
	  "_maxListeners": 10,
	  "path": "C:\\Users\\Jowi\\AppData\\Local\\Temp\\5256-3qyqau.jpg",
	  "fd": null,
	  "flags": "w",
	  "mode": 438,
	  "bytesWritten": 23165,
	  "closed": true
	},
	"size": 23165,
	"name": "5291_1094217930060_437507_n.jpg",
	"type": "image/jpeg"
  }
}

*/