
const mongoose = require('mongoose')
require('dotenv').config()

const password = 'fullstack'
// const url = `mongodb+srv://fullstack:${password}@cluster0.szjyaqq.mongodb.net/noteApp?retryWrites=true&w=majority`
const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url).then(result => {
    console.log('connected to mongoDB')
}).catch(error => {
    console.log('error connecting to mongoDB', error)
})

const noteSchema = mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// module.exports来设置模块的公共端口
// export default是React的方式
module.exports = mongoose.model('Note', noteSchema)