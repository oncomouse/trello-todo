import parser from './app/utilities/parser.js'
import fs from 'fs'

fs.readFile('./test.txt', (err,data) => {
	console.log(JSON.stringify(parser(data.toString()), null, 2));
})