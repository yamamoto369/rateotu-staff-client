export async function getLeftMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'fas fa-burger-soda fa-lg',
      hide: false,
      roles: ['employee'],
    },
  ];
}
export async function getTopMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'fas fa-burger-soda fa-lg',
      roles: ['employee'],
    },
  ];
}
