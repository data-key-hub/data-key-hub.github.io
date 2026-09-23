(function () {
  var KEY = 'keyur-theme', root = document.documentElement;
  function pref() {
    try { var s = localStorage.getItem(KEY); if (s) return s === 'dark'; } catch (e) {}
    return !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  root.classList.toggle('dark', pref());
  // Netlify Identity invite / password links land on the home page — forward them to the CMS.
  if (/(invite|recovery|confirmation|email_change)_token=/.test(location.hash) && !/\/admin\//.test(location.pathname)) {
    location.replace('admin/' + location.hash);
  }
  var cache = {};
  var MS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var ML = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function load(n) {
    return cache[n] || (cache[n] = fetch('content/' + n + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Could not load ' + n); return r.json();
    }));
  }
  window.Site = {
    toggleTheme: function () {
      var d = !root.classList.contains('dark');
      root.classList.toggle('dark', d);
      try { localStorage.setItem(KEY, d ? 'dark' : 'light'); } catch (e) {}
    },
    all: function () {
      return Promise.all([load('profile'), load('projects'), load('posts')]).then(function (a) {
        var projects = (a[1].items || []).slice().sort(function (x, y) { return String(y.year).localeCompare(String(x.year)); });
        var posts = (a[2].items || []).slice().sort(function (x, y) { return String(y.date).localeCompare(String(x.date)); });
        return { profile: a[0] || {}, projects: projects, posts: posts };
      });
    },
    date: function (iso, long) {
      var d = new Date(String(iso).slice(0, 10) + 'T00:00:00');
      if (isNaN(d)) return iso || '';
      return long ? d.getDate() + ' ' + ML[d.getMonth()] + ' ' + d.getFullYear() : ('0' + d.getDate()).slice(-2) + ' ' + MS[d.getMonth()] + ' ' + d.getFullYear();
    },
    paras: function (t) { return String(t || '').split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean); },
    list: function (t) { return Array.isArray(t) ? t : String(t || '').split(/[,\n]/).map(function (s) { return s.trim(); }).filter(Boolean); },
    lines: function (t) { return Array.isArray(t) ? t : String(t || '').split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean); },
    param: function (k) { return new URLSearchParams(location.search).get(k); },
    ready: function () { return new Promise(function (r) { (function t() { window.Site ? r(window.Site) : setTimeout(t, 16); })(); }); }
  };
})();
