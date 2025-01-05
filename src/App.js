import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from './Signup'
import Login from './Login'
import Payment from './Payment';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Signup' element={<Signup />}></Route>
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/Payment' element={<Payment />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App