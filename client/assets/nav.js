/**
 * nav.js — Shared navigation, breadcrumbs, and hamburger for every page.
 *
 * Responsibilities:
 *  1. Replace the static <ul> with role-aware links (public / student / admin).
 *  2. Highlight the active link for the current page.
 *  3. Wire up the hamburger toggle (mobile).
 *  4. Render breadcrumbs into #breadcrumb if the element exists.
 *  5. Handle logout.
 */
(function () {
  'use strict';

  // Current page filename, e.g. "course-details.html"
  var page   = window.location.pathname.split('/').pop() || 'index.html';
  var params = new URLSearchParams(window.location.search);

  var currentUser = JSON.parse(localStorage.getItem('scc_currentUser') || 'null');
  var role        = currentUser ? currentUser.role : 'public';

  function clearAuthState() {
    if (window.SCCSession && typeof window.SCCSession.clearAuthState === 'function') {
      window.SCCSession.clearAuthState();
      return;
    }

    localStorage.removeItem('scc_currentUser');
    localStorage.removeItem('scc_loggedIn');
    localStorage.removeItem('scc_myCourses');
  }

  // ── 1. Nav link sets by role ────────────────────────────────────
  function getNavLinks() {
    if (role === 'admin') {
      return [
        { href: 'admin-dashboard.html',     label: 'Dashboard'      },
        { href: 'admin-course-manage.html', label: 'Manage Courses' },
        { href: 'admin-courses.html',       label: 'Create Course'  },
        { href: 'admin-stats.html',         label: 'Analytics'      },
        { href: '#logout',                  label: 'Logout'         }
      ];
    }
    if (role === 'student') {
      return [
        { href: 'student-dashboard.html', label: 'Dashboard'  },
        { href: 'courses.html',           label: 'My Courses' },
        { href: '#logout',                label: 'Logout'     }
      ];
    }
    // Public / not logged in
    return [
      { href: 'index.html',    label: 'Home'     },
      { href: 'login.html',    label: 'Login'    },
      { href: 'register.html', label: 'Register' }
    ];
  }

  // Which nav href should be highlighted for the current page
  var ACTIVE_MAP = {
    'index.html':               'index.html',
    'login.html':               'login.html',
    'register.html':            'register.html',
    'student-dashboard.html':   'student-dashboard.html',
    'courses.html':             'courses.html',
    'course-details.html':      'courses.html',
    'assessment-form.html':     'courses.html',
    'admin-dashboard.html':     'admin-dashboard.html',
    'admin-courses.html':       'admin-courses.html',
    'admin-course-manage.html': 'admin-course-manage.html',
    'admin-stats.html':         'admin-stats.html'
  };

  // ── 2. Render nav links ─────────────────────────────────────────
  var nav = document.querySelector('[data-nav]');
  function renderNav() {
    if (!nav) {
      return;
    }

    var ul = nav.querySelector('ul');
    if (ul) {
      var activeHref = ACTIVE_MAP[page] || '';
      ul.innerHTML   = '';

      getNavLinks().forEach(function (link) {
        var li = document.createElement('li');
        var a  = document.createElement('a');
        a.href        = link.href;
        a.textContent = link.label;

        if (link.href === '#logout') {
          a.id = 'nav-logout-link';
          a.style.cursor = 'pointer';
        } else if (link.href === activeHref) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }

        li.appendChild(a);
        ul.appendChild(li);
      });
    }

    var logoutLink = document.getElementById('nav-logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', function (e) {
        e.preventDefault();

        if (window.SCCSession && typeof window.SCCSession.logout === 'function') {
          window.SCCSession.logout('index.html').catch(function (error) {
            window.alert(error.message || 'Could not log out. Please try again.');
          });
          return;
        }

        fetch('/api/auth/logout', {
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
            window.location.href = 'index.html';
          });
        }).catch(function (error) {
          window.alert(error.message || 'Could not log out. Please try again.');
        });
      });
    }
  }

  if (nav) {
    renderNav();

    // ── 3. Hamburger toggle ───────────────────────────────────────
    var toggleBtn = document.querySelector('[data-nav-toggle]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
      // Close menu when any nav link is clicked on mobile
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          nav.classList.remove('open');
        }
      });
    }
  }

  if (window.SCCSession && typeof window.SCCSession.syncSession === 'function') {
    window.SCCSession.syncSession().then(function (data) {
      var nextUser = data.loggedIn ? data.user : null;
      var nextRole = nextUser ? nextUser.role : 'public';

      if (nextRole !== role) {
        currentUser = nextUser;
        role = nextRole;
        renderNav();
      }
    }).catch(function () {});
  }

  // ── 4. Breadcrumbs ──────────────────────────────────────────────
  var breadcrumbEl = document.getElementById('breadcrumb');
  if (!breadcrumbEl) return;

  var crumbs = buildCrumbs();
  // Only show breadcrumbs when there is more than the home crumb
  if (crumbs.length <= 1) {
    breadcrumbEl.style.display = 'none';
    return;
  }

  breadcrumbEl.setAttribute('aria-label', 'Breadcrumb navigation');
  var ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  crumbs.forEach(function (crumb, i) {
    var li     = document.createElement('li');
    var isLast = i === crumbs.length - 1;

    if (isLast) {
      var span = document.createElement('span');
      span.textContent = crumb.label;
      span.setAttribute('aria-current', 'page');
      li.appendChild(span);
    } else {
      var a  = document.createElement('a');
      a.href        = crumb.href;
      a.textContent = crumb.label;
      li.appendChild(a);
    }
    ol.appendChild(li);
  });

  breadcrumbEl.appendChild(ol);

  // ── Breadcrumb helpers ─────────────────────────────────────────
  function getCourseLabel(courseId) {
    var courses = JSON.parse(localStorage.getItem('scc_myCourses') || '[]');
    var course  = courses.find(function (c) { return c.id === Number(courseId); });
    return course ? course.code + ' \u2014 ' + course.name : 'Course';
  }

  function buildCrumbs() {
    var home = { label: 'Home', href: 'index.html' };

    switch (page) {
      case 'login.html':
        return [home, { label: 'Login', href: 'login.html' }];

      case 'register.html':
        return [home, { label: 'Register', href: 'register.html' }];

      case 'student-dashboard.html':
        return [home, { label: 'Dashboard', href: 'student-dashboard.html' }];

      case 'courses.html':
        return [home, { label: 'My Courses', href: 'courses.html' }];

      case 'course-details.html': {
        var id = params.get('id');
        return [
          home,
          { label: 'My Courses',           href: 'courses.html' },
          { label: getCourseLabel(id),      href: 'course-details.html?id=' + id }
        ];
      }

      case 'assessment-form.html': {
        var cId = params.get('courseId');
        return [
          home,
          { label: 'My Courses',           href: 'courses.html' },
          { label: getCourseLabel(cId),     href: 'course-details.html?id=' + cId },
          { label: 'Add Assessment',        href: 'assessment-form.html?courseId=' + cId }
        ];
      }

      case 'admin-dashboard.html':
        return [home, { label: 'Admin Dashboard', href: 'admin-dashboard.html' }];

      case 'admin-courses.html':
        return [
          home,
          { label: 'Admin Dashboard', href: 'admin-dashboard.html' },
          { label: 'Create Course',   href: 'admin-courses.html'   }
        ];

      case 'admin-course-manage.html':
        return [
          home,
          { label: 'Admin Dashboard', href: 'admin-dashboard.html'     },
          { label: 'Manage Courses',  href: 'admin-course-manage.html' }
        ];

      case 'admin-stats.html':
        return [
          home,
          { label: 'Admin Dashboard', href: 'admin-dashboard.html' },
          { label: 'Analytics',       href: 'admin-stats.html'     }
        ];

      default:
        return [home];
    }
  }
})();
