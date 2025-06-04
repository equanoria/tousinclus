const { io } = require('socket.io-client');

const socket = io('http://localhost:3201', {
  transports: ['websocket'], // ✅ Important
});

socket.on('connect', () => {
  console.log("✅ Connecté avec l'ID :", socket.id);

  socket.emit('room:find', { code: '489612' }, (response) => {
    console.log('📩 Réponse du serveur :', response);
  });
});

socket.on('connect_error', (err) => {
  console.error('❌ Erreur de connexion :', err.message);
});
