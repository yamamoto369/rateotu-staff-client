import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'
import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'
import AuthorizedRoute from 'components/LayoutComponents/Authorization/AuthorizedRoute'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })


const publicRoutes = [
  // Accounts
  {
    path: '/accounts/login',
    component: loadable(() => import('pages/accounts/login')),
    exact: true,
    roles: ['anonymous'],
  },
  /* {
    path: '/accounts/register',
    component: loadable(() => import('pages/accounts/register')),
    exact: true,
    roles: ['anonymous'],
  },
  {
    path: '/accounts/register/completed',
    component: loadable(() => import('pages/accounts/register/completed')),
    exact: true,
    roles: ['anonymous'],
  },
  {
    path: '/accounts/activate/:uid/:token',
    component: loadable(() => import('pages/accounts/activate')),
    exact: true,
    roles: ['anonymous'],
  },
  {
    path: '/accounts/password/reset',
    component: loadable(() => import('pages/accounts/password/reset')),
    exact: true,
    roles: ['anonymous'],
  },
  {
    path: '/accounts/password/reset/confirm/:uid/:token',
    component: loadable(() => import('pages/accounts/password/reset/confirm')),
    exact: true,
    roles: ['anonymous'],
  }, */
  // Permissions page (internal & external)
  {
    path: '/forbidden',
    component: loadable(() => import('pages/403')),
    exact: true,
    roles: ['anonymous', 'waiter', 'chef', 'barman'],
  },
];

const protectedRoutes = [
  {
    path: '/dashboard',
    component: loadable(() => import('pages/dashboard')),
    exact: true,
    roles: ['waiter', 'chef', 'barman'],
  },
  {
    path: '/dashboard/waiter',
    component: loadable(() => import('pages/dashboard/waiter')),
    exact: true,
    roles: ['waiter'],
  },
  {
    path: '/dashboard/chef',
    component: loadable(() => import('pages/dashboard/chef')),
    exact: true,
    roles: ['chef'],
  },
  {
    path: '/dashboard/barman',
    component: loadable(() => import('pages/dashboard/barman')),
    exact: true,
    roles: ['barman'],
  },
];

const routes = [
  ...publicRoutes,
  ...[...protectedRoutes,]
]

class Router extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={AuthorizedRoute(route.roles)(route.component)}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
