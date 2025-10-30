const mineflayer = require('mineflayer');

const HOST = "ap1.nxp.sg.nexuscloud.asia";
const PORT = 25600;
const BOT_COUNT = 200; // coba 10 dulu dulu biar aman
const JOIN_DELAY = 3000; // 5 detik antar bot
const TARGET_SERVER = "ecocpvp"; // nama backend di Velocity
const PASSWORD = "bot123"; // password default semua bot

function createBot(index) {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: `Bot_${index}`,
    version: "1.20.2",
    checkTimeoutInterval: 60000
  });

  bot.on('spawn', () => {
    console.log(`✅ Bot_${index} berhasil join ke proxy`);

    // tunggu sebentar biar server kirim pesan login dulu
    setTimeout(() => {
      // coba register dulu (kalau sudah pernah, akan gagal -> aman)
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
      console.log(`🔑 Bot_${index} kirim: /register ${PASSWORD} ${PASSWORD}`);

      // tunggu 2 detik, lalu coba login
      setTimeout(() => {
        bot.chat(`/login ${PASSWORD}`);
        console.log(`🔐 Bot_${index} kirim: /login ${PASSWORD}`);

        // setelah login, tunggu lagi 3 detik lalu pindah server ecocpvp
        setTimeout(() => {
          bot.chat(`/server ${TARGET_SERVER}`);
          console.log(`💬 Bot_${index} kirim: /server ${TARGET_SERVER}`);
        }, 3000);

      }, 2000);
    }, 2000);
  });

  bot.on('end', () => {
    console.log(`⚠️ Bot_${index} disconnected, reconnecting...`);
    setTimeout(() => createBot(index), 5000);
  });

  bot.on('error', (err) => {
    console.log(`❌ Bot_${index} error: ${err.message}`);
    setTimeout(() => createBot(index), 5000);
  });
}

// spawn bertahap biar gak banjir login
for (let i = 1; i <= BOT_COUNT; i++) {
  setTimeout(() => {
    createBot(i);
  }, i * JOIN_DELAY);
}
