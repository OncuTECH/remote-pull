const express = require('express')
const app = express()
const port = 9750
const projects = require('./projects.json')
const simpleGit = require('simple-git');


app.use(raygunClient.expressHandler);

app.get('/auto-pull/:proje',async (req, res) => {
	  let Params={...req['params'],...req['query'],...req['body']};

		try {
			if (!req.headers['x-api-key'] || req.headers['x-api-key'] !== 'b90b7f65-84af-4381-a8ef-7ff3d65a7e0d') throw new Error("Hatalı Api Key.")

			let projeInfo = projects.find(x => x.AppName == Params['proje']);
			if (!projeInfo) throw new Error("Proje bulunamadi.")

			let git = await simpleGit(projeInfo['Folder']);

			if(!await git.checkIsRepo()) throw new Error("Proje yolu gecerli bir git klasoru degil.")

			let gitPull = await git.pull();
			let resCvp = {
				"Guncellenen":gitPull['files'],
				"Genel":gitPull['summary'],
			}
			res.jsonp(resCvp)

		} catch (e) {
			res.jsonp({"Hata":e.message});
		}



})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
