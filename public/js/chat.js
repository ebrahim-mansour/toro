const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input[name=message]');
const $messageFormRoomId = $messageForm.querySelector('input[name=roomId]');
const $messageFormUsername = $messageForm.querySelector('input[name=username]');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages');

// Options
const username = $messageFormUsername.value;
const roomId = $messageFormRoomId.value;

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $('.msg_history').scrollTop($messages.scrollHeight);
  }

}

socket.on('message', (message) => {
  let incomingMessage = message.senderName == username ? false : true
  let html = ``;
  if (incomingMessage) {
    html =
    `<div class="incoming_msg">
      <div class="received_msg">
        <div class="received_withd_msg">
          <p>${message.message}</p>
          <span class="time_date">${moment(message.timestamp).format('MMMM Do YYYY, h:mm a')}</span>
        </div>
      </div>
    </div>`;
  } else {
    html = 
    `
    <div class="outgoing_msg">
      <div class="sent_msg">
        <!-- ${message.senderName} -->
        <p>${message.message}</p>
        <span class="time_date">${moment(message.timestamp).format('MMMM Do YYYY, h:mm a')}</span>
      </div>
    </div>`;  
  }
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

$messageForm.addEventListener('submit', event => {
  event.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = event.target.elements.message.value;
  const messageInfo = {
    username: $messageFormUsername.value,
    roomId: $messageFormRoomId.value,
    message
  }

  socket.emit('sendMessage', messageInfo, () => {

    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

  });
});

socket.emit('join', { username, roomId });