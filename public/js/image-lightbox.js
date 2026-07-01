(function () {
  const SELECTOR = "[data-lightbox-image]";
  const OPEN_CLASS = "louver-lightbox-open";
  const scrollLock = window.PioneerScrollLock || (() => {
    let lockCount = 0;
    let scrollY = 0;

    const lock = () => {
      lockCount += 1;
      if (lockCount > 1) return;
      scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    };

    const unlock = () => {
      if (!lockCount) return;
      lockCount -= 1;
      if (lockCount) return;
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };

    return { lock, unlock };
  })();

  window.PioneerScrollLock = scrollLock;
  let lightbox = null;
  let lightboxImage = null;
  let currentIndex = 0;
  let currentLinks = [];
  let lastLink = null;

  const createLightbox = () => {
    const existing = document.querySelector(
      "[data-image-lightbox], #louver-image-lightbox",
    );
    if (existing) {
      lightbox = existing;
      lightboxImage = existing.querySelector(
        "[data-image-lightbox-img], .louver-image-lightbox__image",
      );
      return;
    }

    lightbox = document.createElement("div");
    lightbox.className = "louver-image-lightbox";
    lightbox.dataset.imageLightbox = "";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image preview");
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <div class="louver-image-lightbox__backdrop" data-image-lightbox-close></div>
      <div class="louver-image-lightbox__content">
        <img class="louver-image-lightbox__image" data-image-lightbox-img src="" alt="">
      </div>
      <button class="louver-image-lightbox__nav louver-image-lightbox__nav--prev" type="button" data-image-lightbox-prev aria-label="View previous image">&#8592;</button>
      <button class="louver-image-lightbox__nav louver-image-lightbox__nav--next" type="button" data-image-lightbox-next aria-label="View next image">&#8594;</button>
      <button class="louver-image-lightbox__close" type="button" data-image-lightbox-close aria-label="Close image preview">&times;</button>
    `;
    document.body.appendChild(lightbox);
    lightboxImage = lightbox.querySelector("[data-image-lightbox-img]");
  };

  const getGroupName = (link) => {
    const group = link.closest("[data-lightbox-gallery]");
    return link.dataset.lightboxGroup || (group && group.dataset.lightboxGallery) || "";
  };

  const getSource = (link) => {
    const image = link.querySelector("img");
    return link.href || link.dataset.lightboxSrc || (image && image.currentSrc) || (image && image.src) || "";
  };

  const getLinks = (activeLink) => {
    const groupName = getGroupName(activeLink);
    return [...document.querySelectorAll(SELECTOR)].filter((link) => {
      if (link.dataset.lightboxProxy === "true") return false;
      if (!groupName) return getGroupName(link) === "";
      return getGroupName(link) === groupName;
    });
  };

  const showImage = (index) => {
    if (!currentLinks.length) return;
    currentIndex = (index + currentLinks.length) % currentLinks.length;
    lastLink = currentLinks[currentIndex];
    const previewImage = lastLink.querySelector("img");
    lightboxImage.src = getSource(lastLink);
    lightboxImage.alt = previewImage ? previewImage.alt : "Image preview";
  };

  const openLightbox = (link) => {
    createLightbox();
    currentLinks = getLinks(link);
    const proxyIndex = Number(link.dataset.lightboxIndex);
    const index = link.dataset.lightboxProxy === "true" && !Number.isNaN(proxyIndex)
      ? proxyIndex
      : currentLinks.indexOf(link);
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add(OPEN_CLASS);
    scrollLock.lock();
    lightbox
      .querySelector("[data-image-lightbox-close], [data-lightbox-close]")
      .focus();
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove(OPEN_CLASS);
    scrollLock.unlock();
    lightboxImage.removeAttribute("src");
    if (lastLink) lastLink.focus();
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest(SELECTOR);
    if (!link) return;
    if (link.hasAttribute("data-lightbox-disabled")) return;
    event.preventDefault();
    openLightbox(link);
  });

  document.addEventListener("click", (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.target.closest("[data-image-lightbox-close], [data-lightbox-close]")) {
      closeLightbox();
    }
    if (event.target.closest("[data-image-lightbox-prev], [data-lightbox-prev]")) {
      showImage(currentIndex - 1);
    }
    if (event.target.closest("[data-image-lightbox-next], [data-lightbox-next]")) {
      showImage(currentIndex + 1);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });
})();
