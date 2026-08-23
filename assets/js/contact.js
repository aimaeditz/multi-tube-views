/**
 * Multi Tube Views (MTV) — Contact Form Delivery & Validation Engine
 * Sends validated submissions directly to aipromptxpert@gmail.com via FormSubmit AJAX.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const targetEmail = 'aipromptxpert@gmail.com';
  const submitBtn = document.getElementById('contact-submit-btn');
  const inlineStatus = document.getElementById('contact-inline-status');

  // Input elements & validation definitions
  const fields = {
    name: {
      input: document.getElementById('contact-name'),
      error: document.getElementById('contact-name-error'),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return 'Please enter your full name.';
        if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
        return null;
      }
    },
    email: {
      input: document.getElementById('contact-email'),
      error: document.getElementById('contact-email-error'),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return 'Please enter your email address.';
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g. name@example.com).';
        return null;
      }
    },
    subject: {
      input: document.getElementById('contact-subject'),
      error: document.getElementById('contact-subject-error'),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return 'Please enter a subject.';
        if (trimmed.length < 3) return 'Subject must be at least 3 characters.';
        return null;
      }
    },
    message: {
      input: document.getElementById('contact-message'),
      error: document.getElementById('contact-message-error'),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return 'Please write your message.';
        if (trimmed.length < 10) return 'Message must be at least 10 characters long.';
        return null;
      }
    }
  };

  // Helper: show field error
  function showFieldError(field, msg) {
    if (!field || !field.input) return;
    field.input.classList.add('is-invalid');
    if (field.error) {
      field.error.textContent = msg;
      field.error.classList.add('visible');
    }
  }

  // Helper: clear field error
  function clearFieldError(field) {
    if (!field || !field.input) return;
    field.input.classList.remove('is-invalid');
    if (field.error) {
      field.error.textContent = '';
      field.error.classList.remove('visible');
    }
  }

  // Helper: clear all validation errors & inline status
  function clearAllErrors() {
    Object.keys(fields).forEach((key) => clearFieldError(fields[key]));
    if (inlineStatus) {
      inlineStatus.style.display = 'none';
      inlineStatus.innerHTML = '';
      inlineStatus.className = 'contact-inline-status';
    }
  }

  // Attach live input & blur validation listeners
  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field.input) return;

    field.input.addEventListener('input', () => {
      if (field.input.classList.contains('is-invalid')) {
        const err = field.validate(field.input.value);
        if (!err) {
          clearFieldError(field);
        }
      }
    });

    field.input.addEventListener('blur', () => {
      const err = field.validate(field.input.value);
      if (err && field.input.value.trim().length > 0) {
        showFieldError(field, err);
      }
    });
  });

  // Display clean, small inline status message below form
  function showInlineStatus(type, message) {
    if (!inlineStatus) return;
    inlineStatus.style.display = 'block';
    inlineStatus.className = `contact-inline-status ${type}`;

    const iconSvg = type === 'success'
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    inlineStatus.innerHTML = `
      <div class="contact-inline-alert ${type}">
        <span class="inline-alert-icon">${iconSvg}</span>
        <span class="inline-alert-text">${escapeHTML(message)}</span>
      </div>
    `;
  }

  function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    // Honeypot check for bots
    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot && honeypot.value) {
      return;
    }

    // Validate all fields
    let hasError = false;
    let firstInvalidInput = null;

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      const err = field.validate(field.input.value);
      if (err) {
        showFieldError(field, err);
        hasError = true;
        if (!firstInvalidInput) {
          firstInvalidInput = field.input;
        }
      }
    });

    if (hasError) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Prepare payload for submission
    const nameVal = fields.name.input.value.trim();
    const emailVal = fields.email.input.value.trim();
    const subjectVal = fields.subject.input.value.trim();
    const messageVal = fields.message.input.value.trim();

    const payload = {
      name: nameVal,
      email: emailVal,
      subject: subjectVal,
      message: messageVal,
      _subject: `[MTV Contact Form] ${subjectVal} (from ${nameVal})`,
      _replyto: emailVal,
      _template: 'table',
      _captcha: 'false'
    };

    // UI Loading state on button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Sending Message...';
    }

    try {
      const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok || data.success === 'true' || data.success === true) {
        // Genuine successful submission
        form.reset();
        showInlineStatus('success', 'Your message has been sent successfully. We will get back to you shortly.');
      } else {
        throw new Error(data.message || 'Unable to deliver message at this time.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      showInlineStatus('error', err.message || 'Unable to send message right now. Please check your connection and try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Send Message';
      }
    }
  });
});
