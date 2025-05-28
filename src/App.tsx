import './App.css'
import {Graph} from "./components/Graph/Graph.tsx";

function App() {
  // const [count, setCount] = useState(0)

  return (
      <div className={'App'}>
          <Graph someProps={1}/>
      </div>
  )
}

export default App
