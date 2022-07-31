import React from 'react'
import { useEffect } from 'react'
import Note from './components/Note'
import { useState } from 'react'
import noteService from './services/notes'
import './index.css'
import Notification from './components/Notification'


const Footer = () => {
  // 内联样式，React更推荐使用内联样式，这样可以将一个组件的所有内容汇总到一个文件当中
  // 而不是将html, javascript, css三者单独分开
  const footerStyle = {
    color: 'green', 
    fontStyle: 'italic', 
    fontSize: 16
  }
  return (
    <p style={footerStyle}>Note app, Department of Computer Science, University of Helsinki 2022 </p>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happend ...')

  // 利用效果钩子来获取数据
  // 两个参数，第一个参数：用于请求数据的函数，第二个参数：用于指定运行频率（[]代表只运行加载的第一次）
  useEffect(() => {
    // console.log('effect')
    noteService.getAll()
      .then(initialNotes => {
        // console.log('promise fulfilled')
        const nonExisting = {
          id: 10000,
          content: 'This note is not saved to server',
          date: '2019-05-30T17:30:31.098Z',
          important: true,
        }
        setNotes(initialNotes.concat(nonExisting))
      })
  }, [])
  // console.log('render', notes.length, 'notes')


  // 处理表单的提交内容
  const addNote = (event) =>{
    event.preventDefault()
    const newObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    }
    // // 只是更新了notes的变量，并没有上传到数据服务器
    // console.log(newObject)
    // setNotes(notes.concat(newObject))
    // setNewNote('')

    // 通过POST方法将提交的内容存储在json-server的db.json文件中
    noteService.create(newObject)
      .then(createdNote =>{
        setNotes(notes.concat(createdNote))
        setNewNote('')
      })
  }


  // 处理输入框的内容变化
  // 同步输入框和newNote内容的一致性
  const handleNoteChange = (event) =>{
    // console.log(event.target.value)
    setNewNote(event.target.value)
  }


  const noteToShow = showAll ? notes : notes.filter(note => note.important === true) 


  // 修改note中的important属性的处理器
  const toggleImportanceOf = (id) =>{
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important : !note.important}
    noteService.update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note ))
      })
      .catch(error =>{
        // alert('the note ' + note.content + 'was already delete from server')
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => { setErrorMessage(null) }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      { /* 通过添加一个按钮，选择important的note输出 */ }
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Show Important' : 'Show All'}
      </button>

      <ul>
        { // 使用map函数来输出note中的所有元素
          // 添加键值，避免控制台的警告
          noteToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>)
        }
      </ul>
      
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>

      <Footer />
    </div>
  )
}

export default App