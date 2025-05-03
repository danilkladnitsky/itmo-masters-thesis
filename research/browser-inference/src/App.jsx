import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { startEngine } from './engine'

function App() {
  const [count, setCount] = useState(0)
  const engineRef = useRef(null)
  const [message, setMessage] = useState('')
  useEffect(() => {
    startEngine().then((engine) => {
      engineRef.current = engine
    })
  }, [])

  const sendMessage = async (message) => {
    console.log("message")
    const time = new Date().getTime()
    const response =  await engineRef.current.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    console.log(response)
    const time2 = new Date().getTime()
    console.log(`Time taken: ${time2 - time}ms`)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <input type="text" onChange={(e) => setMessage(e.target.value)} />
        <button onClick={() => sendMessage(message)}>Send</button>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
