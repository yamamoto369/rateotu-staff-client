export async function getLeftMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'fas fa-columns fa-lg',
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
      icon: 'fas fa-columns fa-lg',
      roles: ['employee'],
    },
  ];
}
