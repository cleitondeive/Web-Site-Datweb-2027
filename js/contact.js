/** Contact forms prepare a complete message for the visitor to send in WhatsApp. */
document.addEventListener('DOMContentLoaded', () => {
  const whatsappNumber = '556530299800';
  const productNames = { PromoBank: 'PromoBank', Lukro: 'Lukro ERP', Vizage: 'Vizage Facial', Parcerias: 'Parcerias e Integrações', Outros: 'Outros Assuntos' };

  document.querySelectorAll('input[type="tel"], .phone-mask').forEach(input => {
    input.addEventListener('input', (event) => {
      let digits = event.target.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 10) digits = digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      else if (digits.length > 6) digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      else if (digits.length > 2) digits = digits.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      else if (digits.length) digits = '(' + digits;
      event.target.value = digits;
      input.setCustomValidity('');
    });
  });

  const connectForm = (form, feedback) => {
    if (!form) return;
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => field.setCustomValidity(''));
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameField = form.querySelector('[name="nome"]');
      const phoneField = form.querySelector('[name="telefone"]');
      const name = nameField.value.trim();
      const phone = phoneField.value.trim();
      nameField.setCustomValidity(name ? '' : 'Informe seu nome.');
      phoneField.setCustomValidity(/^\d{10,11}$/.test(phone.replace(/\D/g, '')) ? '' : 'Informe um telefone com DDD e 10 ou 11 dígitos.');
      if (!form.reportValidity()) return;
      const email = form.querySelector('[name="email"]').value.trim();
      const productValue = form.querySelector('[name="produto"]').value;
      const product = productNames[productValue] || productValue || 'Soluções Datweb';
      const message = form.querySelector('[name="mensagem"]')?.value.trim() || 'Gostaria de conhecer a solução e agendar uma demonstração.';
      const text = [
        '*Novo contato pelo site Datweb*', '',
        `*Nome:* ${name}`, `*E-mail:* ${email}`, `*Telefone:* ${phone}`,
        `*Solução de interesse:* ${product}`, '', '*Mensagem:*', message
      ].join('\n');
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

      if (feedback) {
        const description = document.createElement('p');
        description.textContent = 'Sua mensagem está pronta. Revise os dados e conclua o envio no WhatsApp.';
        const fallback = document.createElement('a');
        fallback.href = url;
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        fallback.textContent = 'Abrir conversa no WhatsApp ↗';
        feedback.replaceChildren(description, fallback);
        feedback.classList.remove('success');
        feedback.classList.add('ready');
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('aria-live', 'polite');
        feedback.style.display = 'block';
      }
      // The visitor's submit gesture opens the conversation; no artificial delay.
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Keep values intact: preparing a conversation does not confirm message delivery.
    });
  };
  connectForm(document.getElementById('main-contact-form'), document.getElementById('contact-form-feedback'));
  connectForm(document.getElementById('modal-demo-form'), document.getElementById('modal-demo-feedback'));
});
