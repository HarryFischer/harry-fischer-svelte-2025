<script>
	import { onMount } from "svelte";

	let canvasContainer;
	let currentX = 0;
	let currentY = 0;
	let aimX = 0;
	let aimY = 0;

	const updateAim = (event) => {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		const worldWidth = canvasContainer.clientWidth;
		const worldHeight = canvasContainer.clientHeight;

		// total pan size
		const panX = worldWidth - windowWidth;
		const panY = worldHeight - windowHeight;

		// Get coordinates from either mouse or touch event
		let pageX = event.pageX;
		let pageY = event.pageY;

		if (event.touches && event.touches.length > 0) {
			pageX = event.touches[0].pageX;
			pageY = event.touches[0].pageY;
		}

		// percentage x/y
		const px = pageX / windowWidth;
		const py = pageY / windowHeight;

		// how much shift from the center
		aimX = panX * px;
		aimY = panY * py;
	};

	const animate = () => {
		// Smooth easing using lerp
		currentX += (aimX - currentX) * 0.05;
		currentY += (aimY - currentY) * 0.05;

		canvasContainer.style.left = -1 * currentX + "px";
		canvasContainer.style.top = -1 * currentY + "px";

		requestAnimationFrame(animate);
	};

	onMount(() => {
		animate();

		const handleMouseMove = (event) => {
			updateAim(event);
		};

		const handleTouchMove = (event) => {
			updateAim(event);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("touchmove", handleTouchMove);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("touchmove", handleTouchMove);
		};
	});
</script>

<div class="panner">
	<div
		class="panner-inner"
		bind:this={canvasContainer}
		role="region"
		aria-label="Panning canvas"
	>
		<slot />
	</div>
</div>

<style lang="scss">
	@import "../styles/PanningCanvas.scss";
</style>
