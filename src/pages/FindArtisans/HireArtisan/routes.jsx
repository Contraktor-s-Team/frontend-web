import { Navigate } from 'react-router-dom';
import HireArtisanLayout from './HireArtisanLayout';
import DescribeJob from './DescribeJob';
import TimeLocation from './TimeLocation';
import ReviewSubmit from './ReviewSubmit';

const hireArtisanRoutes = [
  {
    path: 'hire-artisan',
    element: <HireArtisanLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="describe" replace />
      },
      {
        path: ':artisanId',
        element: <HireArtisanLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="describe" replace />
          },
          {
            path: 'describe',
            element: <DescribeJob />
          },
          {
            path: 'time-location',
            element: <TimeLocation />
          },
          {
            path: 'review',
            element: <ReviewSubmit />
          }
        ]
      }
    ]
  }
];

export default hireArtisanRoutes;
