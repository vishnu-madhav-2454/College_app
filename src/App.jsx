import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import Faculty from './components/faculty';
import Achievements from './components/achievements';
import Footer from './components/footer';
import Campuses from './components/campuses';
import Courses from './components/courses';
import AchievementDetails from './components/AchievementDetails';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <Navbar />
        <Home />
        <Footer />
      </div>
    ),
  },
  {
    path: '/achievements',
    element: (
      <div>
        <Navbar />
        <Achievements />
        <Footer />
      </div>
    ),
  },
  {
    path: '/faculty',
    element: (
      <div>
        <Navbar />
        <Faculty />
        <Footer />
      </div>
    ),
  },
  {
    path: '/campuses',
    element: (
      <div>
        <Navbar />
        <Campuses />
        <Footer />
      </div>
    ),
  },
  {
    path: '/courses',
    element: (
      <div>
        <Navbar />
        <Courses />
        <Footer />
      </div>
    ),
  },
  {
    path: '/achievements/:id',
    element: (
      <div>
        <Navbar />
        <AchievementDetails />
        <Footer />
      </div>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
