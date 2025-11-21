import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, '..', 'db.json')

const db = {
	data: null,
	read: async function () {
		try {
			const txt = await fs.promises.readFile(file, 'utf8')
			this.data = JSON.parse(txt)
		} catch (e) {
			this.data = { users: [], classes: [], projects: [], submissions: [] }
			await fs.promises.writeFile(file, JSON.stringify(this.data, null, 2))
		}
	},
	write: async function () {
		await fs.promises.writeFile(file, JSON.stringify(this.data, null, 2))
	}
}

await db.read()
export default db
