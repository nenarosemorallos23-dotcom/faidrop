(() => {
  const callDialog = document.querySelector('#call-rider-dialog');
  const callButton = document.querySelector('#call-rider');
  const closeCallButton = document.querySelector('#close-call-dialog');
  const copyPhoneButton = document.querySelector('#copy-rider-phone');
  const callStatus = document.querySelector('#call-action-status');
  const dialog = document.querySelector('#rider-message-dialog');
  const openButton = document.querySelector('#open-message-dialog');
  const closeButton = document.querySelector('#close-message-dialog');
  const form = document.querySelector('#rider-message-form');
  const messageField = document.querySelector('#rider-message');
  const messageError = document.querySelector('#rider-message-error');
  const copyButton = document.querySelector('#copy-rider-message');

  if (!callDialog || !callButton || !closeCallButton || !copyPhoneButton || !callStatus ||
      !dialog || !openButton || !closeButton || !form || !messageField || !messageError || !copyButton) return;

  const copyToClipboard = async value => {
    if (!navigator.clipboard?.writeText) return false;
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  callButton.addEventListener('click', () => {
    callStatus.textContent = '';
    callDialog.showModal();
  });
  closeCallButton.addEventListener('click', () => callDialog.close());
  callDialog.addEventListener('click', event => {
    if (event.target === callDialog) callDialog.close();
  });
  copyPhoneButton.addEventListener('click', async () => {
    const copied = await copyToClipboard('0966 312 7933');
    callStatus.textContent = copied
      ? 'Phone number copied. You can paste it into your phone app.'
      : 'Clipboard is unavailable. Use 0966 312 7933 to call Crebello.';
  });

  openButton.addEventListener('click', () => {
    document.querySelector('#message-action-status').textContent = '';
    dialog.showModal();
    messageField.focus();
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  messageField.addEventListener('input', () => {
    if (messageField.value.trim()) messageError.textContent = '';
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = messageField.value.trim();
    if (!message) {
      messageError.textContent = 'Enter a message before opening your SMS app.';
      messageField.focus();
      return;
    }

    const status = document.querySelector('#message-action-status');
    status.textContent = 'Opening your SMS app… If it does not open, choose Copy message and paste it into your messaging app.';
    const smsLink = document.createElement('a');
    smsLink.href = `sms:+639663127933?body=${encodeURIComponent(message)}`;
    smsLink.hidden = true;
    document.body.append(smsLink);
    smsLink.click();
    smsLink.remove();
  });

  copyButton.addEventListener('click', async () => {
    const message = messageField.value.trim();
    if (!message) {
      messageError.textContent = 'Enter a message before copying it.';
      messageField.focus();
      return;
    }

    const copied = await copyToClipboard(message);
    if (copied) {
      document.querySelector('#message-action-status').textContent = 'Message copied. Paste it into your messaging app to send it to Crebello.';
    } else {
      messageField.focus();
      messageField.select();
      document.querySelector('#message-action-status').textContent = 'Clipboard is unavailable. The message is selected; copy it and paste it into your messaging app.';
    }
  });
})();
