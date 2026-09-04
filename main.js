/* =========================================================
   THREADS CLOTHING CO.
   HOME PAGE JAVASCRIPT
   Frontend/js/main.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       API CONFIGURATION
    ========================================================= */

    const API_BASE_URL =
        window.THREADS_API_URL || "http://localhost:5000/api";

    const CART_STORAGE_KEY = "threads_cart";
    const WISHLIST_STORAGE_KEY = "threads_wishlist";


    /* =========================================================
       DOM HELPERS
    ========================================================= */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    function initializeMobileNavigation() {
        const menuButton = $("#menuButton");
        const mobileNavigation = $("#mobileNavigation");

        if (!menuButton || !mobileNavigation) return;

        menuButton.setAttribute("aria-expanded", "false");

        function closeMenu() {
            mobileNavigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        }

        function toggleMenu() {
            const isOpen =
                mobileNavigation.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }

        menuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleMenu();
        });

        $$(".mobile-navigation a").forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("click", (event) => {
            if (
                !mobileNavigation.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }


    /* =========================================================
       SEARCH
    ========================================================= */

    function initializeSearch() {
        const searchButton = $("#searchButton");
        const searchContainer = $("#searchContainer");
        const searchForm = $("#searchForm");
        const searchInput = $("#searchInput");

        if (
            !searchButton ||
            !searchContainer
        ) {
            return;
        }

        searchButton.setAttribute("aria-expanded", "false");

        function closeSearch() {
            searchContainer.classList.remove("open");
            searchButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        function openSearch() {
            searchContainer.classList.add("open");
            searchButton.setAttribute(
                "aria-expanded",
                "true"
            );

            if (searchInput) {
                setTimeout(() => {
                    searchInput.focus();
                }, 100);
            }
        }

        searchButton.addEventListener("click", (event) => {
            event.stopPropagation();

            if (searchContainer.classList.contains("open")) {
                closeSearch();
            } else {
                openSearch();
            }
        });

        if (searchForm) {
            searchForm.addEventListener("submit", (event) => {
                event.preventDefault();

                const query = searchInput
                    ? searchInput.value.trim()
                    : "";

                if (!query) {
                    if (searchInput) {
                        searchInput.focus();
                    }

                    return;
                }

                window.location.href =
                    `shop.html?search=${encodeURIComponent(query)}`;
            });
        }

        document.addEventListener("click", (event) => {
            if (
                !searchContainer.contains(event.target) &&
                !searchButton.contains(event.target)
            ) {
                closeSearch();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeSearch();
            }
        });
    }


    /* =========================================================
       CART
    ========================================================= */

    function getCart() {
        try {
            const storedCart =
                localStorage.getItem(CART_STORAGE_KEY);

            if (!storedCart) return [];

            const cart = JSON.parse(storedCart);

            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            console.error("Unable to read cart:", error);
            return [];
        }
    }


    function getCartQuantity() {
        const cart = getCart();

        return cart.reduce((total, item) => {
            const quantity = Number(
                item?.quantity ?? item?.qty ?? 1
            );

            return total +
                (Number.isFinite(quantity) && quantity > 0
                    ? quantity
                    : 0);
        }, 0);
    }


    function updateCartCount() {
        const cartCount = $("#cartCount");

        if (!cartCount) return;

        const quantity = getCartQuantity();

        cartCount.textContent =
            quantity > 99 ? "99+" : String(quantity);

        cartCount.hidden = quantity === 0;
    }


    function initializeCart() {
        updateCartCount();

        window.addEventListener("storage", (event) => {
            if (event.key === CART_STORAGE_KEY) {
                updateCartCount();
            }
        });

        window.addEventListener(
            "threads:cart-updated",
            updateCartCount
        );
    }


    /* =========================================================
       HERO INDICATORS
    ========================================================= */

    function initializeHeroIndicators() {
        const indicators =
            $$(".hero-indicators .indicator");

        if (!indicators.length) return;

        indicators.forEach((indicator, index) => {
            indicator.setAttribute(
                "aria-label",
                `Go to slide ${index + 1}`
            );

            indicator.addEventListener("click", () => {
                indicators.forEach((item) => {
                    item.classList.remove("active");
                });

                indicator.classList.add("active");
            });
        });
    }


    /* =========================================================
       SMOOTH SCROLL
    ========================================================= */

    function initializeSmoothScrolling() {
        $$('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", (event) => {
                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        });
    }


    /* =========================================================
       IMAGE URL HANDLER
    ========================================================= */

    function resolveImageUrl(image) {
        if (!image) {
            return "assets/images/hero-fashion.jpg";
        }

        if (typeof image === "object") {
            image =
                image.url ||
                image.src ||
                image.path ||
                image.image ||
                "";
        }

        if (!image) {
            return "assets/images/hero-fashion.jpg";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("//") ||
            image.startsWith("data:") ||
            image.startsWith("blob:")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            try {
                const apiUrl =
                    new URL(API_BASE_URL);

                return `${apiUrl.origin}${image}`;
            } catch {
                return image;
            }
        }

        return image;
    }


    /* =========================================================
       PRODUCT HELPERS
    ========================================================= */

    function getProductId(product) {
        return (
            product?._id ||
            product?.id ||
            product?.productId ||
            ""
        );
    }


    function getProductName(product) {
        return (
            product?.name ||
            product?.title ||
            "Untitled Product"
        );
    }


    function getProductImage(product) {
        if (Array.isArray(product?.images)) {
            if (product.images.length) {
                return resolveImageUrl(product.images[0]);
            }
        }

        return resolveImageUrl(
            product?.image ||
            product?.imageUrl ||
            product?.thumbnail
        );
    }


    function formatPrice(price) {
        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice)) {
            return "Price unavailable";
        }

        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }).format(numericPrice);
    }


    function getProductRating(product) {
        const rating = Number(
            product?.rating ??
            product?.ratingsAverage ??
            product?.averageRating
        );

        if (
            !Number.isFinite(rating) ||
            rating <= 0
        ) {
            return null;
        }

        return Math.min(5, Math.max(0, rating));
    }


    function getReviewCount(product) {
        const count = Number(
            product?.reviewCount ??
            product?.ratingsCount ??
            product?.reviewsCount
        );

        return Number.isFinite(count) && count >= 0
            ? count
            : 0;
    }


    function isProductOnSale(product) {
        const price = Number(product?.price);

        const oldPrice = Number(
            product?.compareAtPrice ??
            product?.oldPrice ??
            product?.originalPrice ??
            product?.previousPrice
        );

        return Boolean(
            product?.isOnSale ||
            product?.onSale ||
            product?.sale ||
            (
                Number.isFinite(price) &&
                Number.isFinite(oldPrice) &&
                oldPrice > price
            )
        );
    }


    function getOldPrice(product) {
        return (
            product?.compareAtPrice ??
            product?.oldPrice ??
            product?.originalPrice ??
            product?.previousPrice
        );
    }


    function isNewProduct(product) {
        return Boolean(
            product?.isNew ||
            product?.newArrival ||
            product?.isNewArrival
        );
    }


    /* =========================================================
       RATING STARS
    ========================================================= */

    function createRating(product) {
        const rating = getProductRating(product);

        if (rating === null) {
            return null;
        }

        const reviewCount =
            getReviewCount(product);

        const ratingElement =
            document.createElement("div");

        ratingElement.className = "rating";

        const stars =
            document.createElement("span");

        const roundedRating =
            Math.round(rating);

        stars.textContent =
            "★".repeat(roundedRating) +
            "☆".repeat(5 - roundedRating);

        stars.setAttribute(
            "aria-label",
            `${rating.toFixed(1)} out of 5 stars`
        );

        ratingElement.appendChild(stars);

        if (reviewCount > 0) {
            const count =
                document.createElement("span");

            count.className = "rating-count";

            count.textContent =
                `(${reviewCount})`;

            ratingElement.appendChild(count);
        }

        return ratingElement;
    }


    /* =========================================================
       WISHLIST
    ========================================================= */

    function getWishlist() {
        try {
            const stored =
                localStorage.getItem(
                    WISHLIST_STORAGE_KEY
                );

            if (!stored) return [];

            const wishlist =
                JSON.parse(stored);

            return Array.isArray(wishlist)
                ? wishlist
                : [];
        } catch {
            return [];
        }
    }


    function saveWishlist(wishlist) {
        try {
            localStorage.setItem(
                WISHLIST_STORAGE_KEY,
                JSON.stringify(wishlist)
            );
        } catch (error) {
            console.error(
                "Unable to save wishlist:",
                error
            );
        }
    }


    function toggleWishlist(productId, button) {
        if (!productId) return;

        const wishlist = getWishlist();

        const index =
            wishlist.indexOf(productId);

        let isSaved = false;

        if (index >= 0) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(productId);
            isSaved = true;
        }

        saveWishlist(wishlist);

        button.textContent =
            isSaved ? "♥" : "♡";

        button.setAttribute(
            "aria-pressed",
            String(isSaved)
        );
    }


    /* =========================================================
       PRODUCT CARD
    ========================================================= */

    function createProductCard(product) {
        const productId =
            getProductId(product);

        const productName =
            getProductName(product);

        const productCard =
            document.createElement("article");

        productCard.className = "product-card";

        /* -------------------------
           IMAGE
        ------------------------- */

        const imageContainer =
            document.createElement("div");

        imageContainer.className =
            "product-image";

        const imageLink =
            document.createElement("a");

        imageLink.href =
            productId
                ? `product.html?id=${encodeURIComponent(productId)}`
                : "shop.html";

        const image =
            document.createElement("img");

        image.src =
            getProductImage(product);

        image.alt =
            productName;

        image.loading = "lazy";

        image.addEventListener(
            "error",
            () => {
                image.src =
                    "assets/images/hero-fashion.jpg";
            },
            { once: true }
        );

        imageLink.appendChild(image);

        imageContainer.appendChild(imageLink);


        /* -------------------------
           BADGE
        ------------------------- */

        if (isProductOnSale(product)) {
            const badge =
                document.createElement("span");

            badge.className =
                "product-badge sale";

            badge.textContent = "SALE";

            imageContainer.appendChild(badge);
        } else if (isNewProduct(product)) {
            const badge =
                document.createElement("span");

            badge.className =
                "product-badge";

            badge.textContent = "NEW";

            imageContainer.appendChild(badge);
        }


        /* -------------------------
           WISHLIST BUTTON
        ------------------------- */

        const wishlistButton =
            document.createElement("button");

        wishlistButton.type = "button";

        wishlistButton.className =
            "product-wishlist";

        const wishlist =
            getWishlist();

        const isSaved =
            productId &&
            wishlist.includes(productId);

        wishlistButton.textContent =
            isSaved ? "♥" : "♡";

        wishlistButton.setAttribute(
            "aria-label",
            isSaved
                ? `Remove ${productName} from wishlist`
                : `Add ${productName} to wishlist`
        );

        wishlistButton.setAttribute(
            "aria-pressed",
            String(Boolean(isSaved))
        );

        wishlistButton.addEventListener(
            "click",
            () => {
                toggleWishlist(
                    productId,
                    wishlistButton
                );

                const saved =
                    wishlistButton.getAttribute(
                        "aria-pressed"
                    ) === "true";

                wishlistButton.setAttribute(
                    "aria-label",
                    saved
                        ? `Remove ${productName} from wishlist`
                        : `Add ${productName} to wishlist`
                );
            }
        );

        imageContainer.appendChild(
            wishlistButton
        );

        productCard.appendChild(
            imageContainer
        );


        /* -------------------------
           PRODUCT INFO
        ------------------------- */

        const productInfo =
            document.createElement("div");

        productInfo.className =
            "product-info";


        /* Product name */

        const name =
            document.createElement("h3");

        name.className =
            "product-name";

        const nameLink =
            document.createElement("a");

        nameLink.href =
            productId
                ? `product.html?id=${encodeURIComponent(productId)}`
                : "shop.html";

        nameLink.textContent =
            productName;

        name.appendChild(nameLink);

        productInfo.appendChild(name);


        /* Price */

        const price =
            document.createElement("p");

        price.className =
            "product-price";

        price.textContent =
            formatPrice(product?.price);

        if (isProductOnSale(product)) {
            const oldPrice =
                getOldPrice(product);

            if (oldPrice) {
                const oldPriceElement =
                    document.createElement("span");

                oldPriceElement.className =
                    "product-old-price";

                oldPriceElement.textContent =
                    formatPrice(oldPrice);

                price.appendChild(
                    document.createTextNode(" ")
                );

                price.appendChild(
                    oldPriceElement
                );
            }
        }

        productInfo.appendChild(price);


        /* Rating */

        const rating =
            createRating(product);

        if (rating) {
            productInfo.appendChild(rating);
        }

        productCard.appendChild(
            productInfo
        );

        return productCard;
    }


    /* =========================================================
       API RESPONSE NORMALIZER
    ========================================================= */

    function extractProducts(response) {
        if (Array.isArray(response)) {
            return response;
        }

        if (!response || typeof response !== "object") {
            return [];
        }

        if (Array.isArray(response.products)) {
            return response.products;
        }

        if (Array.isArray(response.data)) {
            return response.data;
        }

        if (
            response.data &&
            Array.isArray(response.data.products)
        ) {
            return response.data.products;
        }

        if (Array.isArray(response.results)) {
            return response.results;
        }

        return [];
    }


    /* =========================================================
       BEST SELLERS
    ========================================================= */

    async function loadBestSellers() {
        const bestSellersGrid =
            $("#bestSellersGrid");

        if (!bestSellersGrid) return;

        bestSellersGrid.innerHTML = `
            <div class="products-loading">
                <span class="loading-spinner"></span>
                <p>Loading our best sellers...</p>
            </div>
        `;

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/products?featured=true&limit=4`,
                    {
                        method: "GET",
                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `Products request failed: ${response.status}`
                );
            }

            const data =
                await response.json();

            const products =
                extractProducts(data);

            bestSellersGrid.innerHTML = "";

            if (!products.length) {
                const empty =
                    document.createElement("div");

                empty.className =
                    "products-loading";

                empty.textContent =
                    "No featured products available yet.";

                bestSellersGrid.appendChild(empty);

                return;
            }

            products.slice(0, 4).forEach((product) => {
                bestSellersGrid.appendChild(
                    createProductCard(product)
                );
            });

        } catch (error) {
            console.error(
                "Unable to load best sellers:",
                error
            );

            bestSellersGrid.innerHTML = "";

            const errorContainer =
                document.createElement("div");

            errorContainer.className =
                "products-loading";

            const message =
                document.createElement("p");

            message.textContent =
                "We couldn't load our best sellers right now.";

            errorContainer.appendChild(message);

            const retryButton =
                document.createElement("button");

            retryButton.type = "button";
            retryButton.className =
                "button button-dark";

            retryButton.textContent =
                "Try Again";

            retryButton.addEventListener(
                "click",
                loadBestSellers
            );

            errorContainer.appendChild(
                retryButton
            );

            bestSellersGrid.appendChild(
                errorContainer
            );
        }
    }


    /* =========================================================
       NEWSLETTER
    ========================================================= */

    function initializeNewsletter() {
        const newsletterForm =
            $("#newsletterForm");

        const newsletterMessage =
            $("#newsletterMessage");

        if (!newsletterForm) return;

        newsletterForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                const emailInput =
                    newsletterForm.querySelector(
                        'input[type="email"]'
                    );

                if (!emailInput) return;

                const email =
                    emailInput.value.trim();

                if (!email) {
                    showNewsletterMessage(
                        "Please enter your email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;
                }

                if (!isValidEmail(email)) {
                    showNewsletterMessage(
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;
                }

                const submitButton =
                    newsletterForm.querySelector(
                        'button[type="submit"]'
                    );

                const originalText =
                    submitButton
                        ? submitButton.textContent
                        : "";

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent =
                        "Subscribing...";
                }

                try {
                    const response =
                        await fetch(
                            `${API_BASE_URL}/newsletter/subscribe`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                    "Accept":
                                        "application/json"
                                },
                                body: JSON.stringify({
                                    email
                                })
                            }
                        );

                    const data =
                        await response.json()
                            .catch(() => ({}));

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Subscription failed."
                        );
                    }

                    showNewsletterMessage(
                        data.message ||
                        "You're subscribed. Welcome to THREADS.",
                        "success"
                    );

                    newsletterForm.reset();

                } catch (error) {
                    console.error(
                        "Newsletter subscription error:",
                        error
                    );

                    showNewsletterMessage(
                        error.message ||
                        "Something went wrong. Please try again.",
                        "error"
                    );

                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent =
                            originalText;
                    }
                }
            }
        );


        function showNewsletterMessage(
            message,
            type
        ) {
            if (!newsletterMessage) return;

            newsletterMessage.textContent =
                message;

            newsletterMessage.className =
                "newsletter-message";

            newsletterMessage.classList.add(type);
        }
    }


    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }


    /* =========================================================
       CATEGORY CARDS
    ========================================================= */

    function initializeCategoryCards() {
        $$(".category-card").forEach((card) => {
            card.addEventListener(
                "keydown",
                (event) => {
                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        const link =
                            $("a", card);

                        if (link) {
                            event.preventDefault();
                            link.click();
                        }
                    }
                }
            );
        });
    }


    /* =========================================================
       GLOBAL THREADS OBJECT
       Useful for other frontend pages
    ========================================================= */

    window.THREADS = {
        API_BASE_URL,

        updateCartCount,

        getCart,

        getCartQuantity,

        loadBestSellers,

        getWishlist
    };


    /* =========================================================
       INITIALIZE HOME PAGE
    ========================================================= */

    initializeMobileNavigation();
    initializeSearch();
    initializeCart();
    initializeHeroIndicators();
    initializeSmoothScrolling();
    initializeNewsletter();
    initializeCategoryCards();

    loadBestSellers();

});