class EstherApp {
    constructor() {
        this.apiBase = '/api';
        this.currentUser = null;
        this.cart = [];
        this.init();
        // En el constructor de EstherApp, después de init():
        console.log('🎯 Elementos DOM encontrados:');
        console.log('Login button:', document.getElementById('login-btn'));
        console.log('Cart button:', document.getElementById('cart-btn'));
        console.log('Close cart:', document.querySelector('.close-cart'));
        console.log('Close modal:', document.querySelector('.close-modal'));
        console.log('Checkout button:', document.getElementById('checkout-btn'));
        console.log('Login modal:', document.getElementById('login-modal'));
        console.log('Cart sidebar:', document.getElementById('cart-sidebar'));
    }

    async init() {
        console.log('🚀 Iniciando Esther Accessories...');
        await this.checkAuth();
        this.setupEventListeners();
        this.setupNavigation();
        await this.loadInitialData();
    }
    // ========== SECCIONES FALTANTES ==========

async renderColecciones() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <section class="colecciones-section">
            <div class="container">
                <div class="colecciones-header">
                    <h2><i class="fas fa-crown"></i> Nuestras Colecciones Exclusivas</h2>
                    <p>Descubre las líneas más destacadas de Esther Accessories</p>
                </div>
                
                <div class="colecciones-grid">
                    <div class="coleccion-card grande">
                        <div class="coleccion-imagen" style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');">
                            <div class="coleccion-overlay">
                                <h3>Colección Oro</h3>
                                <p>Piezas en oro 18k y 24k con diamantes y piedras preciosas</p>
                                <button onclick="app.filterColeccion('oro')" class="btn-coleccion">
                                    Ver Colección
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="coleccion-card">
                        <div class="coleccion-imagen" style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80');">
                            <div class="coleccion-overlay">
                                <h3>Colección Plata</h3>
                                <p>Plata esterlina 925 con diseños modernos</p>
                                <button onclick="app.filterColeccion('plata')" class="btn-coleccion">
                                    Ver Colección
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="coleccion-card">
                        <div class="coleccion-imagen" style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80');">
                            <div class="coleccion-overlay">
                                <h3>Línea Romántica</h3>
                                <p>Diseños con corazones, flores y motivos amorosos</p>
                                <button onclick="app.filterColeccion('romantica')" class="btn-coleccion">
                                    Ver Colección
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="coleccion-card">
                        <div class="coleccion-imagen" style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60');">
                            <div class="coleccion-overlay">
                                <h3>Colección Minimalista</h3>
                                <p>Diseños simples y elegantes para el día a día</p>
                                <button onclick="app.filterColeccion('minimalista')" class="btn-coleccion">
                                    Ver Colección
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="colecciones-info">
                    <h3>Colecciones por Temporada</h3>
                    <div class="temporadas">
                        <div class="temporada">
                            <h4><i class="fas fa-sun"></i> Primavera-Verano 2024</h4>
                            <p>Colores vibrantes y diseños frescos inspirados en la naturaleza.</p>
                        </div>
                        <div class="temporada">
                            <h4><i class="fas fa-snowflake"></i> Otoño-Invierno 2024</h4>
                            <p>Tonos cálidos y piezas llamativas para las festividades.</p>
                        </div>
                        <div class="temporada">
                            <h4><i class="fas fa-gem"></i> Edición Limitada</h4>
                            <p>Piezas exclusivas disponibles en cantidades limitadas.</p>
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
        <section class="sobre-section">
            <div class="container">
                <div class="sobre-header">
                    <h2><i class="fas fa-store"></i> La Maison Esther</h2>
                    <p>Donde la tradición se encuentra con la innovación</p>
                </div>
                
                <div class="sobre-content">
                    <div class="sobre-historia">
                        <h3>Nuestra Historia</h3>
                        <p>Fundada en 1995 por Esther Rodríguez, nuestra maison nació con la visión de crear joyas que contaran historias. Lo que comenzó como un pequeño taller familiar en el corazón de la Ciudad de México, hoy se ha convertido en un referente de la joyería artesanal de alta gama.</p>
                        
                        <p>Cada pieza de Esther Accessories es el resultado de horas de trabajo dedicado, donde la pasión por el detalle y el respeto por las técnicas tradicionales se combinan con un diseño contemporáneo y visionario.</p>
                        
                        <div class="sobre-logros">
                            <div class="logro">
                                <i class="fas fa-award"></i>
                                <div>
                                    <h4>+25 Años</h4>
                                    <p>De excelencia en joyería</p>
                                </div>
                            </div>
                            <div class="logro">
                                <i class="fas fa-hands"></i>
                                <div>
                                    <h4>Artesanos Expertos</h4>
                                    <p>Equipo de maestros joyeros</p>
                                </div>
                            </div>
                            <div class="logro">
                                <i class="fas fa-gem"></i>
                                <div>
                                    <h4>Materiales Éticos</h4>
                                    <p>Procedencia certificada</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sobre-valores">
                        <h3>Nuestros Valores</h3>
                        <div class="valores-grid">
                            <div class="valor-card">
                                <i class="fas fa-handshake"></i>
                                <h4>Calidad Inigualable</h4>
                                <p>Utilizamos sólo los mejores materiales: oro de 18k y 24k, plata esterlina 925, diamantes certificados y piedras preciosas de origen ético.</p>
                            </div>
                            <div class="valor-card">
                                <i class="fas fa-heart"></i>
                                <h4>Artesanía Detallada</h4>
                                <p>Cada pieza es elaborada a mano por nuestros maestros joyeros, con atención meticulosa a cada detalle.</p>
                            </div>
                            <div class="valor-card">
                                <i class="fas fa-leaf"></i>
                                <h4>Sostenibilidad</h4>
                                <p>Nos comprometemos con prácticas sostenibles y materiales provenientes de fuentes responsables.</p>
                            </div>
                            <div class="valor-card">
                                <i class="fas fa-star"></i>
                                <h4>Personalización</h4>
                                <p>Creamos piezas únicas que reflejan la personalidad y estilo de cada cliente.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sobre-equipo">
                        <h3>Conoce a Nuestro Equipo</h3>
                        <div class="equipo-grid">
                            <div class="miembro-equipo">
                                <div class="miembro-foto" style="background: linear-gradient(45deg, #D4AF37, #B8860B);">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <h4>Esther Rodríguez</h4>
                                <p>Fundadora y Directora Creativa</p>
                                <p class="miembro-desc">Con más de 30 años de experiencia en diseño de joyas.</p>
                            </div>
                            <div class="miembro-equipo">
                                <div class="miembro-foto" style="background: linear-gradient(45deg, #C0C0C0, #E8E8E8);">
                                    <i class="fas fa-gem"></i>
                                </div>
                                <h4>Carlos Mendoza</h4>
                                <p>Maestro Joyero</p>
                                <p class="miembro-desc">Especialista en técnicas tradicionales de orfebrería.</p>
                            </div>
                            <div class="miembro-equipo">
                                <div class="miembro-foto" style="background: linear-gradient(45deg, #800020, #A52A2A);">
                                    <i class="fas fa-paint-brush"></i>
                                </div>
                                <h4>Ana López</h4>
                                <p>Diseñadora</p>
                                <p class="miembro-desc">Crea diseños innovadores que fusionan tradición y modernidad.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

async renderContacto() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <section class="contacto-section">
            <div class="container">
                <div class="contacto-header">
                    <h2><i class="fas fa-phone"></i> Contacto</h2>
                    <p>Estamos aquí para ayudarte en cada paso</p>
                </div>
                
                <div class="contacto-grid">
                    <div class="contacto-info">
                        <div class="info-card">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <h4>Visítanos</h4>
                                <p>Av. Paseo de la Reforma 123</p>
                                <p>Col. Juárez, Cuauhtémoc</p>
                                <p>Ciudad de México, 06600</p>
                            </div>
                        </div>
                        
                        <div class="info-card">
                            <i class="fas fa-clock"></i>
                            <div>
                                <h4>Horarios</h4>
                                <p><strong>Lunes a Viernes:</strong> 10:00 - 19:00</p>
                                <p><strong>Sábados:</strong> 10:00 - 15:00</p>
                                <p><strong>Domingos:</strong> Cerrado</p>
                            </div>
                        </div>
                        
                        <div class="info-card">
                            <i class="fas fa-phone"></i>
                            <div>
                                <h4>Teléfonos</h4>
                                <p><strong>Ventas:</strong> +52 55 1234 5678</p>
                                <p><strong>WhatsApp:</strong> +52 55 8765 4321</p>
                                <p><strong>Servicio al cliente:</strong> 800 123 4567</p>
                            </div>
                        </div>
                        
                        <div class="info-card">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <h4>Correos Electrónicos</h4>
                                <p><strong>Ventas:</strong> ventas@estheraccessories.com</p>
                                <p><strong>Servicio al cliente:</strong> servicio@estheraccessories.com</p>
                                <p><strong>Cotizaciones:</strong> cotizaciones@estheraccessories.com</p>
                            </div>
                        </div>
                        
                        <div class="redes-sociales">
                            <h4>Síguenos</h4>
                            <div class="redes-icons">
                                <a href="https://www.instagram.com/esther_accessories_25" target="_blank" class="red-social">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="#" class="red-social">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" class="red-social">
                                    <i class="fab fa-pinterest-p"></i>
                                </a>
                                <a href="#" class="red-social">
                                    <i class="fab fa-tiktok"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="contacto-formulario">
                        <div class="form-card">
                            <h3>Envíanos un Mensaje</h3>
                            <p>¿Tienes preguntas? Escríbenos y te responderemos en menos de 24 horas.</p>
                            
                            <form id="contact-form">
                                <div class="form-group">
                                    <label for="contact-name">Nombre completo *</label>
                                    <input type="text" id="contact-name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="contact-email">Correo electrónico *</label>
                                    <input type="email" id="contact-email" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="contact-phone">Teléfono</label>
                                    <input type="tel" id="contact-phone">
                                </div>
                                
                                <div class="form-group">
                                    <label for="contact-subject">Asunto *</label>
                                    <select id="contact-subject" required>
                                        <option value="">Selecciona una opción</option>
                                        <option value="consulta">Consulta general</option>
                                        <option value="cotizacion">Cotización</option>
                                        <option value="personalizacion">Personalización</option>
                                        <option value="garantia">Garantía o reparación</option>
                                        <option value="pedido">Estado de pedido</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="contact-message">Mensaje *</label>
                                    <textarea id="contact-message" rows="5" required></textarea>
                                </div>
                                
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-paper-plane"></i> Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="mapa-section">
                    <h3>Ubicación</h3>
                    <div class="mapa-placeholder">
                        <div class="mapa-info">
                            <i class="fas fa-map-marked-alt"></i>
                            <div>
                                <h4>Esther Accessories Boutique</h4>
                                <p>Av. Paseo de la Reforma 123, Ciudad de México</p>
                                <p><strong>Metro más cercano:</strong> Estación Insurgentes (Línea 1)</p>
                                <p><strong>Estacionamiento:</strong> Disponible en el edificio</p>
                            </div>
                        </div>
                        <div class="mapa-imagen">
                            <img src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                 alt="Mapa de ubicación">
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Configurar el formulario de contacto
    setTimeout(() => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showNotification('Mensaje enviado. Te contactaremos pronto.', 'success');
                contactForm.reset();
            });
        }
    }, 100);
}

// Método para filtrar por colección (se llama desde los botones de colecciones)
filterColeccion(tipo) {
    // Redirigir al catálogo con filtro
    this.loadSection('catalogo');
    
    // Después de cargar el catálogo, aplicar filtro
    setTimeout(() => {
        const categoryFilter = document.getElementById('category-filter');
        const searchInput = document.getElementById('search-products');
        
        if (categoryFilter && searchInput) {
            switch(tipo) {
                case 'oro':
                    categoryFilter.value = 'collares';
                    searchInput.value = 'oro';
                    break;
                case 'plata':
                    categoryFilter.value = 'pulseras';
                    searchInput.value = 'plata';
                    break;
                case 'romantica':
                    searchInput.value = 'corazón flor';
                    break;
                case 'minimalista':
                    searchInput.value = 'simple elegante';
                    break;
            }
            
            // Disparar el evento de búsqueda
            this.searchProducts();
        }
    }, 500);
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
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.warn('Token inválido:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const userAvatar = document.getElementById('user-avatar');
        const userMenu = document.getElementById('user-menu');
        const userMenuName = document.getElementById('user-menu-name');
        const userMenuEmail = document.getElementById('user-menu-email');
        const logoutBtn = document.getElementById('logout-btn');

        if (this.currentUser) {
            // Ocultar botón login, mostrar avatar
            loginBtn.style.display = 'none';
            userAvatar.style.display = 'flex';

            // Obtener iniciales
            const initials = this.getInitials(this.currentUser.nombre);
            userAvatar.textContent = initials;
            userAvatar.title = this.currentUser.nombre;

            // Llenar menú
            if (userMenuName) userMenuName.textContent = this.currentUser.nombre;
            if (userMenuEmail) userMenuEmail.textContent = this.currentUser.email;

            // Eventos del avatar
            if (userAvatar) {
                userAvatar.onclick = (e) => {
                    e.stopPropagation();
                    userMenu.classList.toggle('show');
                };
            }

            // Evento logout
            if (logoutBtn) {
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                    userMenu.classList.remove('show');
                };
            }

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (userMenu && !userAvatar.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.remove('show');
                }
            });

        } else {
            // Mostrar botón login, ocultar avatar
            loginBtn.style.display = 'flex';
            if (userAvatar) userAvatar.style.display = 'none';
            loginBtn.onclick = () => this.showLoginModal();
        }
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
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
        this.loadSection('inicio');
    }

    // ========== NAVEGACIÓN ==========
    setupNavigation() {
        // Navegación principal
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);

                // Actualizar clase activa
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Cargar sección
                this.loadSection(target);

                // Cerrar menú móvil
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });

        // Logo también lleva al inicio
        document.querySelector('.logo-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.loadSection('inicio');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('.nav-link[href="#inicio"]').classList.add('active');
        });

        // Menú móvil
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) {
                    navMenu.classList.toggle('active');
                }
            });
        }
    }

    async loadSection(section) {
        const content = document.getElementById('content');

        // Mostrar loader
        content.innerHTML = '<div class="loader"><div class="spinner"></div></div>';

        try {
            switch (section) {
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
                case 'checkout':
                    await this.renderCheckout();
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
                
                <div class="instagram-section" style="margin-top: 4rem;">
                    <div class="container">
                        <div class="instagram-header">
                            <h2><i class="fab fa-instagram"></i> Síguenos en Instagram</h2>
                            <p>@esther_accessories_25</p>
                            <a href="https://www.instagram.com/esther_accessories_25" 
                               target="_blank" 
                               class="btn-instagram">
                                <i class="fab fa-instagram"></i> Ver Galería
                            </a>
                        </div>
                    </div>
                </div>
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

        // Configurar eventos después de renderizar
        setTimeout(() => {
            const searchBtn = document.getElementById('search-btn');
            const searchInput = document.getElementById('search-products');
            const categoryFilter = document.getElementById('category-filter');

            if (searchBtn) {
                searchBtn.addEventListener('click', () => this.searchProducts());
            }

            if (searchInput) {
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.searchProducts();
                });
            }

            if (categoryFilter) {
                categoryFilter.addEventListener('change', () => this.loadProducts());
            }
        }, 100);
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

    // ========== CHECKOUT Y PAGO ==========
    async renderCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Tu carrito está vacío', 'warning');
            this.loadSection('catalogo');
            return;
        }

        const content = document.getElementById('content');
        const total = this.cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const tax = total * 0.16;
        const grandTotal = total + tax;

        content.innerHTML = `
            <section class="checkout-section">
                <div class="container">
                    <div class="checkout-header">
                        <h2><i class="fas fa-lock"></i> Finalizar Compra</h2>
                        <p>Completa tu información para procesar el pedido</p>
                    </div>
                    
                    <div class="checkout-grid">
                        <div class="checkout-form-container">
                            <div class="checkout-step active">
                                <div class="step-header">
                                    <span class="step-number">1</span>
                                    <h3>Información de envío</h3>
                                </div>
                                <div class="step-content">
                                    <form id="shipping-form">
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label for="shipping-name">Nombre completo *</label>
                                                <input type="text" id="shipping-name" 
                                                       value="${this.currentUser ? this.currentUser.nombre : ''}"
                                                       required>
                                            </div>
                                            <div class="form-group">
                                                <label for="shipping-phone">Teléfono *</label>
                                                <input type="tel" id="shipping-phone" required>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="shipping-address">Dirección *</label>
                                            <input type="text" id="shipping-address" 
                                                   placeholder="Calle, número, colonia" required>
                                        </div>
                                        
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label for="shipping-city">Ciudad *</label>
                                                <input type="text" id="shipping-city" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="shipping-state">Estado *</label>
                                                <input type="text" id="shipping-state" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="shipping-zip">Código Postal *</label>
                                                <input type="text" id="shipping-zip" required>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-summary">
                            <div class="summary-header">
                                <h3>Resumen del pedido</h3>
                            </div>
                            
                            <div class="order-items">
                                ${this.cart.map(item => `
                                    <div class="order-item">
                                        <img src="${item.imagen_url}" 
                                             alt="${item.nombre}"
                                             onerror="this.onerror=null; this.src='https://via.placeholder.com/60x60/1a1a1a/ffffff?text=E'">
                                        <div class="item-details">
                                            <h4>${item.nombre}</h4>
                                            <span class="item-meta">${item.material_elegido || 'Estándar'}</span>
                                        </div>
                                        <div class="item-quantity">${item.cantidad} x</div>
                                        <div class="item-price">$${(item.precio * item.cantidad).toFixed(2)}</div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="summary-totals">
                                <div class="total-row">
                                    <span>Subtotal</span>
                                    <span>$${total.toFixed(2)}</span>
                                </div>
                                <div class="total-row">
                                    <span>Envío</span>
                                    <span>Gratis</span>
                                </div>
                                <div class="total-row">
                                    <span>Impuestos (16%)</span>
                                    <span>$${tax.toFixed(2)}</span>
                                </div>
                                <div class="total-row grand-total">
                                    <span>Total</span>
                                    <span>$${grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div class="summary-actions">
                                <button id="confirm-payment" class="btn-checkout-full">
                                    <i class="fas fa-lock"></i> Confirmar y pagar $${grandTotal.toFixed(2)}
                                </button>
                                <p class="secure-payment">
                                    <i class="fas fa-shield-alt"></i> Pago 100% seguro
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Configurar evento después de renderizar
        setTimeout(() => {
            const confirmBtn = document.getElementById('confirm-payment');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => this.processPayment());
            }
        }, 100);
    }

    async processPayment() {
        // Validar formulario
        const required = ['shipping-name', 'shipping-phone', 'shipping-address', 'shipping-city', 'shipping-state', 'shipping-zip'];
        let isValid = true;

        required.forEach(id => {
            const input = document.getElementById(id);
            if (!input || !input.value.trim()) {
                if (input) input.style.borderColor = '#ff4444';
                isValid = false;
            } else if (input) {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            this.showNotification('Por favor completa todos los campos obligatorios (*)', 'error');
            return;
        }

        this.showNotification('Procesando pago...', 'info');

        // Simular procesamiento
        setTimeout(async () => {
            try {
                if (this.currentUser) {
                    const response = await fetch(`${this.apiBase}/pedidos`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        this.showNotification(`¡Pago exitoso! Pedido #${data.pedidoId} confirmado`, 'success');
                        this.cart = [];
                        localStorage.removeItem('guest_cart');
                        this.updateCartUI();

                        // Mostrar confirmación
                        this.showOrderConfirmation(data.pedidoId);
                    } else {
                        throw new Error(data.error);
                    }
                } else {
                    // Para invitados
                    const orderId = 'GUEST-' + Date.now();
                    this.showNotification('¡Pago exitoso! Tu pedido ha sido procesado', 'success');
                    this.cart = [];
                    localStorage.removeItem('guest_cart');
                    this.updateCartUI();
                    this.showOrderConfirmation(orderId);
                }
            } catch (error) {
                this.showNotification(error.message || 'Error al procesar el pago', 'error');
            }
        }, 2000);
    }

    showOrderConfirmation(orderId) {
        const content = document.getElementById('content');
        content.innerHTML = `
            <section class="confirmation-section">
                <div class="container">
                    <div class="confirmation-card">
                        <div class="confirmation-header">
                            <i class="fas fa-check-circle"></i>
                            <h2>¡Gracias por tu compra!</h2>
                            <p>Tu pedido ha sido confirmado</p>
                        </div>
                        
                        <div class="confirmation-body">
                            <div class="order-info">
                                <div class="info-item">
                                    <span>Número de pedido:</span>
                                    <strong>${orderId}</strong>
                                </div>
                                <div class="info-item">
                                    <span>Fecha:</span>
                                    <strong>${new Date().toLocaleDateString()}</strong>
                                </div>
                            </div>
                            
                            <div class="confirmation-message">
                                <p>Nuestro equipo se pondrá en contacto contigo para coordinar la entrega.</p>
                            </div>
                            
                            <div class="confirmation-actions">
                                <button onclick="app.loadSection('catalogo')" class="btn-primary">
                                    <i class="fas fa-shopping-bag"></i> Seguir comprando
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // ========== UI HELPERS ==========
    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
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
        console.log('🔧 Configurando event listeners...');

        // ========== LOGIN/REGISTER ==========
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

        // ========== MODAL TABS ==========
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

        // ========== CARRITO ==========
        const cartBtn = document.getElementById('cart-btn');
        const closeCartBtn = document.querySelector('.close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                console.log('🛒 Abriendo carrito...');
                this.openCart();
            });
        }

        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => {
                console.log('❌ Cerrando carrito...');
                this.closeCart();
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                console.log('💰 Procesando checkout...');
                if (this.cart.length === 0) {
                    this.showNotification('Tu carrito está vacío', 'warning');
                    return;
                }
                this.loadSection('checkout');
                this.closeCart();
            });
        }

        // ========== CERRAR MODAL ==========
        const closeModalBtn = document.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                console.log('❌ Cerrando modal...');
                this.closeModal();
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target.id === 'login-modal') {
                this.closeModal();
            }
        });

        // ========== MENÚ MÓVIL ==========
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) {
                    navMenu.classList.toggle('active');
                }
            });
        }

        console.log('✅ Event listeners configurados');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EstherApp();
});