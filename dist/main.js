const LIGHTNING_ADDRESS = 'visionlux@getalby.com';
const COP_PER_USD = 3850;
const products = [
    {
        id: 1,
        name: { en: 'Classic Wayfarer', es: 'Wayfarer Clásico' },
        brand: 'Ray-Ban',
        category: 'prescription',
        price: 350000,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
        description: { en: 'Iconic design with prescription lenses', es: 'Diseño icónico con lentes de fórmula' }
    },
    {
        id: 2,
        name: { en: 'Aviator Gold', es: 'Aviador Dorado' },
        brand: 'Ray-Ban',
        category: 'sunglasses',
        price: 420000,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        description: { en: 'Classic aviator sunglasses', es: 'Gafas de sol aviador clásicas' }
    },
    {
        id: 3,
        name: { en: 'Modern Round', es: 'Redondo Moderno' },
        brand: 'VisionLux',
        category: 'prescription',
        price: 280000,
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        description: { en: 'Trendy round frames for any prescription', es: 'Monturas redondas modernas para cualquier fórmula' }
    },
    {
        id: 4,
        name: { en: 'Sport Pro', es: 'Sport Pro' },
        brand: 'Oakley',
        category: 'sunglasses',
        price: 480000,
        image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop',
        description: { en: 'High-performance sports sunglasses', es: 'Gafas de sol deportivas de alto rendimiento' }
    },
    {
        id: 5,
        name: { en: 'Executive Rectangular', es: 'Ejecutivo Rectangular' },
        brand: 'VisionLux',
        category: 'prescription',
        price: 320000,
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop',
        description: { en: 'Professional look with blue light filter', es: 'Look profesional con filtro de luz azul' }
    },
    {
        id: 6,
        name: { en: 'Retro Cat Eye', es: 'Cat Eye Retro' },
        brand: 'Ray-Ban',
        category: 'sunglasses',
        price: 390000,
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=400&fit=crop',
        description: { en: 'Vintage-inspired cat eye sunglasses', es: 'Gafas de sol cat eye estilo vintage' }
    }
];
const state = {
    currentLang: 'en',
    cart: []
};
document.addEventListener('DOMContentLoaded', () => {
    bindUI();
    initTheme();
    renderProducts('all');
    updateLanguage();
    calculateQuote();
});
function bindUI() {
    qs('#themeToggle')?.addEventListener('click', toggleTheme);
    qs('#langToggle')?.addEventListener('click', toggleLanguage);
    qs('#cartBtn')?.addEventListener('click', openCart);
    const quoteInputs = ['od_sph', 'od_cyl', 'od_axis', 'od_add', 'os_sph', 'os_cyl', 'os_axis', 'os_add', 'material', 'filter', 'frameStyle', 'antireflex', 'blueLight', 'scratch'];
    quoteInputs.forEach((id) => {
        const el = document.getElementById(id);
        el?.addEventListener('change', calculateQuote);
        el?.addEventListener('input', calculateQuote);
    });
    qsa('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            qsa('.filter-btn').forEach((b) => b.classList.remove('active', 'bg-primary-500', 'text-white'));
            btn.classList.add('active', 'bg-primary-500', 'text-white');
            renderProducts(btn.dataset.filter);
        });
    });
    qsa('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href') || '');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const stored = localStorage.getItem('theme');
    const shouldUseDark = stored === 'dark' || (!stored && prefersDark);
    if (shouldUseDark) {
        document.documentElement.classList.add('dark');
    }
}
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
}
function toggleLanguage() {
    state.currentLang = state.currentLang === 'en' ? 'es' : 'en';
    updateLanguage();
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter;
    renderProducts(activeFilter || 'all');
    updateCartUI();
}
function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach((el) => {
        const element = el;
        const value = element.dataset[state.currentLang];
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            el.placeholder = value || el.placeholder;
        }
        else if (el instanceof HTMLOptionElement) {
            el.textContent = value || el.textContent;
        }
        else {
            el.textContent = value || el.textContent;
        }
    });
}
function renderProducts(filter) {
    const grid = qs('#productGrid');
    if (!grid)
        return;
    const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);
    grid.innerHTML = filtered
        .map((product) => `
        <div class="glass-card rounded-2xl overflow-hidden smooth-transition hover-lift">
          <div class="relative overflow-hidden h-64">
            <img src="${product.image}" alt="${product.name[state.currentLang]}" class="w-full h-full object-cover smooth-transition hover:scale-110" loading="lazy">
            <div class="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ${product.brand}
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">${product.name[state.currentLang]}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">${product.description[state.currentLang]}</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-primary-500">$${product.price.toLocaleString()}</span>
              <button class="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg text-white smooth-transition hover:scale-105" data-add-to-cart="${product.id}">
                <i class="fas fa-cart-plus mr-1"></i>
                ${state.currentLang === 'en' ? 'Add' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      `)
        .join('');
    grid.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.addToCart);
            addToCart(id);
        });
    });
}
function calculateQuote() {
    let basePrice = 150000;
    const material = (qs('#material')?.value || 'policarbonato');
    const materialPrices = {
        policarbonato: 50000,
        polimero: 30000,
        silica: 40000,
        tallados: 70000
    };
    basePrice += materialPrices[material] || 0;
    const filter = (qs('#filter')?.value || 'none');
    const filterPrices = {
        solar: 30000,
        'blue-light': 40000,
        transition: 80000,
        'tinted-transition': 100000,
        especiales: 120000
    };
    basePrice += filterPrices[filter] || 0;
    if (qs('#antireflex')?.checked)
        basePrice += 35000;
    if (qs('#blueLight')?.checked)
        basePrice += 40000;
    if (qs('#scratch')?.checked)
        basePrice += 25000;
    const hasRx = ['od_sph', 'od_cyl', 'os_sph', 'os_cyl'].some((id) => {
        const value = qs(`#${id}`)?.value;
        return value !== undefined && value !== '';
    });
    if (hasRx)
        basePrice += 50000;
    const priceElement = qs('#quotedPrice');
    const priceUsdElement = qs('#quotedPriceUSD');
    if (priceElement)
        priceElement.textContent = basePrice.toLocaleString();
    if (priceUsdElement)
        priceUsdElement.textContent = Math.round(basePrice / COP_PER_USD).toString();
}
function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product)
        return;
    state.cart.push({ ...product, quantity: 1 });
    updateCartUI();
    showNotification(state.currentLang === 'en' ? 'Added to cart!' : 'Agregado al carrito!');
}
function addQuoteToCart() {
    const priceText = qs('#quotedPrice')?.textContent || '0';
    const price = parseInt(priceText.replace(/,/g, ''), 10) || 0;
    const material = qs('#material')?.value || 'policarbonato';
    const filter = qs('#filter')?.value || 'none';
    const frameStyle = qs('#frameStyle')?.value || 'wayfarer';
    const customItem = {
        id: `custom-${Date.now()}`,
        name: { en: `Custom Prescription - ${frameStyle}`, es: `Fórmula Personalizada - ${frameStyle}` },
        brand: 'VisionLux Custom',
        category: 'prescription',
        price,
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
        description: { en: `Material: ${material}, Filter: ${filter}`, es: `Material: ${material}, Filtro: ${filter}` },
        quantity: 1
    };
    state.cart.push(customItem);
    updateCartUI();
    showNotification(state.currentLang === 'en' ? 'Custom quote added to cart!' : 'Cotización personalizada agregada!');
}
function removeFromCart(index) {
    state.cart.splice(index, 1);
    updateCartUI();
}
function getCartTotal() {
    return state.cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
}
function updateCartUI() {
    const cartCount = qs('#cartCount');
    const totalElement = qs('#cartTotal');
    const cartItems = qs('#cartItems');
    const total = getCartTotal();
    if (cartCount) {
        if (state.cart.length > 0) {
            cartCount.textContent = state.cart.length.toString();
            cartCount.classList.remove('hidden');
        }
        else {
            cartCount.classList.add('hidden');
        }
    }
    if (totalElement)
        totalElement.textContent = total.toLocaleString();
    if (!cartItems)
        return;
    if (state.cart.length === 0) {
        cartItems.innerHTML = `
      <div class="text-center py-12 text-gray-500">
        <i class="fas fa-shopping-cart text-6xl mb-4 opacity-50"></i>
        <p>${state.currentLang === 'en' ? 'Your cart is empty' : 'Tu carrito está vacío'}</p>
      </div>
    `;
        return;
    }
    cartItems.innerHTML = state.cart
        .map((item, index) => `
        <div class="flex items-center space-x-4 glass-card p-4 rounded-xl">
          <img src="${item.image}" alt="${item.name[state.currentLang]}" class="w-20 h-20 object-cover rounded-lg">
          <div class="flex-1">
            <h4 class="font-semibold">${item.name[state.currentLang]}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">${item.brand}</p>
            <p class="text-primary-500 font-semibold">$${item.price.toLocaleString()}</p>
          </div>
          <button class="text-red-500 hover:text-red-700 smooth-transition" data-remove-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `)
        .join('');
    cartItems.querySelectorAll('[data-remove-index]').forEach((btn) => {
        const idx = Number(btn.dataset.removeIndex);
        btn.addEventListener('click', () => removeFromCart(idx));
    });
}
function openCart() {
    const modal = qs('#cartModal');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
}
function closeCart() {
    const modal = qs('#cartModal');
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
}
function openPaymentModal() {
    if (state.cart.length === 0) {
        showNotification(state.currentLang === 'en' ? 'Your cart is empty!' : 'Tu carrito está vacío!');
        return;
    }
    closeCart();
    const modal = qs('#paymentModal');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
}
function closePayment() {
    const modal = qs('#paymentModal');
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
}
async function selectPayment(method) {
    const messages = {
        payu: { en: 'Redirecting to PayU...', es: 'Redirigiendo a PayU...' },
        pse: { en: 'Redirecting to PSE...', es: 'Redirigiendo a PSE...' },
        metamask: { en: 'Connecting to MetaMask...', es: 'Conectando a MetaMask...' },
        lightning: { en: 'Generating Lightning invoice...', es: 'Generando factura Lightning...' }
    };
    showNotification(messages[method][state.currentLang]);
    try {
        if (method === 'metamask') {
            await handleMetaMaskPayment();
        }
        else if (method === 'lightning') {
            await handleLightningPayment();
        }
        else {
            showNotification(state.currentLang === 'en' ? 'Payment processing...' : 'Procesando pago...');
        }
        closePayment();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to process payment.';
        showNotification(message);
    }
}
async function handleMetaMaskPayment() {
    const provider = window.ethereum;
    if (!provider) {
        throw new Error(state.currentLang === 'en' ? 'MetaMask not detected.' : 'MetaMask no está disponible.');
    }
    const accounts = (await provider.request({ method: 'eth_requestAccounts' }));
    const account = accounts[0];
    if (!account)
        throw new Error('No account found.');
    const chainId = (await provider.request({ method: 'eth_chainId' }));
    const total = getCartTotal();
    const message = `VisionLux purchase of ${formatCop(total)} COP`;
    try {
        await provider.request({ method: 'personal_sign', params: [message, account] });
    }
    catch (err) {
        console.warn('Signature skipped', err);
    }
    showNotification(`MetaMask: ${shorten(account)} on chain ${chainId}`);
}
async function handleLightningPayment() {
    const total = getCartTotal();
    if (total <= 0)
        throw new Error('Cart is empty.');
    const sats = await convertCopToSats(total);
    if (!sats)
        throw new Error(state.currentLang === 'en' ? 'Unable to fetch BTC price.' : 'No se pudo obtener el precio de BTC.');
    const webln = window.webln;
    if (webln) {
        await webln.enable();
        const invoice = await webln.makeInvoice({ amount: sats, defaultMemo: 'VisionLux Order' });
        const paymentRequest = invoice.paymentRequest || invoice.pr;
        if (paymentRequest) {
            await copyToClipboard(paymentRequest);
            showNotification(state.currentLang === 'en' ? 'Invoice copied to clipboard.' : 'Factura copiada al portapapeles.');
            if (webln.sendPayment)
                await webln.sendPayment(paymentRequest);
        }
        else {
            showNotification(state.currentLang === 'en' ? 'Invoice generated in your wallet.' : 'Factura generada en tu wallet.');
        }
    }
    else {
        const lightningUrl = `lightning:${LIGHTNING_ADDRESS}`;
        await copyToClipboard(lightningUrl);
        showNotification(state.currentLang === 'en' ? 'Lightning address copied. Pay from your wallet.' : 'Dirección Lightning copiada. Paga desde tu wallet.');
    }
}
async function convertCopToSats(copAmount) {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=cop');
        if (!response.ok)
            return null;
        const data = (await response.json());
        const btcPriceCop = data.bitcoin?.cop;
        if (!btcPriceCop)
            return null;
        const btcAmount = copAmount / btcPriceCop;
        return Math.max(1, Math.round(btcAmount * 100000000));
    }
    catch (error) {
        console.error('Price fetch failed', error);
        return null;
    }
}
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 glass-card px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-up';
    notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="fas fa-check-circle text-green-500 text-xl"></i>
      <span class="font-semibold">${message}</span>
    </div>
  `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
function scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}
function scrollToCustom() {
    document.getElementById('custom')?.scrollIntoView({ behavior: 'smooth' });
}
function formatCop(amount) {
    return `$${amount.toLocaleString()} COP`;
}
function shorten(address) {
    if (address.length <= 10)
        return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
async function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
    }
    else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
    }
}
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));
Object.assign(window, {
    addToCart,
    addQuoteToCart,
    closeCart,
    closePayment,
    openCart,
    openPaymentModal,
    removeFromCart,
    scrollToCustom,
    scrollToProducts,
    selectPayment
});
export {};
