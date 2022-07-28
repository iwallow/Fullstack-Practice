import axios from "axios"

// 将获取notes信息的模块单独提取出来

const baseURL = 'http://localhost:3001/notes/'

const getAll = () => (
    axios.get(baseURL).then(response => response.data)
)

const create = (newObject) =>(
    axios.post(baseURL, newObject).then(response => response.data)
)

const update = (id, changedObject) =>(
    axios.put(baseURL+id, changedObject).then(response => response.data)
)

export default{
    getAll,
    create,
    update
}
