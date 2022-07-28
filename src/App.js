import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import Note from './components/Note'
import { useState } from 'react'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // 利用效果钩子来获取数据
  // 两个参数，第一个参数：用于请求数据的函数，第二个参数：用于指定运行频率（[]代表只运行加载的第一次）
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  // 处理表单的提交内容
  const addNote = (event) =>{
    event.preventDefault()

    // 
    const newObject = {
      content: newNote,
      date: new Date().toISOString(),
      id: notes.length + 1, 
      important: Math.random() < 0.5
    }
    console.log(newObject)
    setNotes(notes.concat(newObject))
    setNewNote('')
  }

  // 处理输入框的内容变化
  // 同步输入框和newNote内容的一致性
  const handleNoteChange = (event) =>{
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const noteToShow = showAll ? notes : notes.filter(note => note.important === true) 

  return (
    <div>
      <h1>Notes</h1>

      { /* 通过添加一个按钮，选择important的note输出 */ }
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Show Important' : 'Show All'}
      </button>

      <ul>
        { // 使用map函数来输出note中的所有元素
          // 添加键值，避免控制台的警告
          noteToShow.map(note => <Note key={note.id} note={note}/>)
        }
      </ul>
      
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App