export async function getLeftMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'fas fa-tachometer fa-lg',
      roles: ['waiter', 'chef', 'barman'],
    },
    {
      title: 'Waiters',
      key: 'dashboard-waiter',
      url: '/dashboard/waiter',
      icon: 'fas fa-hand-holding-box fa-lg',
      hide: false,
      roles: ['waiter'],
    },
    {
      title: 'Chefs',
      key: 'dashboard-chef',
      url: '/dashboard/chef',
      icon: 'fas fa-hat-chef fa-lg',
      hide: false,
      roles: ['chef'],
    },
    {
      title: 'Barmans',
      key: 'dashboard-barman',
      url: '/dashboard/barman',
      icon: 'fas fa-cocktail fa-lg',
      hide: false,
      roles: ['barman'],
    },
  ];
}
export async function getTopMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'fas fa-tachometer fa-lg',
      roles: ['waiter', 'chef', 'barman'],
    },
    {
      title: 'Waiters',
      key: 'dashboard-waiter',
      url: '/dashboard/waiter',
      icon: 'fas fa-hand-holding-box fa-lg',
      roles: ['waiter'],
    },
    {
      title: 'Chefs',
      key: 'dashboard-chef',
      url: '/dashboard/chef',
      icon: 'fas fa-hat-chef fa-lg',
      roles: ['chef'],
    },
    {
      title: 'Barmans',
      key: 'dashboard-barman',
      url: '/dashboard/barman',
      icon: 'fas fa-cocktail fa-lg',
      roles: ['barman'],
    },
  ];
}
