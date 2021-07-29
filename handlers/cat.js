const url = require("url");
const fs = require("fs");
//console.log(fs);
const path = require("path");
const qs = require("querystring");
const formidable = require("formidable");
const breeds = require("../data/breeds");
const cats = require("../data/cats");
const { randomBytes } = require("crypto");

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    //console.log(pathname)

    if(pathname === '/cats/add-cat' && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        );
        
        const index = fs.createReadStream(filepath);

        index.on("data", (data) => {
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
            res.write(modifiedData);
        });

        index.on("end", () => {
            res.end();
        });

        index.on("error", (err) => {
            console.log(err);
        });
        
    } else if(pathname === '/cats/add-breed' && req.method === 'GET'){
        let filepath = path.normalize(
            path.join(__dirname, '../views/addBreed.html')
        );
        
        const index = fs.createReadStream(filepath);
        console.log(index)

        index.on("data", (data) => {
            
            res.write(data);
        });

        index.on("end", () => {
            res.end();
        });

        index.on("error", (err) => {
            console.log(err);
        });

    } else if(pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';


        req.on('data', (data) => {
            formData += data; //returns ascii data from input box
           // console.log('THIS IS DATA', data);
            //console.log('THIS IS FORM DATA', formData) //formData = ascii converted from string
        });
        
        req.on('end', () => {
            console.log(typeof formData);
            let body = qs.parse(formData);
            console.log("THIS IS THE BODY", body);

            fs.readFile('./data/breeds.json', (err, data) => {
                if(err) {
                    throw err;
                }
                //console.log('THIS IS THE DATA,', data)

                let breeds = JSON.parse(data);     
                //console.log('THIS IS BREEDS', breeds);

                breeds.push(body.breed);
                let json = JSON.stringify(breeds);
                //console.log('THIS IS JSON OF BREEDS, ', json);

                fs.writeFile('./data/breeds.json', json, 'utf-8', () => console.log('The breed was uploaded successfully'));
            });

            res.writeHead(302, { location: '/' });
            
            res.end();
        });
    } else if(pathname === '/cats/add-cat' && req.method === 'POST') {
        
        let form = new formidable.IncomingForm();

        
        form.parse(req, (err, fields, files) => {
            if(err) throw err;
            console.log('THIS IS FIELDS', fields);
            console.log(files);

            let oldPath = files.upload.path;
            console.log(oldPath)
            let newPath = path.normalize(path.join(__dirname, '../content/images/' + files.upload.name));
            console.log(newPath)

            fs.rename(oldPath, newPath, (err) => {
                if(err) throw err;
                console.log("Files were uploaded successfully");
            });

            fs.readFile('./data/cats.json', 'utf8', (err, data) => {

                let allCats = JSON.parse(data);
                allCats.push({ id: Math.random(), ...fields, image: files.upload.name });
                let json = JSON.stringify(allCats);
                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(302, { location: '/' });
                    res.end();
                });
            });
        });
    }
};


// const url = require('url');
// const fs = require('fs');
// const path = require('path');
// const qs = require('querystring');
// //const formidable = require('formidable');
// const breeds = require('../data/breeds');
// const cats = require('../data/cats');

// module.exports = (req, res) => {

//     const pathname = url.parse(req.url).pathname;

//     if(pathname === '/cats/add-cat' && req.method === 'GET') {
//         let filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));

//         const index = fs.createReadStream(filePath);

//         index.on('data', (data) => {
//             res.write(data);
//         });

//         index.on('end', () => {
//             res.end();
//         });

//         index.on('error', (err) => {
//             console.log(err);
//         });
//     } else {
//         return true;
//     }

// }