import Note from './components/Note'

const App = ({notes}) => {

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        { // 使用map函数来输出note中的所有元素
          // 添加键值，避免控制台的警告
          notes.map(note => <Note key={note.id} note={note}/>)
        }
      </ul>
    </div>
  )
}

export default App