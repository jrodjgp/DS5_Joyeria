class EstherApp {
    constructor() {
        this.apiBase = '/api';
        this.currentUser = null;
        this.cart = [];
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Esther Accessories...');
        this.setupEventListeners();
        await this.checkAuth();
        await this.loadInitialData();
        this.setupNavigation();
    }

    // ========== AUTENTICACIÓN ==========
    async checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${this.apiBase}/verify`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                    this.updateAuthUI();
                    await this.loadCart();
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.warn('Token inválido:', error);
                localStorage.removeItem('token');
            }
        }
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            if (this.currentUser) {
                loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.nombre.split(' ')[0]}`;
                loginBtn.onclick = () => this.showUserMenu();
            } else {
                loginBtn.innerHTML = '<i class="fas fa-user"></i>';
                loginBtn.onclick = () => this.showLoginModal();
            }
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.currentUser = data.user;
                this.updateAuthUI();
                this.closeModal();
                await this.loadCart();
                this.showNotification('¡Bienvenido a Esther Accessories!', 'success');
                return true;
            } else {
                throw new Error(data.error || 'Error en el login');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }

    async register(nombre, email, password, confirmPassword) {
        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
            return false;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                return await this.login(email, password);
            } else {
                throw new Error(data.error || 'Error en el registro');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser = null;
        this.cart = [];
        this.updateAuthUI();
        this.updateCartUI();
        this.showNotification('Sesión cerrada', 'info');
    }

    // ========== NAVEGACIÓN ==========
    setupNavigation() {
        // Navegación principal
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.loadSection(target);
                
                // Actualizar clase activa
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Cerrar menú móvil
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
        
        // Menú móvil
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) {
                    navMenu.classList.toggle('active');
                }
            });
        }
    }

    async loadSection(section) {
        const content = document.getElementById('content');
        content.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
        
        try {
            switch(section) {
                case 'inicio':
                    await this.renderHome();
                    break;
                case 'catalogo':
                    await this.renderCatalogo();
                    break;
                case 'colecciones':
                    await this.renderColecciones();
                    break;
                case 'sobre':
                    await this.renderSobre();
                    break;
                case 'contacto':
                    await this.renderContacto();
                    break;
                default:
                    await this.renderHome();
            }
        } catch (error) {
            console.error('Error cargando sección:', error);
            content.innerHTML = '<div class="error">Error cargando la sección</div>';
        }
    }

    async renderHome() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <section class="container">
                <div class="catalogo-header">
                    <h2>Joyas Destacadas</h2>
                    <p>Descubre nuestras piezas más exclusivas</p>
                </div>
                <div class="catalogo-grid" id="featured-grid"></div>
            </section>
        `;
        await this.loadFeaturedProducts();
    }

    async renderCatalogo() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <section class="catalogo-section">
                <div class="catalogo-header">
                    <h2>Catálogo Completo</h2>
                    <div class="catalogo-controls">
                        <div class="search-box">
                            <input type="text" id="search-products" placeholder="Buscar joyas...">
                            <button id="search-btn"><i class="fas fa-search"></i></button>
                        </div>
                        <select id="category-filter">
                            <option value="all">Todas las categorías</option>
                            <option value="collares">Collares</option>
                            <option value="pulseras">Pulseras</option>
                            <option value="anillos">Anillos</option>
                            <option value="aretes">Aretes</option>
                            <option value="conjuntos">Conjuntos</option>
                        </select>
                    </div>
                </div>
                <div class="catalogo-grid" id="catalogo-grid"></div>
            </section>
        `;
        
        await this.loadProducts();
        
        // Event listeners para filtros
        document.getElementById('search-btn').addEventListener('click', () => this.searchProducts());
        document.getElementById('search-products').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchProducts();
        });
        document.getElementById('category-filter').addEventListener('change', () => this.loadProducts());
    }

    // ========== PRODUCTOS ==========
    async loadInitialData() {
        await this.loadFeaturedProducts();
    }

    async loadFeaturedProducts() {
        try {
            const response = await fetch(`${this.apiBase}/productos?destacado=true`);
            const data = await response.json();
            
            if (data.success) {
                this.renderProducts(data.productos, 'featured-grid');
            }
        } catch (error) {
            console.error('Error cargando productos destacados:', error);
        }
    }

    async loadProducts() {
        const category = document.getElementById('category-filter')?.value || 'all';
        
        try {
            const response = await fetch(`${this.apiBase}/productos?categoria=${category}`);
            const data = await response.json();
            
            if (data.success) {
                this.renderProducts(data.productos, 'catalogo-grid');
            }
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    }

    async searchProducts() {
        const query = document.getElementById('search-products')?.value;
        if (!query) return;
        
        try {
            const response = await fetch(`${this.apiBase}/buscar?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                this.renderProducts(data.productos, 'catalogo-grid');
            }
        } catch (error) {
            console.error('Error buscando productos:', error);
        }
    }

    renderProducts(productos, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (!productos || productos.length === 0) {
            container.innerHTML = '<div class="empty-state">No se encontraron productos</div>';
            return;
        }
        
        container.innerHTML = productos.map(producto => `
            <div class="producto-card" data-id="${producto.id}">
                ${producto.destacado ? '<div class="producto-badge destacado"><i class="fas fa-crown"></i> Destacado</div>' : ''}
                <div class="producto-img-container">
                    <img src="${producto.imagen_url}" 
                         alt="${producto.nombre}" 
                         class="producto-img"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Esther+Accessories'">
                </div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <div class="producto-meta">
                        <span class="producto-categoria">${this.formatCategoria(producto.categoria)}</span>
                        <span class="producto-materiales">${producto.materiales}</span>
                    </div>
                    <p class="producto-desc">${producto.descripcion ? producto.descripcion.substring(0, 100) + '...' : 'Sin descripción'}</p>
                    <div class="producto-footer">
                        <span class="producto-precio">$${parseFloat(producto.precio).toFixed(2)}</span>
                        <div class="producto-actions">
                            <button class="btn-view" onclick="app.viewProduct(${producto.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-add-cart" onclick="app.addToCart(${producto.id})">
                                <i class="fas fa-shopping-bag"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatCategoria(cat) {
        const categorias = {
            'collares': 'Collar',
            'pulseras': 'Pulsera',
            'anillos': 'Anillo',
            'aretes': 'Aretes',
            'conjuntos': 'Conjunto'
        };
        return categorias[cat] || cat;
    }

    async viewProduct(id) {
        try {
            const response = await fetch(`${this.apiBase}/productos/${id}`);
            const data = await response.json();
            
            if (data.success) {
                const producto = data.producto;
                alert(`${producto.nombre}\n\n${producto.descripcion}\n\nMateriales: ${producto.materiales}\nPrecio: $${producto.precio}`);
            }
        } catch (error) {
            this.showNotification('Error al cargar producto', 'error');
        }
    }

    // ========== CARRITO ==========
    async loadCart() {
        if (!this.currentUser) {
            // Carrito local para invitados
            this.cart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
            this.updateCartUI();
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/carrito`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.cart = data.items;
                this.updateCartUI();
            }
        } catch (error) {
            console.error('Error cargando carrito:', error);
        }
    }

    async addToCart(productId) {
        // Si no hay usuario, usar carrito local
        if (!this.currentUser) {
            try {
                const response = await fetch(`${this.apiBase}/productos/${productId}`);
                const data = await response.json();
                
                if (data.success) {
                    const producto = data.producto;
                    
                    // Verificar si ya está en el carrito
                    const existingIndex = this.cart.findIndex(item => item.producto_id == productId);
                    
                    if (existingIndex > -1) {
                        this.cart[existingIndex].cantidad += 1;
                    } else {
                        this.cart.push({
                            id: Date.now(),
                            producto_id: productId,
                            nombre: producto.nombre,
                            precio: producto.precio,
                            imagen_url: producto.imagen_url,
                            cantidad: 1,
                            material_elegido: 'Estándar',
                            tamaño: 'Único'
                        });
                    }
                    
                    localStorage.setItem('guest_cart', JSON.stringify(this.cart));
                    this.updateCartUI();
                    this.showNotification('Producto agregado al carrito', 'success');
                    this.openCart();
                }
            } catch (error) {
                this.showNotification('Error al agregar producto', 'error');
            }
            return;
        }

        // Usuario autenticado
        try {
            const response = await fetch(`${this.apiBase}/carrito`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    producto_id: productId,
                    cantidad: 1
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.loadCart();
                this.showNotification('Producto agregado al carrito', 'success');
                this.openCart();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    updateCartUI() {
        const count = this.cart.reduce((sum, item) => sum + item.cantidad, 0);
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
        
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartItems && cartTotal) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Tu carrito está vacío</p>
                    </div>
                `;
                cartTotal.textContent = '$0.00';
                return;
            }
            
            let total = 0;
            cartItems.innerHTML = this.cart.map(item => {
                const itemTotal = item.precio * item.cantidad;
                total += itemTotal;
                
                return `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.imagen_url}" 
                             alt="${item.nombre}" 
                             class="cart-item-img"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100/1a1a1a/ffffff?text=Esther'">
                        <div class="cart-item-info">
                            <div class="cart-item-header">
                                <h4>${item.nombre}</h4>
                                <button class="cart-item-remove" onclick="app.removeFromCart(${item.id})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="cart-item-details">
                                <span>${item.material_elegido || 'Estándar'}</span>
                                <span>${item.tamaño || 'Único'}</span>
                            </div>
                            <div class="cart-item-controls">
                                <button class="qty-btn" onclick="app.updateCartQuantity(${item.id}, ${item.cantidad - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="qty-display">${item.cantidad}</span>
                                <button class="qty-btn" onclick="app.updateCartQuantity(${item.id}, ${item.cantidad + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    async removeFromCart(itemId) {
        if (!this.currentUser) {
            this.cart = this.cart.filter(item => item.id !== itemId);
            localStorage.setItem('guest_cart', JSON.stringify(this.cart));
            this.updateCartUI();
            this.showNotification('Producto eliminado', 'info');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/carrito/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.loadCart();
                this.showNotification('Producto eliminado del carrito', 'info');
            }
        } catch (error) {
            this.showNotification('Error al eliminar del carrito', 'error');
        }
    }

    async updateCartQuantity(itemId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(itemId);
            return;
        }

        if (!this.currentUser) {
            const item = this.cart.find(item => item.id === itemId);
            if (item) {
                item.cantidad = newQuantity;
                localStorage.setItem('guest_cart', JSON.stringify(this.cart));
                this.updateCartUI();
            }
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/carrito/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ cantidad: newQuantity })
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.loadCart();
            }
        } catch (error) {
            console.error('Error actualizando cantidad:', error);
        }
    }

    async checkout() {
        if (!this.currentUser) {
            this.showNotification('Por favor inicia sesión para continuar', 'warning');
            this.showLoginModal();
            return;
        }

        if (this.cart.length === 0) {
            this.showNotification('Tu carrito está vacío', 'warning');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/pedidos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification(`¡Pedido #${data.pedidoId} creado exitosamente!`, 'success');
                this.cart = [];
                this.updateCartUI();
                this.closeCart();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            this.showNotification(error.message || 'Error al procesar el pedido', 'error');
        }
    }

    // ========== UI HELPERS ==========
    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.querySelector('.tab-btn[data-tab="login"]').click();
        }
    }

    closeModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'none';
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            if (loginForm) loginForm.reset();
            if (registerForm) registerForm.reset();
        }
    }

    openCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('open');
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
        }
    }

    showUserMenu() {
        // Implementar menú de usuario si es necesario
        this.showNotification(`Hola ${this.currentUser.nombre}`, 'info');
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }

    setupEventListeners() {
        // Login/Register forms
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
                await this.login(email, password);
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const nombre = registerForm.querySelector('input[type="text"]').value;
                const email = registerForm.querySelector('input[type="email"]').value;
                const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
                const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;
                await this.register(nombre, email, password, confirmPassword);
            });
        }
        
        // Modal tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                btn.classList.add('active');
                const form = document.getElementById(`${tab}-form`);
                if (form) form.classList.add('active');
            });
        });
        
        // Carrito
        const cartBtn = document.getElementById('cart-btn');
        const closeCartBtn = document.querySelector('.close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.openCart());
        }
        
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.closeCart());
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
        
        // Cerrar modal
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        
        window.addEventListener('click', (e) => {
            if (e.target.id === 'login-modal') {
                this.closeModal();
            }
        });
    }

    // ========== RENDERIZADORES ADICIONALES ==========
    async renderColecciones() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <section class="container">
                <div class="catalogo-header">
                    <h2>Nuestras Colecciones</h2>
                    <p>Descubre nuestras líneas exclusivas</p>
                </div>
                <div class="catalogo-grid">
                    <div class="producto-card">
                        <div class="producto-img-container" style="background: linear-gradient(45deg, #D4AF37, #FFD700);">
                            <i class="fas fa-crown" style="font-size: 4rem; color: white; margin: auto;"></i>
                        </div>
                        <div class="producto-info">
                            <h3 class="producto-nombre">Colección Oro</h3>
                            <p class="producto-desc">Piezas en oro 18k y 24k con diamantes y piedras preciosas.</p>
                            <div class="producto-footer">
                                <span class="producto-precio">Desde $2,500</span>
                                <button class="btn-add-cart" onclick="app.loadSection('catalogo')">
                                    <i class="fas fa-eye"></i> Ver
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="producto-card">
                        <div class="producto-img-container" style="background: linear-gradient(45deg, #C0C0C0, #E8E8E8);">
                            <i class="fas fa-snowflake" style="font-size: 4rem; color: #333; margin: auto;"></i>
                        </div>
                        <div class="producto-info">
                            <h3 class="producto-nombre">Colección Plata</h3>
                            <p class="producto-desc">Plata esterlina 925 con diseños modernos y clásicos.</p>
                            <div class="producto-footer">
                                <span class="producto-precio">Desde $1,200</span>
                                <button class="btn-add-cart" onclick="app.loadSection('catalogo')">
                                    <i class="fas fa-eye"></i> Ver
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="producto-card">
                        <div class="producto-img-container" style="background: linear-gradient(45deg, #800020, #A52A2A);">
                            <i class="fas fa-heart" style="font-size: 4rem; color: white; margin: auto;"></i>
                        </div>
                        <div class="producto-info">
                            <h3 class="producto-nombre">Línea Romántica</h3>
                            <p class="producto-desc">Diseños con corazones, flores y motivos amorosos.</p>
                            <div class="producto-footer">
                                <span class="producto-precio">Desde $1,800</span>
                                <button class="btn-add-cart" onclick="app.loadSection('catalogo')">
                                    <i class="fas fa-eye"></i> Ver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async renderSobre() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <section class="container" style="padding: 5rem 0;">
                <div class="catalogo-header">
                    <h2>La Maison Esther</h2>
                </div>
                
                <div style="max-width: 800px; margin: 0 auto;">
                    <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
                        Desde 1995, Esther Accessories ha sido sinónimo de excelencia en el arte de la joyería. 
                        Cada pieza es creada con pasión y dedicación por nuestros maestros artesanos, quienes 
                        combinan técnicas tradicionales con un diseño contemporáneo.
                    </p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 3rem 0;">
                        <div>
                            <h3 style="color: var(--oro); margin-bottom: 1rem;">Nuestra Filosofía</h3>
                            <p>Creemos que cada joya debe contar una historia y reflejar la personalidad de quien la lleva.</p>
                        </div>
                        <div>
                            <h3 style="color: var(--oro); margin-bottom: 1rem;">Compromiso con la Calidad</h3>
                            <p>Utilizamos sólo los mejores materiales: oro, plata, diamantes y piedras preciosas de origen ético.</p>
                        </div>
                    </div>
                    
                    <div style="background: rgba(212, 175, 55, 0.1); padding: 2rem; border-radius: 10px; margin-top: 3rem;">
                        <h3 style="color: var(--oro); margin-bottom: 1rem;">Visítanos</h3>
                        <p>📍 Panamá<br>
                           📞 +507 6868-9946<br>
                           ✉️ contacto@estheraccessories.com<br>
                           🕒 Lunes a Viernes: 10:00 - 19:00</p>
                    </div>
                </div>
            </section>
        `;
    }

    async renderContacto() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <section class="container" style="padding: 5rem 0;">
                <div class="catalogo-header">
                    <h2>Contacto</h2>
                    <p>Estamos aquí para ayudarte</p>
                </div>
                
                <div style="max-width: 600px; margin: 0 auto;">
                    <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">
                        <form id="contact-form">
                            <div style="margin-bottom: 1.5rem;">
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--negro); font-weight: 500;">Nombre</label>
                                <input type="text" style="width: 100%; padding: 0.8rem; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 5px;" required>
                            </div>
                            
                            <div style="margin-bottom: 1.5rem;">
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--negro); font-weight: 500;">Email</label>
                                <input type="email" style="width: 100%; padding: 0.8rem; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 5px;" required>
                            </div>
                            
                            <div style="margin-bottom: 1.5rem;">
                                <label style="display: block; margin-bottom: 0.5rem; color: var(--negro); font-weight: 500;">Mensaje</label>
                                <textarea style="width: 100%; padding: 0.8rem; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 5px; min-height: 150px;" required></textarea>
                            </div>
                            
                            <button type="submit" class="btn-primary" style="width: 100%;">
                                <i class="fas fa-paper-plane"></i> Enviar Mensaje
                            </button>
                        </form>
                    </div>
                    
                    <div style="margin-top: 3rem; text-align: center;">
                        <p>O contáctanos directamente:</p>
                        <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1rem;">
                            <a href="tel:+525512345678" style="color: var(--oro); text-decoration: none;">
                                <i class="fas fa-phone"></i> Llamar
                            </a>
                            <a href="mailto:contacto@estheraccessories.com" style="color: var(--oro); text-decoration: none;">
                                <i class="fas fa-envelope"></i> Email
                            </a>
                            <a href="https://wa.me/50768689946" style="color: var(--oro); text-decoration: none;">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Formulario de contacto
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showNotification('Mensaje enviado. Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
            });
        }
    }
}

// Inicializar la aplicación
const app = new EstherApp();
window.app = app;

// Hacer que la navegación funcione inmediatamente
document.addEventListener('DOMContentLoaded', () => {
    // Cargar la sección de inicio por defecto
    app.loadSection('inicio');
    
    // Marcar el enlace de inicio como activo
    const inicioLink = document.querySelector('.nav-link[href="#inicio"]');
    if (inicioLink) {
        inicioLink.classList.add('active');
    }
});