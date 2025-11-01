import Navbar from "./components/Navbar"
import MainRoutes from "./routes/MainRoutes"

const App = () => {
  return (
    <div className="w-screen h-screen flex overflow-hidden flex-1">
       {/* LEFT NAVBAR FIXED */}
      <div className="w-68 h-full">
        <Navbar />
      </div>

      {/* RIGHT CONTENT SCROLLABLE */}
      <div className="flex-1 h-full overflow-y-auto">
        <MainRoutes />
      </div>
    </div>
  )
}

export default App