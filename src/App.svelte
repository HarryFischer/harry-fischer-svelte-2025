<script>
	import { backIn } from "svelte/easing";
	import ScrollGallery from "./lib/ScrollGallery.svelte";

	// Use Vite's BASE_URL to construct proper asset paths for GitHub Pages
	const baseUrl = import.meta.env.BASE_URL;
	const asset = (path) => `${baseUrl}assets/${path}`;

	const items = [
		{
			id: 1,
			backgroundColor: "#FFED48",
			textColor: "#000",
			type: "video",
			src: asset("agi-2035.mp4"),
			poster: asset("agi-2035-poster.jpg"),
			title: "AGI 2035",
			url: "https://www.theguardian.com/technology/2024/nov/26/agi-2035-the-guardian-prediction-for-the-future-of-artificial-intelligence",
		},
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
			id: 4,
			backgroundColor: "#606060",
			textColor: "#fff",
			type: "image",
			src: asset("elections-1.jpg"),
			title: "UK and US Elections 2024",
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
</script>

<ScrollGallery {items} />

<style lang="scss">
	@use "./styles/main.scss" as *;
</style>
