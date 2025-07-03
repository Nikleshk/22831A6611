document.addEventListener('DOMContentLoaded', function () {
    const urlForm = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const customSlug = document.getElementById('custom-slug');
    const expires = document.getElementById('expires');
    const resultsSection = document.getElementById('results-section');
    const shortUrlElement = document.getElementById('short-url');
    const originalUrlElement = document.getElementById('original-url');
    const expirationDateElement = document.getElementById('expiration-date');
    const copyBtn = document.getElementById('copy-btn');
    const newLinkBtn = document.getElementById('new-link-btn');
    const submitText = document.getElementById('submit-text');
    const loadingAnimation = document.getElementById('loading-animation');
    const qrModal = document.getElementById('qr-modal');
    const qrCodeLink = document.getElementById('qr-code-link');
    const qrCodeImg = document.getElementById('qr-code-img');
    const closeQrModal = document.getElementById('close-qr-modal');
    const downloadQrBtn = document.getElementById('download-qr-btn');

    urlForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        submitText.textContent = 'Shortening...';
        loadingAnimation.style.display = 'inline-block';

        try {
            const response = await fetch('http://localhost:3000/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: urlInput.value,
                    slug: customSlug.value || null,
                    expiresIn: expires.value
                })
            });

            const data = await response.json();

            const shortUrl = `${window.location.protocol}//${window.location.hostname}/${data.slug}`;
            shortUrlElement.textContent = shortUrl;
            originalUrlElement.textContent = data.originalUrl;
            expirationDateElement.textContent = data.expiration;

            qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shortUrl)}`;

            resultsSection.classList.remove('hidden');
            urlInput.value = '';
            customSlug.value = '';
        } catch (err) {
            alert('Error shortening URL');
        } finally {
            submitText.textContent = 'Shorten URL';
            loadingAnimation.style.display = 'none';
        }
    });

    copyBtn.addEventListener('click', function () {
        const textToCopy = shortUrlElement.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        });
    });

    newLinkBtn.addEventListener('click', function () {
        resultsSection.classList.add('hidden');
    });

    qrCodeLink.addEventListener('click', function (e) {
        e.preventDefault();
        qrModal.classList.remove('hidden');
    });

    closeQrModal.addEventListener('click', function () {
        qrModal.classList.add('hidden');
    });

    downloadQrBtn.addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = qrCodeImg.src;
        link.download = 'shortlink-qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
