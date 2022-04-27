import { store as reduxStore } from 'index';
import { logout } from 'redux/accounts/actions';

// Side effects Services
export function getAuthTokens() {
  return {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
  };
}

export function setAuthTokens(access, refresh) {
  if (access !== undefined) localStorage.setItem('access', access);
  if (refresh !== undefined) localStorage.setItem('refresh', refresh);
}

export function removeAuthTokens() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

export function syncTabLogout(e) {
  if (e.key === 'access' && e.oldValue && !e.newValue) {
    reduxStore.dispatch(logout());
  }
}

export function createEventListeners() {
  window.addEventListener('storage', syncTabLogout);
}

export function deleteEventListeners() {
  window.removeEventListener('storage', syncTabLogout);
}

// View permission
export function hasRole(user, roles) {
  return roles.includes(user.role);
}
