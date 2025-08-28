import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/pages/Home';
import Faculty from './components/pages/Faculty';
import Achievements from './components/pages/Achievements';
import Campuses from './components/pages/Campuses';
import Courses from './components/pages/Courses';
import AchievementDetails from './components/pages/AchievementDetails';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/achievements',
    element: <Achievements />,
  },
  {
    path: '/faculty',
    element: <Faculty />,
  },
  {
    path: '/campuses',
    element: <Campuses />,
  },
  {
    path: '/courses',
    element: <Courses />,
  },
  {
    path: '/achievements/:id',
    element: <AchievementDetails />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;