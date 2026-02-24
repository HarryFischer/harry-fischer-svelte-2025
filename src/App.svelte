<script>
	import { onMount } from "svelte";
	import ScrollGallery from "./lib/ScrollGallery.svelte";

	let isLoading = true;
	let isFading = false;

	// Use Vite's BASE_URL to construct proper asset paths for GitHub Pages
	const baseUrl = import.meta.env.BASE_URL;
	const asset = (path) => `${baseUrl}assets/${path}`;

	const items = [
		{
			id: 2,
			backgroundColor: "#ff5900",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("bedside-cover.png"),
				},
				{
					type: "image",
					src: asset("bedside-back.png"),
				},
				{
					type: "image",
					src: asset("bedside-3.jpg"),
				},
			],
			title: "The Bedside Guardian 2025",
			url: "https://www.theguardian.com/environment/ng-interactive/2025/nov/26/beside-2025-a-glimpse-of-the-future-of-coastal-cities",
		},
		{
			id: 3,
			backgroundColor: "#3399FF",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("cubs-0.jpg"),
				},
				{
					type: "video",
					src: asset("cubs-titles.mp4"),
					poster: asset("cubs-titles-poster.jpg"),
				},
				{
					type: "video",
					src: asset("cubs-credits.mp4"),
					poster: asset("cubs-credits-poster.jpg"),
				},
				{
					type: "image",
					src: asset("Cubs-1.png"),
				},
				{
					type: "image",
					src: asset("cubs-poster.jpg"),
				},
			],
			title: "The Black Panther Cubs — When The Revolution Doesn't Come",
		},
		{
			id: 11,
			backgroundColor: "#2C2C26",
			textColor: "#fff",
			media: [
				{
					type: "video",
					src: asset("cub-sans-vid.mp4"),
				},
				{
					type: "image",
					src: asset("cub-sans-char-1.jpg"),
				},
				{
					type: "image",
					src: asset("cub-sans-char-2.jpg"),
				},
				{
					type: "video",
					src: asset("cub-sans-website.mp4"),
				},
			],
			title: "Guardian Cub Sans",
		},
		{
			id: 4,
			backgroundColor: "#2B503C",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("elec-artwork-1.jpg"),
				},
				{
					type: "image",
					src: asset("elec-artwork-2.jpg"),
				},
				{
					type: "image",
					src: asset("elec-artwork-3.jpg"),
				},
				{
					type: "image",
					src: asset("elec-artwork-4.jpg"),
				},
				{
					type: "image",
					src: asset("elec-artwork-5.jpg"),
				},
			],
			title: "UK and US Elections artwork",
		},
		{
			id: 12,
			backgroundColor: "#1a1a1a",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("election-1.jpg"),
				},
				{
					type: "image",
					src: asset("election-2.jpg"),
				},
				{
					type: "image",
					src: asset("election-3.jpg"),
				},
				{
					type: "image",
					src: asset("election-4.jpg"),
				},
				{
					type: "image",
					src: asset("election-5.jpg"),
				},
				{
					type: "image",
					src: asset("election-6.jpg"),
				},
				{
					type: "image",
					src: asset("election-7.jpg"),
				},
				{
					type: "image",
					src: asset("election-8.jpg"),
				},
			],
			title: "UK and US Elections UI",
		},
		{
			id: 1,
			backgroundColor: "#B7B7B7",
			textColor: "#000",
			type: "video",
			src: asset("2035-agi.mp4"),
			poster: asset("agi-2035-poster.jpg"),
			title: "AGI 2035",
			url: "https://www.theguardian.com/technology/2024/nov/26/agi-2035-the-guardian-prediction-for-the-future-of-artificial-intelligence",
		},
		{
			id: 5,
			backgroundColor: "#dc2626",
			textColor: "#fff",
			type: "video",
			src: asset("ukraine-skateboarding.mp4"),
			poster: asset("ukraine-skateboarding-poster.jpg"),
			title: "Ukraine Skateboarding",
		},
		{
			id: 6,
			backgroundColor: "#2C1C15",
			textColor: "#fff",
			media: [
				{
					type: "video",
					src: asset("okinawa-1.mp4"),
					poster: asset("okinawa-1-poster.jpg"),
				},
				{
					type: "image",
					src: asset("okinawa-2.png"),
				},
				{
					type: "image",
					src: asset("okinawa-3.png"),
				},
				{
					type: "image",
					src: asset("okinawa-4.png"),
				},
				{
					type: "image",
					src: asset("okinawa-5.png"),
				},
			],
			title: "Okinawa: The bone hunter",
		},
		{
			id: 7,
			backgroundColor: "#091BC5",
			textColor: "#fff",
			media: [
				{
					type: "image",
					src: asset("alex-1.jpg"),
				},
				{
					type: "image",
					src: asset("alex-2.jpg"),
				},
				{
					type: "video",
					src: asset("alex-3.mp4"),
					poster: asset("alex-3-poster.jpg"),
				},
				{
					type: "image",
					src: asset("alex-4.jpg"),
				},
				{
					type: "image",
					src: asset("alex-5.jpg"),
				},
				{
					type: "image",
					src: asset("alex-6.jpg"),
				},
				{
					type: "video",
					src: asset("alex-7.mp4"),
					poster: asset("alex-7-poster.jpg"),
				},
			],
			title: "Alex Mourant website",
		},
		{
			id: 8,
			backgroundColor: "#2C2C26",
			textColor: "#fff",
			type: "video",
			src: asset("press-vest.mp4"),
			poster: asset("press-vest-poster.jpg"),
			title: "The deadly toll on journalists in the Gaza war",
		},
		{
			id: 9,
			backgroundColor: "tomato",
			textColor: "#fff",
			type: "image",
			src: asset("carbon-bombs-world.png"),
			title: "Carbon bombs",
		},
		{
			id: 10,
			backgroundColor: "#2C2C26",
			textColor: "#fff",
			type: "image",
			src: asset("fedrigoni-cal.jpg"),
			title: "Fedrigoni Calendar 2025",
		},
	];

	const finishLoading = () => {
		if (!isLoading) return;
		isFading = true;
		setTimeout(() => {
			isLoading = false;
		}, 300);
	};

	onMount(() => {
		if (document.readyState === "complete") {
			finishLoading();
			return;
		}

		const handleLoad = () => {
			finishLoading();
		};

		window.addEventListener("load", handleLoad, { once: true });
		return () => window.removeEventListener("load", handleLoad);
	});
</script>

{#if isLoading}
	<div class="loading-screen" class:is-fading={isFading} aria-live="polite">
		<div class="loading-text">
			Loading<span class="loading-dots" aria-hidden="true"></span>
		</div>
	</div>
{/if}

<ScrollGallery {items} />

<style lang="scss">
	@use "./styles/main.scss" as *;
</style>
