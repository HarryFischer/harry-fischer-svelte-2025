<script>
	import { onMount } from "svelte";
	import gsap from "gsap";

	export let items = [];

	let scrollContainer;
	let galleryWrapper;
	let infoOverlay;
	let contactEmailButton;
	let buttonWidth = "auto";
	let backgroundColor = "#ffffff";
	let textColor = "#000";
	let shouldBlurBackground = false;
	let visibleItems = new Set();
	let infoOverlayOpen = false;
	let copiedEmail = false;
	const carouselStates = new Map();
	const carouselIndices = {};
	const CAROUSEL_GAP = 8;
	const CAROUSEL_WIDTH_RATIO = 0.8;

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text).then(() => {
			copiedEmail = true;
			setTimeout(() => {
				copiedEmail = false;
			}, 1000);
		});
	};

	const measureButtonWidth = () => {
		if (contactEmailButton) {
			// Measure the current width of the button
			const width = contactEmailButton.offsetWidth;
			buttonWidth = `${width}px`;
		}
	};

	const updateColors = (newBgColor, newTextColor) => {
		if (galleryWrapper) {
			gsap.to(galleryWrapper, {
				"--bg-color": newBgColor,
				"--text-color": newTextColor,
				duration: 0.6,
				ease: "power2.out",
				immediateRender: true,
			});
		}
	};

	const toggleInfoOverlay = () => {
		if (infoOverlayOpen) {
			// Close animation
			gsap.to(infoOverlay, {
				width: 19,
				height: 19,
				borderRadius: "50%",
				top: "10px",
				right: "10px",
				pointerEvents: "none",
				duration: 0.3,
				ease: "power2.inOut",
				overflow: "hidden",
				onComplete: () => {
					infoOverlayOpen = false;
				},
			});
			gsap.to(".overlay-content", {
				opacity: 0,
				duration: 0.3,
				ease: "power2.inOut",
			});
			gsap.to(".plus-icon", {
				rotation: 0,
				duration: 0.3,
				ease: "power2.inOut",
			});
		} else {
			// Open animation
			infoOverlayOpen = true;
			gsap.to(infoOverlay, {
				width: "calc(100vw - 20px)",
				height: "100vh",
				borderRadius: 0,
				top: 0,
				right: 0,
				pointerEvents: "auto",
				overflowY: "auto",
				duration: 0.3,
				ease: "power2.inOut",
			});
			gsap.to(".plus-icon", {
				rotation: 45,
				duration: 0.3,
				ease: "power2.inOut",
			});
			gsap.to(".overlay-content", {
				opacity: 1,
				duration: 0.4,
				delay: 0.15,
				ease: "power2.inOut",
			});
		}
	};

	$: {
		// Force reactivity for carousel indices
		carouselIndices;
	}

	const getCarouselSlides = (media = []) => {
		if (media.length <= 1) return media;
		const first = media[0];
		const last = media[media.length - 1];
		return [last, ...media, first];
	};

	const applyCarouselTransform = (
		state,
		withTransition = true,
		dragOffset = 0,
	) => {
		const baseOffset = (state.viewport.clientWidth - state.slideWidth) / 2;
		const offset =
			-state.index * (state.slideWidth + state.gap) + baseOffset + dragOffset;

		if (withTransition) {
			gsap.to(state.track, {
				x: offset,
				duration: 0.45,
				ease: "power2.out",
				onComplete: () => {
					// Handle infinite loop wrapping
					if (state.slides.length <= 1) return;
					if (state.index === 0) {
						state.index = state.slides.length - 2;
						gsap.set(state.track, {
							x: -state.index * (state.slideWidth + state.gap) + baseOffset,
						});
					}
					if (state.index === state.slides.length - 1) {
						state.index = 1;
						gsap.set(state.track, {
							x: -state.index * (state.slideWidth + state.gap) + baseOffset,
						});
					}
				},
			});
		} else {
			gsap.set(state.track, { x: offset });
		}

		// Update reactive index for pagination
		const realIndex = state.index - 1;
		carouselIndices[state.id] =
			realIndex >= 0 && realIndex < state.slides.length - 2 ? realIndex : 0;
	};

	const moveCarousel = (id, direction) => {
		const state = carouselStates.get(id);
		if (!state) return;
		state.index += direction;
		applyCarouselTransform(state, true);
		
		// Pause all carousel videos and play only the visible one
		const carouselNode = document.querySelector(`[data-carousel-id="${id}"]`);
		if (carouselNode) {
			const allVideos = carouselNode.querySelectorAll("video");
			allVideos.forEach((video, idx) => {
				// Index 0 is the clone at the end, index 1 is first real slide, etc.
				// The visible slide is at index + 1 (accounting for clone)
				if (idx === state.index) {
					video.play().catch(() => {});
				} else {
					video.pause();
				}
			});
		}
	};

	const carousel = (node, { id, media }) => {
		const viewport = node.querySelector(".carousel-viewport");
		const track = node.querySelector(".carousel-track");
		if (!viewport || !track) return {};

		const slides = getCarouselSlides(media);
		const state = {
			id,
			slides,
			index: slides.length > 1 ? 1 : 0,
			viewport,
			track,
			slideWidth: 0,
			gap: CAROUSEL_GAP,
			startX: 0,
			currentX: 0,
			isDragging: false,
		};

		carouselStates.set(id, state);

		const updateSize = () => {
			state.slideWidth = viewport.clientWidth * CAROUSEL_WIDTH_RATIO;
			applyCarouselTransform(state, false);
		};

		const onPointerDown = (event) => {
			state.isDragging = true;
			state.startX = event.clientX;
			state.currentX = event.clientX;
			viewport.setPointerCapture(event.pointerId);
		};

		const onPointerMove = (event) => {
			if (!state.isDragging) return;
			state.currentX = event.clientX;
			const delta = state.currentX - state.startX;
			applyCarouselTransform(state, false, delta);
		};

		const onPointerUp = (event) => {
			if (!state.isDragging) return;
			state.isDragging = false;
			viewport.releasePointerCapture(event.pointerId);
			const delta = state.currentX - state.startX;
			if (Math.abs(delta) > 50) {
				moveCarousel(id, delta < 0 ? 1 : -1);
			} else {
				applyCarouselTransform(state, true);
			}
		};

		const resizeObserver = new ResizeObserver(updateSize);
		resizeObserver.observe(viewport);
		updateSize();

		viewport.addEventListener("pointerdown", onPointerDown);
		viewport.addEventListener("pointermove", onPointerMove);
		viewport.addEventListener("pointerup", onPointerUp);
		viewport.addEventListener("pointercancel", onPointerUp);

		return {
			destroy() {
				resizeObserver.disconnect();
				viewport.removeEventListener("pointerdown", onPointerDown);
				viewport.removeEventListener("pointermove", onPointerMove);
				viewport.removeEventListener("pointerup", onPointerUp);
				viewport.removeEventListener("pointercancel", onPointerUp);
				carouselStates.delete(id);
			},
		};
	};

	onMount(() => {
		backgroundColor = items[0]?.backgroundColor || "#ffffff";
		textColor = items[0]?.textColor || "#000";

		// Wait for fonts to load before measuring the button width
		if (document.fonts) {
			document.fonts.ready.then(() => {
				measureButtonWidth();
			});
		} else {
			// Fallback for browsers that don't support Font Loading API
			setTimeout(measureButtonWidth, 200);
		}

		// Initialize overlay with GSAP
		if (infoOverlay) {
			gsap.set(infoOverlay, {
				width: 19,
				height: 19,
				borderRadius: "50%",
				top: "10px",
				right: "10px",
			});
			gsap.set(".overlay-content", {
				opacity: 0,
			});
		}

		const scrollContent = scrollContainer?.querySelector(".scroll-content");
		const firstScrollChild = scrollContent?.firstElementChild || null;
		const lastScrollChild = scrollContent?.lastElementChild || null;
		const carouselObservers = [];

		// Determine if desktop based on screen width
		const isDesktop = window.innerWidth > 980;

		// Use Intersection Observer to track which items are in view
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const itemId = parseInt(entry.target.dataset.itemId);
					const isEdgeItem =
						entry.target === firstScrollChild ||
						entry.target === lastScrollChild;

					if (entry.isIntersecting) {
						// Add to visible items
						visibleItems.add(itemId);
						visibleItems = visibleItems; // Trigger reactivity

						// Add CSS class directly to element
						entry.target.classList.add("in-view");

						// Play only non-carousel videos when the item is in view
						const videos = entry.target.querySelectorAll("video");
						videos.forEach((video) => {
							if (video.closest(".carousel")) return;
							video.play().catch((err) => {
								console.log("Video play failed:", err);
							});
						});
						
						// For carousel videos, play the currently visible one
						const carousel = entry.target.querySelector(".carousel");
						if (carousel) {
							const carouselState = carouselStates.get(itemId);
							if (carouselState) {
								const allVideos = carousel.querySelectorAll("video");
								allVideos.forEach((video, idx) => {
									if (idx === carouselState.index) {
										video.play().catch(() => {});
									}
								});
							}
						}

						// Update background color and text color when item comes into view
						if (isEdgeItem) {
							backgroundColor = "#ffffff";
							textColor = "#000";
							updateColors("#ffffff", "#000");
						} else {
							const item = items.find((i) => i.id === itemId);
							if (item) {
								backgroundColor = item.backgroundColor;
								textColor = item.textColor || "#000";
								updateColors(item.backgroundColor, item.textColor || "#000");
							}
						}
					} else {
						// Remove from visible items
						visibleItems.delete(itemId);
						visibleItems = visibleItems; // Trigger reactivity

						// Remove CSS class
						entry.target.classList.remove("in-view");

						// Pause all videos (including those in carousels)
						const videos = entry.target.querySelectorAll("video");
						videos.forEach((video) => {
							video.pause();
						});
					}
				});
			},
			{
				// On desktop, use stricter settings to ensure only one element is in view at a time
				threshold: isDesktop ? 0.8 : 0.5,
				rootMargin: isDesktop
					? "-200px 0px -200px 0px"
					: "-100px 0px -100px 0px",
			},
		);

		// Observe all gallery items
		const itemElements = scrollContainer.querySelectorAll(".gallery-item");
		itemElements.forEach((el) => observer.observe(el));

		// Observe carousel videos within their viewports
		const carouselViewports =
			scrollContainer.querySelectorAll(".carousel-viewport");
		carouselViewports.forEach((viewport) => {
			const carouselNode = viewport.closest(".carousel");
			const carouselId = carouselNode?.getAttribute("data-carousel-id");
			
			const carouselObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const video = entry.target;
						const itemElement = video.closest(".gallery-item");
						const itemId = itemElement
							? parseInt(itemElement.dataset.itemId)
							: null;
						const itemVisible = itemId !== null && visibleItems.has(itemId);

						if (entry.isIntersecting && itemVisible) {
							video.play().catch((err) => {
								console.log("Video play failed:", err);
							});
						} else {
							video.pause();
						}
					});
				},
				{
					root: viewport,
					threshold: 0.6,
				},
			);

			const carouselVideos = viewport.querySelectorAll("video");
			carouselVideos.forEach((video) => {
				carouselObserver.observe(video);
			});
			carouselObservers.push(carouselObserver);
		});

		return () => {
			observer.disconnect();
			carouselObservers.forEach((carouselObserver) => {
				carouselObserver.disconnect();
			});
		};
	});
</script>

<div
	bind:this={galleryWrapper}
	class="gallery-wrapper"
	style="--bg-color: {backgroundColor}; --text-color: {textColor};"
>
	<div
		class="background-text"
		style="filter: {shouldBlurBackground ? 'blur(1px)' : 'blur(0px)'}"
	>
		<div>
			<h1>Harry Fischer</h1>
			<!-- <span>&nbsp;</span> -->
			<p>
				is a lead designer and developer working across digital design, art
				direction, and typography. My approach centers on storytelling through
				authentic methods—creating work that feels real, resonant and
				purposeful. I am currently based in London working with The Guardian.
			</p>
		</div>
	</div>

	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="scroll-content">
			<div class="gallery-item empty" data-item-id="0"></div>
			{#each items as item, index (item.id)}
				<div class="gallery-item" data-item-id={item.id}>
					<div class="item-content">
						{#if item.media && item.media.length > 1}
							<div
								class="carousel"
								data-carousel-id={item.id}
								use:carousel={{ id: item.id, media: item.media }}
							>
								<button
									class="carousel-arrow left"
									type="button"
									aria-label="Previous image"
									on:click={() => moveCarousel(item.id, -1)}
								>
									←
								</button>
								<div class="carousel-viewport">
									<div class="carousel-track">
										{#each getCarouselSlides(item.media) as mediaItem, mediaIndex}
											<div class="carousel-slide">
												{#if mediaItem.type === "video"}
													<video
														src={mediaItem.src}
														poster={mediaItem.poster}
														loop
														muted
														playsinline
														preload="metadata"
													></video>
												{:else}
													<img
														loading="lazy"
														src={mediaItem.src}
														alt={`${item.title} ${mediaIndex + 1}`}
													/>
												{/if}
											</div>
										{/each}
									</div>
								</div>
								<button
									class="carousel-arrow right"
									type="button"
									aria-label="Next image"
									on:click={() => moveCarousel(item.id, 1)}
								>
									→
								</button>
								<div class="carousel-pagination">
									{#each item.media as _, dotIndex}
										<button
											class="carousel-dot"
											class:active={carouselIndices[item.id] === dotIndex}
											aria-label={`Go to slide ${dotIndex + 1}`}
											on:click={() => {
												const state = carouselStates.get(item.id);
												if (state) {
													state.index = dotIndex + 1;
													applyCarouselTransform(state, true);
												}
											}}
										></button>
									{/each}
								</div>
							</div>
						{:else if item.type === "video"}
							<video
								src={item.src}
								poster={item.poster}
								loop
								muted
								playsinline
								preload="metadata"
							></video>
						{:else if item.type === "image"}
							<img loading="lazy" src={item.src} alt={item.title} />
						{:else}{/if}
						{#if item.url}
							<a href={item.url} target="_blank" rel="noopener noreferrer">
								<h2>{item.title}</h2>
							</a>
						{:else}
							<h2>{item.title}</h2>
						{/if}
					</div>
				</div>
			{/each}
			<div class="gallery-item empty" data-item-id="-1"></div>
		</div>
	</div>

	<!-- Info Overlay Button -->
	<button
		class="info-button"
		class:open={infoOverlayOpen}
		on:click={toggleInfoOverlay}
		aria-label="Toggle info overlay"
	>
		<span class="plus-icon"></span>
	</button>

	<!-- Info Overlay -->
	<div class="info-overlay" bind:this={infoOverlay}>
		<div class="overlay-content">
			<p>
				Harry Fischer began his career at WCRS, a leading advertising agency,
				working across a range of high-profile brands including the RAF, Sky,
				NOW TV, and Born Free. From there, he moved into digital design, taking
				on briefs for Costa and leading the redesign of the RAF's recruitment
				website. It was during this period that he taught himself to code — a
				skill that has proven invaluable ever since, allowing him to bridge the
				gap between design and engineering and hold informed, confident
				conversations across both disciplines.
			</p>
			<p>
				He then joined a digital design agency where he deepened his UX
				expertise, working on projects ranging from a tool to track dolphin
				movements along the UK's south coast to internal incident management
				platforms for enterprise clients.
			</p>
			<div>
				<small>Awards & recognition</small>
				<small>
					<span>Cotton Capital,</span><br />The Guardian: D&AD, Wooden Pencil
					Magazine design | Type Directors Club, Winner | ISTD, Cerificate of
					Excellence | Design Week, Social Design Winner
				</small>
				<small>
					<span>UK and US Elections 2024,</span><br />The Guardian: D&AD, Wooden
					Pencil | SND, Award of Excellence | SPD, Medal Finalist
				</small>
				<small>
					<span>The Black Panther Cubs,</span><br />The Guardian: Grierson, Long
					listed
				</small>
			</div>
		</div>
	</div>

	<!-- Contact Box -->
	<div class="contact-box">
		<div class="contact-content">
			<div class="contact-label" style="color: var(--text-color)">
				Open to comissions
			</div>
			<button
				bind:this={contactEmailButton}
				class="contact-email"
				style="color: var(--text-color); width: {buttonWidth};"
				on:click={() => copyToClipboard("harry.j.fischer@gmail.com")}
				title="Click to copy email"
			>
				{#if copiedEmail}
					Copied
				{:else}
					harry.j.fischer@gmail.com
				{/if}
			</button>
			<a
				href="https://www.instagram.com/harrryfischer"
				target="_blank"
				rel="noopener noreferrer"
				class="contact-instagram"
				style="color: var(--text-color)"
			>
				@harrryfischer
			</a>
		</div>
	</div>
</div>
