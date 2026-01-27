<script>
	import PanningCanvas from "./lib/PanningCanvas.svelte";

	const items = Array.from({ length: 35 }, (_, i) => ({
		id: i + 1,
		gradient: `linear-gradient(135deg, hsl(${(i * 12) % 360}, 70%, 60%) 0%, hsl(${(i * 12 + 30) % 360}, 70%, 50%) 100%)`,
	}));

	const getRandomPosition = (index) => {
		const seed = index;
		const random1 = Math.sin(seed * 12.9898) * 43758.5453;
		const random2 = Math.sin((seed + 0.5) * 78.233) * 43758.5453;
		const x = (random1 - Math.floor(random1)) * 3700;
		const y = (random2 - Math.floor(random2)) * 2900;
		return { x, y };
	};
</script>

<PanningCanvas>
	{#each items as item, index (item.id)}
		{@const pos = getRandomPosition(index)}
		<div
			class="canvas-item"
			style="background: {item.gradient}; left: {pos.x}px; top: {pos.y}px;"
		>
			<span>Item {item.id}</span>
		</div>
	{/each}
</PanningCanvas>

<style lang="scss">
	@import "./styles/main.scss";
</style>
