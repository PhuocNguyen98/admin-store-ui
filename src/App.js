import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { privateRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import Login from './pages/Auth/Login';
import useToken from './hooks/useToken';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const { token, setToken } = useToken();

  return (
    <>
      <ToastContainer />
      {!token || token === 'undefined' ? (
        <Router>
          <Login setToken={setToken} />
        </Router>
      ) : (
        <Router>
          <div className='app'>
            <Routes>
              {privateRoutes.map((route, index) => {
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = Fragment;
                }
                const Page = route.component;
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
