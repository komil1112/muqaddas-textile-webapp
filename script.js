const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

let scanner = null;
let scanned = false;

function showStatus(msg, type) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.className = "status " + type;
}

function startScanner() {
  scanned = false;
  document.getElementById("retry-btn").classList.add("hidden");
  showStatus("", "");

  if (scanner) {
    scanner.clear().catch(() => {});
  }

  scanner = new Html5Qrcode("reader");
  scanner
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      onScanSuccess,
      () => {}
    )
    .catch((err) => {
      showStatus("❌ Kameraga ruxsat berilmadi. Sozlamalardan ruxsat bering.", "error");
      document.getElementById("retry-btn").classList.remove("hidden");
    });
}

function onScanSuccess(decodedText) {
  if (scanned) return;
  scanned = true;

  scanner.stop().catch(() => {});
  showStatus("✅ QR kod skanerlandi! Botga yuborilmoqda...", "success");

  if (tg) {
    tg.sendData(decodedText);
  } else {
    // Brauzerda sinash uchun
    showStatus("Token: " + decodedText, "success");
  }
}

// Sahifa yuklanganda avtomatik boshlanadi
startScanner();
