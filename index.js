const mc = require('minecraft-protocol');
const express = require('express');

// Веб-сервер для удержания бота на внешнем бесплатном хостинге (Render, Koyeb и т.д.)
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Velocity Socket Keeper is Active'));
app.listen(PORT, () => console.log(`[Web] HTTP-сервер запущен на порту ${PORT}`));

const CONFIG = {
  host: '144.31.46.6:13723', // IP твоего Velocity
  port: 13723,                   // Порт Velocity
  username: 'purefish',   // Никнейм сокет-бота
  version: '1.20.1'              // Версия протокола (или false для авто-выбора)
};

function connectToVelocity() {
  console.log(`[*] Открытие протокольного сокета с Velocity (${CONFIG.host}:${CONFIG.port})...`);

  const client = mc.createClient({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version,
    checkTimeoutInterval: 30000
  });

  client.on('success', (packet) => {
    console.log(`[+] Соединение с Velocity успешно установлено! Пакетное удержание активно.`);
  });

  // Авто-ответ на KeepAlive пакеты Velocity (подтверждает сетевую активность)
  client.on('keep_alive', (packet) => {
    client.write('keep_alive', { keepAliveId: packet.keepAliveId });
  });

  client.on('error', (err) => {
    console.error(`[!] Ошибка сокета: ${err.message}`);
  });

  client.on('end', (reason) => {
    console.log(`[-] Соединение разровано (${reason}). Повтор через 10 секунд...`);
    setTimeout(connectToVelocity, 10000);
  });
}

connectToVelocity();
