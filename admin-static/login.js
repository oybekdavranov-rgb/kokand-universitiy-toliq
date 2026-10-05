const form = document.getElementById('loginForm');
const messageEl = document.getElementById('loginMessage');

function setMessage(text, type = '') {
  messageEl.textContent = text;
  messageEl.className = `form-message ${type}`.trim();
}

function getCookie(name) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop()) : '';
}

(async function checkSession() {
  const res = await fetch('/api/admin/session'); // CSRF cookie shu yerda o'rnatiladi
  const data = await res.json();
  if (data.authenticated) {
    window.location.href = '/admin';
  }
})();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCookie('ku_csrf') },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setMessage('Muvaffaqiyatli kirildi. Yuborilyapti...', 'success');
    window.location.href = '/admin';
  } catch (error) {
    setMessage(error.message, 'error');
  }
});
