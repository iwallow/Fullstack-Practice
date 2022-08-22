let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
]

const express = require('express')
const app = express() 

// 用来解析JSON数据的中间件，如果不配置该功能的话，无法获取body中的JSON数据
// ➡️是因为body中的数据是JSON格式，而不是JavaScript对象
app.use(express.json())

// 响应的content-type和状态码会被自动设置
app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    // 通过向json()方法传入字符串的形式，使响应的content-type自动被设置为application/json
    // ※ JSON.stringify()返回的是字符串格式的JSON
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    
    //id和note.id的类型不同，因此需要类型转换
    const id = Number(request.params.id)

    // 数组的方法find和filter的区别
    // find只会返回对应的元素
    // filter会返回包含对应元素的数组
    const note = notes.find( note => note.id === id )

    // 利用条件语句，在id错误时返回404
    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
    
})

// 删除内容不返回任何数据，状态码为204
app.delete('/api/notes/:id',(request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter( note => note.id !== id)
    response.status(204).end()
})

const generateID = () => {
    // ...的意思是展开的意思，通过展开语法给max()传递参数
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    // console.log(request.get('user-agent'))
    // console.log(request.headers)
    // console.log(request.body)

    const body = request.body
   
    if(!body.content){
        return response.status(400).json({
            error : "content missing"
        })
    }

    console.log(body.important)
    const note = {
        content : body.content,
        important : body.important || false, 
        date : new Date(), 
        id : generateID()
    }

    notes = notes.concat(note)

    response.json(note)
})

const PORT = '3001'
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})