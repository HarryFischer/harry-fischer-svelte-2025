<script>
	import { onMount } from "svelte";

	export let items = [];

	let scrollContainer;
	let backgroundColor = items[0]?.backgroundColor || "#000";
	let visibleItems = new Set();

	$: console.log("Visible items:", Array.from(visibleItems));

	onMount(() => {
		backgroundColor = items[0]?.backgroundColor || "#000";

		// Use Intersection Observer to track which items are in view
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const itemId = parseInt(entry.target.dataset.itemId);

					if (entry.isIntersecting) {
						// Add to visible items
						visibleItems.add(itemId);
						visibleItems = visibleItems; // Trigger reactivity

						// Add CSS class directly to element
						entry.target.classList.add("in-view");

						// Update background color when item comes into view
						const item = items.find((i) => i.id === itemId);
						if (item) {
							backgroundColor = item.backgroundColor;
						}
					} else {
						// Remove from visible items
						visibleItems.delete(itemId);
						visibleItems = visibleItems; // Trigger reactivity

						// Remove CSS class
						entry.target.classList.remove("in-view");
					}
				});
			},
			{
				threshold: 0.5, // Item must be 50% visible
				rootMargin: "-100px 0px -100px 0px", // Trigger a bit earlier when scrolling down
			},
		);

		// Observe all gallery items
		const itemElements = scrollContainer.querySelectorAll(".gallery-item");
		itemElements.forEach((el) => observer.observe(el));

		return () => {
			observer.disconnect();
		};
	});
</script>

<div class="gallery-wrapper" style="background-color: {backgroundColor}">
	<div class="background-text">
		<h1>Harry Fischer<br />Lead Designer & Developer</h1>
	</div>

	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="scroll-content">
			<div class="gallery-item empty"></div>
			{#each items as item, index (item.id)}
				<div class="gallery-item" data-item-id={item.id}>
					<div
						class="item-content"
						style="background-color: {item.backgroundColor}"
					>
						<span>{item.title}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.gallery-wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		transition: background-color 0.6s ease-out;
	}

	.background-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 0;
		pointer-events: none;

		h1 {
			margin: 0;
			font-size: clamp(2rem, 8vw, 6rem);
			font-weight: 700;
			color: rgba(255, 255, 255, 0.1);
			line-height: 1.2;
			white-space: nowrap;
		}
	}

	.scroll-container {
		width: 100%;
		height: 100vh;
		overflow-y: scroll;
		overflow-x: hidden;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
		position: relative;
		z-index: 10;

		// Custom scrollbar
		&::-webkit-scrollbar {
			width: 8px;
		}

		&::-webkit-scrollbar-track {
			background: rgba(255, 255, 255, 0.05);
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(255, 255, 255, 0.2);
			border-radius: 4px;

			&:hover {
				background: rgba(255, 255, 255, 0.3);
			}
		}
	}

	.scroll-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100vh 0;
		gap: 40px;
	}

	.gallery-item {
		width: 100%;
		height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		scroll-snap-align: center;
		scroll-snap-stop: always;
		transform: scale(0.5);
		transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);

		&.in-view {
			transform: scale(1);
			z-index: 5;
		}
	}

	.item-content {
		width: 90%;
		max-width: 500px;
		height: 100%;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		transition: box-shadow 0.4s ease;

		span {
			color: white;
			font-size: 28px;
			font-weight: bold;
			text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
		}

		img,
		video {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: 16px;
		}
	}

	.gallery-item.active .item-content {
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
	}

	:global(.gallery-item.in-view) {
		transform: scale(1);
		z-index: 5;
	}
</style>
