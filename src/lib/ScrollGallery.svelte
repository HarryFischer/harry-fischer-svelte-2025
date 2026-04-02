<script>
	import { onMount, tick } from "svelte";
	import gsap from "gsap";

	export let items = [];
	export let cursorLeftUrl = `${import.meta.env.BASE_URL}assets/cursor-left.png`;
	export let cursorRightUrl = `${import.meta.env.BASE_URL}assets/cursor-right.png`;

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
	let mediaOrientations = {};
	let blockedVideos = new Set();
	const carouselStates = new Map();
	const carouselIndices = {};
	const DESKTOP_BREAKPOINT = 980;
	const CAROUSEL_GAP_MOBILE = 8;
	const CAROUSEL_GAP_DESKTOP = 20;
	const CAROUSEL_WIDTH_RATIO_MOBILE = 0.8;
	const CAROUSEL_WIDTH_RATIO_DESKTOP = 0.3;
	const CURSOR_HOTSPOT_X = 16;
	const CURSOR_HOTSPOT_Y = 16;

	const getDirectionalCursor = (direction) => {
		const fallback = direction < 0 ? "w-resize" : "e-resize";
		const cursorUrl = direction < 0 ? cursorLeftUrl : cursorRightUrl;
		if (!cursorUrl) return fallback;

		return `url("${cursorUrl}") ${CURSOR_HOTSPOT_X} ${CURSOR_HOTSPOT_Y}, ${fallback}`;
	};

	const getCarouselSizing = () => {
		const isDesktop =
			typeof window !== "undefined" && window.innerWidth > DESKTOP_BREAKPOINT;

		return {
			isDesktop,
			gap: isDesktop ? CAROUSEL_GAP_DESKTOP : CAROUSEL_GAP_MOBILE,
			widthRatio: isDesktop
				? CAROUSEL_WIDTH_RATIO_DESKTOP
				: CAROUSEL_WIDTH_RATIO_MOBILE,
		};
	};

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
				width: "calc(100vw - 24px)",
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
		return media;
	};

	const applyCarouselTransform = (
		state,
		withTransition = true,
		dragOffset = 0,
	) => {
		const activeSlide = state.track.children[state.index];
		const fallbackOffset =
			-state.index * (state.slideWidth + state.gap) +
			(state.viewport.clientWidth - state.slideWidth) / 2;
		const centeredOffset = activeSlide
			? state.viewport.clientWidth / 2 -
				(activeSlide.offsetLeft + activeSlide.clientWidth / 2)
			: fallbackOffset;
		const offset = centeredOffset + dragOffset;

		if (withTransition) {
			gsap.to(state.track, {
				x: offset,
				duration: 0.45,
				ease: "power2.out",
			});
		} else {
			gsap.set(state.track, { x: offset });
		}

		// Update reactive index for pagination
		carouselIndices[state.id] = state.index;

		// Mark the active slide so its figcaption becomes visible
		Array.from(state.track.children).forEach((slide, idx) => {
			slide.classList.toggle("is-active", idx === state.index);
		});
	};

	const tryPlayVideo = (video) => {
		video.play().catch(() => {});
		setTimeout(() => {
			if (video.paused) {
				blockedVideos = new Set([...blockedVideos, video.src]);
			}
		}, 1000);
	};

	const playCarouselVideoAtIndex = (carouselNode, state) => {
		const track = carouselNode.querySelector(".carousel-track");
		if (!track) return;
		carouselNode.querySelectorAll("video").forEach((video) => {
			const slide = video.closest(".carousel-slide");
			const slideIdx = slide ? Array.from(track.children).indexOf(slide) : -1;
			if (slideIdx === state.index) {
				tryPlayVideo(video);
			} else {
				video.pause();
			}
		});
	};

	const moveCarousel = (id, direction) => {
		const state = carouselStates.get(id);
		if (!state) return;

		const minIndex = 0;
		const maxIndex = Math.max(0, state.slides.length - 1);
		state.index = Math.min(
			maxIndex,
			Math.max(minIndex, state.index + direction),
		);

		applyCarouselTransform(state, true);

		const carouselNode = document.querySelector(`[data-carousel-id="${id}"]`);
		if (carouselNode) {
			playCarouselVideoAtIndex(carouselNode, state);
		}
	};

	const canMoveCarousel = (id, direction) => {
		const state = carouselStates.get(id);
		if (!state) return false;
		if (direction < 0) return state.index > 0;
		return state.index < state.slides.length - 1;
	};

	const getRenderedSlideWidth = (track, fallbackWidth) => {
		const firstSlide = track.querySelector(".carousel-slide");
		if (!firstSlide) return fallbackWidth;

		const measuredWidth = firstSlide.getBoundingClientRect().width;
		return measuredWidth > 0 ? measuredWidth : fallbackWidth;
	};

	const refreshCarouselLayouts = () => {
		carouselStates.forEach((state) => {
			const { gap: nextGap, widthRatio: nextWidthRatio } = getCarouselSizing();
			state.gap = nextGap;
			const fallbackWidth = state.viewport.clientWidth * nextWidthRatio;
			state.slideWidth = getRenderedSlideWidth(state.track, fallbackWidth);
			applyCarouselTransform(state, false);
		});
	};

	const setMediaOrientation = (src, event) => {
		if (!src) return;

		const element = event.currentTarget;
		if (!element) return;

		let width = 0;
		let height = 0;

		if (element.tagName === "IMG") {
			width = element.naturalWidth;
			height = element.naturalHeight;
		} else if (element.tagName === "VIDEO") {
			width = element.videoWidth;
			height = element.videoHeight;
		}

		if (!width || !height) return;

		const orientation = width >= height ? "landscape" : "portrait";
		if (mediaOrientations[src] === orientation) return;

		mediaOrientations = {
			...mediaOrientations,
			[src]: orientation,
		};

		// Orientation classes can change slide width, so re-measure and recenter.
		requestAnimationFrame(refreshCarouselLayouts);
	};

	const carousel = (node, { id, media }) => {
		const viewport = node.querySelector(".carousel-viewport");
		const track = node.querySelector(".carousel-track");
		if (!viewport || !track) return {};

		const { gap, widthRatio } = getCarouselSizing();
		const slides = getCarouselSlides(media);
		const fallbackSlideWidth = viewport.clientWidth * widthRatio;
		const state = {
			id,
			media,
			slides,
			index: 0,
			viewport,
			track,
			slideWidth: getRenderedSlideWidth(track, fallbackSlideWidth),
			gap,
			startX: 0,
			currentX: 0,
			isDragging: false,
		};

		carouselStates.set(id, state);

		const updateSize = () => {
			const { gap: nextGap, widthRatio: nextWidthRatio } = getCarouselSizing();
			state.gap = nextGap;
			const fallbackWidth = viewport.clientWidth * nextWidthRatio;
			state.slideWidth = getRenderedSlideWidth(track, fallbackWidth);
			applyCarouselTransform(state, false);
		};

		const getDirectionFromClientX = (clientX) => {
			const rect = viewport.getBoundingClientRect();
			const midpoint = rect.left + rect.width / 2;
			return clientX < midpoint ? -1 : 1;
		};

		const updateViewportCursor = (clientX) => {
			viewport.style.cursor = getDirectionalCursor(
				getDirectionFromClientX(clientX),
			);
		};

		const onPointerDown = (event) => {
			state.isDragging = false;
			state.axisLocked = null;
			state.startX = event.clientX;
			state.startY = event.clientY;
			state.currentX = event.clientX;
			if (event.pointerType === "mouse") {
				viewport.setPointerCapture(event.pointerId);
				updateViewportCursor(event.clientX);
			}
		};

		const onPointerMove = (event) => {
			updateViewportCursor(event.clientX);
			if (event.pointerType === "mouse") return;

			const dx = event.clientX - state.startX;
			const dy = event.clientY - state.startY;

			// Determine axis lock once we have enough movement
			if (!state.axisLocked && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
				state.axisLocked = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
				if (state.axisLocked === "x") {
					state.isDragging = true;
					viewport.setPointerCapture(event.pointerId);
				}
			}

			if (!state.isDragging || state.axisLocked !== "x") return;
			state.currentX = event.clientX;
			applyCarouselTransform(state, false, dx);
		};

		const onPointerUp = (event) => {
			const wasDragging = state.isDragging;
			state.isDragging = false;
			state.axisLocked = null;

			if (event.pointerType === "mouse") {
				if (viewport.hasPointerCapture?.(event.pointerId)) {
					viewport.releasePointerCapture(event.pointerId);
				}
				moveCarousel(id, getDirectionFromClientX(event.clientX));
				updateViewportCursor(event.clientX);
				return;
			}

			if (!wasDragging) return;
			viewport.releasePointerCapture(event.pointerId);

			const delta = state.currentX - state.startX;
			if (Math.abs(delta) > 50) {
				moveCarousel(id, delta < 0 ? 1 : -1);
			} else {
				applyCarouselTransform(state, true);
			}
		};

		const onPointerEnter = (event) => {
			updateViewportCursor(event.clientX);
		};

		const onPointerLeave = () => {
			viewport.style.cursor = "";
		};

		const resizeObserver = new ResizeObserver(updateSize);
		resizeObserver.observe(viewport);
		updateSize();

		viewport.addEventListener("pointerdown", onPointerDown);
		viewport.addEventListener("pointerenter", onPointerEnter);
		viewport.addEventListener("pointermove", onPointerMove);
		viewport.addEventListener("pointerup", onPointerUp);
		viewport.addEventListener("pointercancel", onPointerUp);
		viewport.addEventListener("pointerleave", onPointerLeave);

		return {
			destroy() {
				resizeObserver.disconnect();
				viewport.removeEventListener("pointerdown", onPointerDown);
				viewport.removeEventListener("pointerenter", onPointerEnter);
				viewport.removeEventListener("pointermove", onPointerMove);
				viewport.removeEventListener("pointerup", onPointerUp);
				viewport.removeEventListener("pointercancel", onPointerUp);
				viewport.removeEventListener("pointerleave", onPointerLeave);
				carouselStates.delete(id);
			},
		};
	};

	onMount(() => {
		const updateViewportMode = () => {
			requestAnimationFrame(refreshCarouselLayouts);
		};

		updateViewportMode();
		window.addEventListener("resize", updateViewportMode);

		backgroundColor = "#ffffff";
		textColor = "#000";

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
							tryPlayVideo(video);
						});

						// For carousel videos, play the currently visible one
						const carousel = entry.target.querySelector(".carousel");
						if (carousel) {
							const carouselState = carouselStates.get(itemId);
							if (carouselState) {
								playCarouselVideoAtIndex(carousel, carouselState);
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
							// On desktop the viewport is wide enough that adjacent slides are
							// also visible, so guard against playing a non-current slide.
							const carouselState =
								itemId !== null ? carouselStates.get(itemId) : null;
							if (carouselState) {
								const track = video.closest(".carousel-track");
								const slide = video.closest(".carousel-slide");
								const slideIdx =
									slide && track
										? Array.from(track.children).indexOf(slide)
										: -1;
								if (slideIdx === carouselState.index) {
									tryPlayVideo(video);
								} else {
									video.pause();
								}
							} else {
								tryPlayVideo(video);
							}
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

		const onScroll = () => {
			if (scrollContainer.scrollTop < 50) {
				backgroundColor = "#ffffff";
				textColor = "#000";
				updateColors("#ffffff", "#000");
			}
		};
		scrollContainer.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			window.removeEventListener("resize", updateViewportMode);
			scrollContainer.removeEventListener("scroll", onScroll);
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
					<div class="item-content" class:single-media={!item.media}>
						<h2 class="sr-only">{item.title}</h2>
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
									disabled={!canMoveCarousel(item.id, -1)}
									on:click={() => moveCarousel(item.id, -1)}
								>
									←
								</button>
								<div class="carousel-viewport">
									<div class="carousel-track">
										{#each getCarouselSlides(item.media) as mediaItem, mediaIndex}
											<figure
												class="carousel-slide"
												class:is-portrait={mediaOrientations[mediaItem.src] ===
													"portrait"}
												class:is-landscape={mediaOrientations[mediaItem.src] ===
													"landscape"}
											>
												{#if mediaItem.type === "video"}
													<div class="video-wrapper">
														<video
															src={mediaItem.src}
															poster={mediaItem.poster}
															on:loadedmetadata={(event) =>
																setMediaOrientation(mediaItem.src, event)}
															loop
															muted
															playsinline
															preload="metadata"
														></video>
														{#if blockedVideos.has(mediaItem.src)}
															<button
																class="play-button"
																type="button"
																aria-label="Play video"
																on:click={(e) => {
																	const v = e.currentTarget
																		.closest(".video-wrapper")
																		.querySelector("video");
																	v.play();
																	blockedVideos.delete(mediaItem.src);
																	blockedVideos = blockedVideos;
																}}
															>
																<svg viewBox="0 0 24 24" fill="currentColor"
																	><path d="M8 5v14l11-7z" /></svg
																>
															</button>
														{/if}
													</div>
												{:else}
													<img
														loading="lazy"
														src={mediaItem.src}
														on:load={(event) =>
															setMediaOrientation(mediaItem.src, event)}
														alt={`${item.title} ${mediaIndex + 1}`}
													/>
												{/if}
												{#if mediaItem.caption}
													<figcaption>{@html mediaItem.caption}</figcaption>
												{/if}
											</figure>
										{/each}
									</div>
								</div>
								<button
									class="carousel-arrow right"
									type="button"
									aria-label="Next image"
									disabled={!canMoveCarousel(item.id, 1)}
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
													state.index = dotIndex;
													applyCarouselTransform(state, true);
												}
											}}
										></button>
									{/each}
								</div>
							</div>
						{:else}
							<figure>
								{#if item.type === "video"}
									<div class="video-wrapper">
										<video
											src={item.src}
											poster={item.poster}
											class:is-portrait={mediaOrientations[item.src] ===
												"portrait"}
											class:is-landscape={mediaOrientations[item.src] ===
												"landscape"}
											on:loadedmetadata={(event) =>
												setMediaOrientation(item.src, event)}
											loop
											muted
											playsinline
											preload="metadata"
										></video>
										{#if blockedVideos.has(item.src)}
											<button
												class="play-button"
												type="button"
												aria-label="Play video"
												on:click={(e) => {
													const v = e.currentTarget
														.closest(".video-wrapper")
														.querySelector("video");
													v.play();
													blockedVideos.delete(item.src);
													blockedVideos = blockedVideos;
												}}
											>
												<svg viewBox="0 0 24 24" fill="currentColor"
													><path d="M8 5v14l11-7z" /></svg
												>
											</button>
										{/if}
									</div>
								{:else if item.type === "image"}
									<img
										loading="lazy"
										src={item.src}
										class:is-portrait={mediaOrientations[item.src] ===
											"portrait"}
										class:is-landscape={mediaOrientations[item.src] ===
											"landscape"}
										on:load={(event) => setMediaOrientation(item.src, event)}
										alt={item.title}
									/>
								{/if}
								{#if item.caption}
									<figcaption>
										{#if item.url}
											<a
												href={item.url}
												target="_blank"
												rel="noopener noreferrer">{@html item.caption}</a
											>
										{:else}
											{@html item.caption}
										{/if}
									</figcaption>
								{/if}
							</figure>
						{/if}
					</div>
				</div>
			{/each}
			<div class="gallery-item empty" data-item-id="-1"></div>
		</div>
	</div>

	<!-- Contact Box -->
	<div class="contact-box">
		<div class="contact-content">
			<div class="contact-label">Get in touch — open to commissions</div>
			<button
				bind:this={contactEmailButton}
				class="contact-email"
				style="width: {buttonWidth};"
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
			>
				@harrryfischer
			</a>
		</div>
	</div>
</div>
