(function () {
  function openLinkedElement(event, override) {
    if (!override.linkUrl) return;
    if (event.target.closest && event.target.closest('a')) return;
    const target = override.linkTarget === '_blank' ? '_blank' : '_self';
    if (target === '_blank') {
      window.open(override.linkUrl, '_blank', 'noopener');
    } else {
      window.location.href = override.linkUrl;
    }
  }

  function applyAttributes(el, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, value);
      }
    });
  }

  function attachCustomLink(el, override) {
    if (!override.linkUrl) return;
    el.style.cursor = 'pointer';
    el.onclick = function (event) {
      openLinkedElement(event, override);
    };
  }

  function applyOverride(id, override) {
    const el = document.querySelector('[data-cms-id="' + id + '"]');
    if (!el || !override) return;

    if (override.hide) {
      el.style.display = 'none';
      return;
    }

    if (el.dataset.cmsType === 'text') {
      if (typeof override.text === 'string') {
        el.textContent = override.text;
      }
      attachCustomLink(el, override);
      return;
    }

    if (el.dataset.cmsType === 'link') {
      if (el.dataset.cmsLinkText === '1' && typeof override.text === 'string') {
        el.textContent = override.text;
      }
      if (typeof override.href === 'string' && override.href) {
        el.setAttribute('href', override.href);
      }
      if (override.target === '_blank') {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      } else {
        el.removeAttribute('target');
        if (!el.getAttribute('rel') || el.getAttribute('rel') === 'noopener noreferrer') {
          el.removeAttribute('rel');
        }
      }
      return;
    }

    if (el.dataset.cmsType === 'image') {
      if (override.src) {
        el.setAttribute('src', override.src);
        el.removeAttribute('srcset');
        el.removeAttribute('sizes');
      }
      applyAttributes(el, {
        alt: override.alt,
        title: override.title,
      });
      attachCustomLink(el, override);
      return;
    }

    if (el.dataset.cmsType === 'video') {
      const source = el.querySelector('source');
      if (source && override.src) {
        source.setAttribute('src', override.src);
      } else if (override.src) {
        el.setAttribute('src', override.src);
      }
      applyAttributes(el, {
        poster: override.poster,
      });
      ['autoplay', 'controls', 'muted', 'loop'].forEach((name) => {
        if (override[name]) {
          el.setAttribute(name, '');
        } else {
          el.removeAttribute(name);
        }
      });
      if (source && override.mimeType) {
        source.setAttribute('type', override.mimeType);
      }
      if (typeof el.load === 'function') {
        el.load();
      }
      attachCustomLink(el, override);
    }
  }

  fetch('/api/public/overrides')
    .then(function (response) { return response.json(); })
    .then(function (data) {
      const overrides = data.overrides || {};
      Object.keys(overrides).forEach(function (id) {
        applyOverride(id, overrides[id]);
      });
    })
    .catch(function () {});
})();
