import './App.css';
import Navigation from './components/navigation';
import Footer from './components/footer'; 

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation></Navigation>
      
      {/* Main content area */}
      <main className="flex-grow-1">
        <div className="container mt-4">
          <div className="text-center">
            <h1>Welcome to Lost and Found</h1>
            <p className="lead">Help reunite people with their lost belongings</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
