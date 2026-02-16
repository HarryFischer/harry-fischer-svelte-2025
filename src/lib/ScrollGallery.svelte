<script>
	import { onMount } from "svelte";

	export let items = [];

	let scrollContainer;
	let backgroundColor = "#ffffff";
	let shouldBlurBackground = false;
	let visibleItems = new Set();
	const carouselStates = new Map();
	const carouselIndices = {};
	const CAROUSEL_GAP = 8;
	const CAROUSEL_WIDTH_RATIO = 0.8;

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
		state.track.style.transition = withTransition
			? "transform 0.45s ease"
			: "none";
		state.track.style.transform = `translateX(${offset}px)`;

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

		const onTransitionEnd = () => {
			if (state.slides.length <= 1) return;
			if (state.index === 0) {
				state.index = state.slides.length - 2;
				applyCarouselTransform(state, false);
			}
			if (state.index === state.slides.length - 1) {
				state.index = 1;
				applyCarouselTransform(state, false);
			}
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

		track.addEventListener("transitionend", onTransitionEnd);
		viewport.addEventListener("pointerdown", onPointerDown);
		viewport.addEventListener("pointermove", onPointerMove);
		viewport.addEventListener("pointerup", onPointerUp);
		viewport.addEventListener("pointercancel", onPointerUp);

		return {
			destroy() {
				resizeObserver.disconnect();
				track.removeEventListener("transitionend", onTransitionEnd);
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

						// Update background color when item comes into view
						if (isEdgeItem) {
							backgroundColor = "#ffffff";
						} else {
							const item = items.find((i) => i.id === itemId);
							if (item) {
								backgroundColor = item.backgroundColor;
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
			carouselVideos.forEach((video) => carouselObserver.observe(video));
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

<div class="gallery-wrapper" style="background-color: {backgroundColor}">
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
				<a
					href="https://www.instagram.com/harrryfischer"
					target="_blank"
					rel="noopener noreferrer">@harrryfischer</a
				>
				<!-- <a
          href="https://www.theguardian.com/profile/harry-fischer"
          target="_blank"
          rel="noopener noreferrer">The Guardian</a
        > -->
			</p>
		</div>
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

	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="scroll-content">
			<div class="gallery-item empty" data-item-id="0"></div>
			{#each items as item, index (item.id)}
				<div class="gallery-item" data-item-id={item.id}>
					<div class="item-content">
						{#if item.media && item.media.length > 1}
							<div
								class="carousel"
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
							<video src={item.src} loop muted playsinline preload="metadata"
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
</div>

<style lang="scss">
</style>
