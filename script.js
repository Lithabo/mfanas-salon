'use strict';
const config = window.SALON_CONFIG || {};
const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); menu.focus(); } });
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#address').textContent = config.address || 'Address to be added';
document.querySelector('#hours').textContent = config.hours || 'Opening hours to be added';
const date = document.querySelector('#date');
function today() { const d = new Date(); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-'); }
date.min = today();
date.addEventListener('focus', () => { date.min = today(); });
const form = document.querySelector('#booking-form');
const preview = document.querySelector('#preview');
form.addEventListener('input', () => { preview.hidden = true; document.querySelector('#status').textContent = ''; });
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#service').value = button.dataset.service;
  preview.hidden = true;
  document.querySelector('#booking').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}));
form.addEventListener('submit', e => {
  e.preventDefault();
  date.min = today();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  if (!name) { document.querySelector('#status').textContent = 'Please enter your name.'; return; }
  const message = `Hi Mfana’s Salon! I’d like to request an appointment.\n\nName: ${name}\nContact: ${String(data.get('phone')).trim()}\nService: ${data.get('service')}\nPreferred date: ${data.get('date')}\nPreferred time: ${data.get('time')}\nNotes: ${String(data.get('notes')).trim() || 'None'}\n\nPlease confirm availability. Thank you!`;
  document.querySelector('#message').textContent = message;
  const number = String(config.whatsappNumber || '');
  const ready = /^[1-9]\d{7,14}$/.test(number);
  const send = document.querySelector('#send');
  send.hidden = !ready;
  if (ready) send.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  else send.removeAttribute('href');
  document.querySelector('#setup').hidden = ready;
  preview.hidden = false;
  document.querySelector('#status').textContent = ready ? 'Your request is ready to review. Nothing has been sent yet.' : 'Preview ready. WhatsApp setup is still pending.';
});
