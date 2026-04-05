(function () {
  'use strict';

  function clearAuthState() {
    localStorage.removeItem('scc_currentUser');
    localStorage.removeItem('scc_loggedIn');
    localStorage.removeItem('scc_myCourses');
  }

  function storeAuthState(user) {
    if (!user) {
      clearAuthState();
      return;
    }

    localStorage.setItem('scc_currentUser', JSON.stringify(user));
    localStorage.setItem('scc_loggedIn', 'true');
  }

  function redirectByUser(user) {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    window.location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
  }

  function fetchJSON(url, options) {
    options = options || {};
    options.credentials = 'include';

    return fetch(url, options).then(function (res) {
      return res.json().catch(function () {
        return {};
      }).then(function (data) {
        if (res.status === 401) {
          clearAuthState();
          window.location.href = 'login.html';
          throw new Error('Login required.');
        }

        if (res.status === 403) {
          redirectByUser(JSON.parse(localStorage.getItem('scc_currentUser') || 'null'));
          throw new Error('Access denied.');
        }

        if (!res.ok) {
          throw new Error(data.error || 'Request failed.');
        }

        return data;
      });
    });
  }

  function syncSession() {
    return fetchJSON('/api/auth/me').then(function (data) {
      if (data.loggedIn && data.user) {
        storeAuthState(data.user);
      } else {
        clearAuthState();
      }

      return data;
    });
  }

  function requireRole(role) {
    return syncSession().then(function (data) {
      if (!data.loggedIn || !data.user) {
        redirectByUser(null);
        throw new Error('Login required.');
      }

      if (role && data.user.role !== role) {
        redirectByUser(data.user);
        throw new Error('Access denied.');
      }

      return data.user;
    });
  }

  function logout(redirectUrl) {
    return fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(function (res) {
      return res.json().catch(function () {
        return {};
      }).then(function (data) {
        if (!res.ok) {
          throw new Error(data.error || 'Logout failed. Please try again.');
        }

        clearAuthState();

        if (redirectUrl) {
          window.location.href = redirectUrl;
        }

        return data;
      });
    });
  }

  window.SCCSession = {
    clearAuthState: clearAuthState,
    fetchJSON: fetchJSON,
    logout: logout,
    syncSession: syncSession,
    storeAuthState: storeAuthState,
    requireRole: requireRole
  };
}());
