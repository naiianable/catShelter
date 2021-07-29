const url = require('url'); 
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats');

//console.log(cats)

module.exports = (req, res) => {
    //url = localhost:3660      req.url = /index    parsed = localhost:3660/homepage
    const pathname = url.parse(req.url).pathname;

    if(pathname === '/' && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/home/index.html')
        );
        fs.readFile(filepath, (err, data) => {
            if(err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                res.write(404);
                res.end();
                return;
            }

            let modifiedCats = cats.map((cat) =>  `<li>
                <img src="${path.join('./content/images/' + cat.image)}" alt="${cat.name}">
                <h3>${cat.name}</h3>
                <p><span>Breed: </span>${cat.breed}</p>
                <p><span>Description: </span>${cat.description}</p>
                <ul class="buttons">
                    <li class="btn edit"><a href="/cats-edit"/${cat.id}>Change Info</a></li>
                    <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
                </ul>
            </li>`);
            let modifiedData = data.toString().replace('{{cats}}', modifiedCats);

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(modifiedData);
            res.end();
        });
    } else {
        return true;
    }
};