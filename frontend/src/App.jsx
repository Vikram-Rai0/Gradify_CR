import React from 'react'
import Layout from './layouts/SidebarLayout'
import { BrowserRouter,Routes } from 'react-router-dom'
import AppRoutes from './router/AppRoutes'

const App = () => {
  return (
    <div>
<BrowserRouter>
<AppRoutes/>
</BrowserRouter>
      {/* <Layout /> */}

    </div>
  )
}

export default App
