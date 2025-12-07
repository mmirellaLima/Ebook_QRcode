const textInput = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const qrArea = document.getElementById('qrArea');
const sizeInput = document.getElementById('sizeInput');
const ecLevel = document.getElementById('ecLevel');

let qrcode = null;

function clearQR() {
  qrArea.innerHTML = '';
  qrcode = null;
  downloadBtn.disabled = true;
}

function generateQR() {
  const text = textInput.value.trim();
  if (!text) {
    alert('Digite um texto ou URL para gerar o QR Code.');
    return;
  }

  clearQR();

  const size = parseInt(sizeInput.value, 10) || 256;
  const level = ecLevel.value || 'M';

  qrcode = new QRCode(qrArea, {
    text,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel[level] // L, M, Q, H
  });

  // Habilita botão de download depois de pequena espera (render)
  setTimeout(() => {
    downloadBtn.disabled = false;
  }, 150);
}

function downloadQR() {
  if (!qrcode) return;
  // qrcode cria um <img> ou <canvas> internamente dependendo do navegador
  const img = qrArea.querySelector('img') || qrArea.querySelector('canvas');
  if (!img) return alert('QR não encontrado.');

  // Se for canvas -> usar toDataURL, se for img -> pegar src
  if (img.tagName.toLowerCase() === 'canvas') {
    const url = img.toDataURL('image/png');
    triggerDownload(url, 'qrcode.png');
  } else {
    // img
    triggerDownload(img.src, 'qrcode.png');
  }
}

function triggerDownload(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

generateBtn.addEventListener('click', generateQR);
downloadBtn.addEventListener('click', downloadQR);
clearBtn.addEventListener('click', () => {
  textInput.value = '';
  clearQR();
});

// Accessibility: permitir Enter no input para gerar
textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') generateQR();
});