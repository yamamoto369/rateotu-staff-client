export function getLayout(pathname) {
  const nonAuthAccountsPaths = ['/accounts/settings'];

  if (pathname === '/') {
    return 'public';
  }
  if (/^\/accounts(?=\/|$)/i.test(pathname)) {
    if (!nonAuthAccountsPaths.includes(pathname)) {
      return 'login';
    }
  }
  return 'main';
}

export function getMenuItemTagStyle(type) {
  return type === 'FOOD'
    ? { color: '#fff', backgroundColor: '#43a744' }
    : { color: '#fff', backgroundColor: '#32cfcb' };
}
