import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import { Button } from './components/ui/button'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

 
  useEffect(()=>{
if(count===2){
window.electronAPI.changeWindowSize(1000, 1000)

}else{
window.electronAPI.changeWindowSize(800, 600)

}
  },[count])

  return (
    <>
<Button>add</Button>
    </>
  )
}

export default App
