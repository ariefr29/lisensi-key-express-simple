document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');
    const licenseForm = document.getElementById('license-form');
    const premiumDiv = document.getElementById('premium-content');
    const premiumData = document.getElementById('premium-data');
    const activateBtn = document.getElementById('activate-btn');
    const checkBtn = document.getElementById('check-btn');

    const showMessage = (msg, isError = false) => {
        statusDiv.textContent = msg;
        statusDiv.style.color = isError ? '#ff6666' : '#66ff66';
    };

    const hideAll = () => {
        licenseForm.classList.remove('hidden');
        premiumDiv.classList.add('hidden');
    };

    const showPremium = (content) => {
        premiumData.textContent = content;
        premiumDiv.classList.remove('hidden');
        licenseForm.classList.add('hidden');
    };

    const fetchStatus = async () => {
        try {
            const res = await fetch('/check');
            const data = await res.json();
            if (data.status === 'ok' || data.status === 'active') {
                showMessage('License valid.');
                // Load premium content
                const premiumRes = await fetch('/premium');
                const premium = await premiumRes.json();
                if (premium.status === 'ok') {
                    showPremium(premium.content);
                } else {
                    hideAll();
                    showMessage(premium.message, true);
                }
            } else {
                hideAll();
                showMessage(data.message || 'License not valid', true);
            }
        } catch (e) {
            hideAll();
            showMessage('Error contacting server', true);
        }
    };

    activateBtn.addEventListener('click', async () => {
        const key = document.getElementById('license-key').value.trim();
        if (!key) {
            showMessage('Please enter a license key', true);
            return;
        }
        try {
            const res = await fetch('/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ license_key: key })
            });
            const data = await res.json();
            if (data.status === 'ok') {
                showMessage('Activation successful');
                await fetchStatus();
            } else {
                showMessage(data.message || 'Activation failed', true);
            }
        } catch (e) {
            showMessage('Error contacting server', true);
        }
    });

    checkBtn.addEventListener('click', fetchStatus);

    // Initial check on load
    fetchStatus();
});
