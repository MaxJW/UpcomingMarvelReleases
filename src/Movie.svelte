<script>
	import Countdown from 'svelte-countdown/src/index.js';
	import dayjs from 'dayjs';

	export let title;
	export let date;
	export let length;
	export let poster;
	export let thumbnail;
	export let tv;
	export let disneyplus;
	let w;
	$: console.log(w);
</script>

<svelte:window bind:innerWidth={w} />

<div class="tile">
	<div class="dual-container">
		<div
			class="background"
			style="background-image:linear-gradient({w > 429
				? '90deg'
				: '270deg'}, rgba(14,14,14,0.98) 35%, rgba(255,255,255,0) 100%),url('{thumbnail}')"
		/>
		<img src={poster} alt={title} class="poster" />
		<div class="text">
			<h2>{title}</h2>
			<h4>{dayjs(date).format('MMMM D, YYYY')}</h4>
			<p class="film-length">{length} {tv ? 'episodes' : 'min'}</p>
			<a href="https://www.imdb.com/find?q={title}"
				><i class="fa-brands fa-imdb fa-2xl" /></a
			>
			{#if disneyplus}
				<a class="link-play" href={disneyplus}
					><i class="fa-solid fa-circle-play fa-xl" /></a
				>
			{/if}
		</div>
	</div>
	<Countdown from={date} dateFormat="YYYY-MM-DD[T]HH:mm:ss[Z]" let:remaining>
		{#if remaining.done === false}
			<p class="countdown">
				{#if remaining.years > 0}
					{remaining.years}
					{remaining.years > 1 ? 'years' : 'year'},
					{remaining.months}
					{remaining.months > 1 ? 'months' : 'month'},
					{remaining.weeks}
					{remaining.weeks > 1 ? 'weeks' : 'week'}
				{:else if remaining.months > 0}
					{remaining.months}
					{remaining.months > 1 ? 'months' : 'month'},
					{remaining.weeks}
					{remaining.weeks > 1 ? 'weeks' : 'week'},
					{remaining.days}
					{remaining.days > 1 ? 'days' : 'day'}
				{:else if remaining.weeks > 0}
					{remaining.weeks}
					{remaining.weeks > 1 ? 'weeks' : 'week'},
					{remaining.days}
					{remaining.days > 1 ? 'days' : 'day'},
					{remaining.hours}
					{remaining.hours > 1 ? 'hours' : 'hour'}
				{:else if remaining.days > 0}
					{remaining.days}
					{remaining.days > 1 ? 'days' : 'day'},
					{remaining.hours}
					{remaining.hours > 1 ? 'hours' : 'hour'},
					{remaining.minutes}
					{remaining.minutes > 1 ? 'minutes' : 'minute'}
				{:else if remaining.hours > 0}
					{remaining.hours}
					{remaining.hours > 1 ? 'hours' : 'hour'},
					{remaining.minutes}
					{remaining.minutes > 1 ? 'minutes' : 'minute'},
					{remaining.seconds}
					{remaining.seconds > 1 ? 'seconds' : 'second'}
				{:else if remaining.minutes > 0}
					{remaining.minutes}
					{remaining.minutes > 1 ? 'minutes' : 'minute'},
					{remaining.seconds}
					{remaining.seconds > 1 ? 'seconds' : 'second'}
				{:else if remaining.seconds > 0}
					{remaining.seconds}
					{remaining.seconds > 1 ? 'seconds' : 'second'}
				{/if}
			</p>
		{/if}
	</Countdown>
</div>

<style>
	/* rounded background with white glowing border and image background */
	.tile {
		border-radius: 10px;
		position: relative;
		overflow: hidden;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		margin: auto;
		margin-bottom: 20px;
		width: 90%;
		height: 20vh;

		box-sizing: border-box;
		padding: 20px;
	}

	.background {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-color: #000;
		transition: all 0.5s ease;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.tile:hover .background {
		-webkit-transform: scale(1.1, 1.1);
		transform: scale(1.1, 1.1);
	}

	.poster {
		height: 100%;
		min-width: 2vw;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
		object-fit: cover;
		margin-right: 20px;
		image-rendering: auto;

		float: left;
	}

	h2,
	h4,
	p {
		margin-block: 0;
	}

	h2 {
		color: #fff;
		font-weight: 400;
		margin-block-start: 0;
		font-family: 'Montserrat', helvetica, arial, sans-serif;
		font-size: 1.5rem;
	}

	h4 {
		font-weight: 200;
	}

	a {
		color: white;
		text-decoration: none;
	}

	.text {
		line-height: 1.2;
	}

	.film-length,
	.link-play {
		display: inline-block;
		margin-top: 10px;
		color: #fff;
		border-radius: 5px;
		font-size: 0.9rem;
	}

	.film-length {
		padding: 5px;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.link-play {
		padding: 3px;
		border: 1px solid rgba(255, 255, 255, 0.7);
	}

	.countdown {
		color: #fff;
		font-weight: 300;
		font-family: 'Roboto Mono', monospace;
		margin-top: 10px;
	}

	.dual-container {
		display: initial;
	}

	@media (max-width: 429px) {
		.tile {
			height: 30vh;
		}

		.poster {
			max-width: 30vw;
			height: auto;
		}

		.dual-container {
			display: block;
			overflow: auto;
		}
	}
</style>
