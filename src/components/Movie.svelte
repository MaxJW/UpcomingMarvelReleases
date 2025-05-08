<script lang="ts">
    import dayjs from 'dayjs';
    import { onMount, onDestroy } from 'svelte';
    import duration from 'dayjs/plugin/duration.js';
    import relativeTime from 'dayjs/plugin/relativeTime';
    import type { MarvelRelease } from '../types';

    // Define proper TypeScript interface for props
    export let title: string;
    export let date: string | null;
    export let runtime: string;
    export let poster: string;
    export let disneyplus: string;
    export let latest: boolean = false;

    // Configure dayjs plugins
    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    // Setup reactive variables
    let posterWidth: number;
    let countdownTimer: ReturnType<typeof setInterval> | null = null;

    // Define a type for the countdown data
    type CountdownData = {
        years: number;
        months: number;
        weeks: number;
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    };

    let remaining: CountdownData | 'Loading...' = 'Loading...';

    // Setup reactive declarations for date handling
    $: releaseDate = date ? dayjs(date) : null;
    $: isValid = releaseDate && releaseDate.isValid();
    $: isReleased = isValid ? releaseDate.valueOf() <= dayjs().valueOf() : false;
    $: contentType = runtime.includes('episode') ? 'TV Show' : 'Movie';
    $: formattedDate = isValid ? releaseDate.format('MMMM D, YYYY') : 'To Be Announced';
    $: isTBA = !releaseDate || !isValid;

    function updateCountdown() {
        if (!isValid || isReleased) {
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
            return;
        }

        const now = dayjs();
        const diff = releaseDate.valueOf() - now.valueOf();

        if (diff <= 0) {
            isReleased = true;
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
            return;
        }

        const r = dayjs.duration(diff);
        const weeks = Math.floor(r.days() / 7);
        const days = r.days() - weeks * 7;

        remaining = {
            years: r.years(),
            months: r.months(),
            weeks: weeks,
            days: days,
            hours: r.hours(),
            minutes: r.minutes(),
            seconds: r.seconds(),
        };
    }

    onMount(() => {
        updateCountdown();
        if (!isReleased && !isTBA) {
            countdownTimer = setInterval(updateCountdown, 1000);
        }
    });

    onDestroy(() => {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
    });
</script>

<div class="tile" role="article" aria-labelledby="title-{title.replace(/\s+/g, '-')}">
    <div class="poster-container" class:latest bind:clientWidth={posterWidth}>
        <a
            href={disneyplus ? disneyplus : '#/'}
            aria-label={disneyplus ? `Watch ${title} on Disney+` : `${title} poster`}
            class:no-link={!disneyplus}
        >
            <img src={poster} alt="{title} poster" class="poster" />
            {#if disneyplus}
                <div class="overlay" aria-hidden="true">
                    <i class="fa-solid fa-circle-play fa-4x" />
                </div>
            {/if}
        </a>
    </div>

    <div class="details" style="padding-left: calc({posterWidth}px + var(--additional-padding))">
        {#if latest}
            <div class="latest-banner" aria-label="Latest Release">
                <span>Latest Release!</span>
            </div>
        {/if}

        <div class="info">
            <h2 id="title-{title.replace(/\s+/g, '-')}">{title}</h2>
            <h4>{formattedDate}</h4>

            <div class="blocks">
                {#if runtime !== '0' && runtime !== '0 episodes'}
                    <p class="film-length">{runtime}</p>
                {/if}
                <p class="film-type">{contentType}</p>
            </div>
        </div>

        <div class="countdown-container" aria-live="polite">
            {#if isReleased}
                <p>Out now!</p>
            {:else if isTBA}
                <p>To Be Announced</p>
            {:else if remaining !== 'Loading...'}
                <p class="countdown">
                    {#if remaining.years > 0}
                        {remaining.years}
                        {remaining.years === 1 ? 'year' : 'years'},
                        {remaining.months}
                        {remaining.months === 1 ? 'month' : 'months'},
                        {remaining.weeks}
                        {remaining.weeks === 1 ? 'week' : 'weeks'}
                    {:else if remaining.months > 0}
                        {remaining.months}
                        {remaining.months === 1 ? 'month' : 'months'},
                        {remaining.weeks}
                        {remaining.weeks === 1 ? 'week' : 'weeks'},
                        {remaining.days}
                        {remaining.days === 1 ? 'day' : 'days'}
                    {:else if remaining.weeks > 0}
                        {remaining.weeks}
                        {remaining.weeks === 1 ? 'week' : 'weeks'},
                        {remaining.days}
                        {remaining.days === 1 ? 'day' : 'days'},
                        {remaining.hours}
                        {remaining.hours === 1 ? 'hour' : 'hours'}
                    {:else if remaining.days > 0}
                        {remaining.days}
                        {remaining.days === 1 ? 'day' : 'days'},
                        {remaining.hours}
                        {remaining.hours === 1 ? 'hour' : 'hours'},
                        {remaining.minutes}
                        {remaining.minutes === 1 ? 'minute' : 'minutes'}
                    {:else if remaining.hours > 0}
                        {remaining.hours}
                        {remaining.hours === 1 ? 'hour' : 'hours'},
                        {remaining.minutes}
                        {remaining.minutes === 1 ? 'minute' : 'minutes'},
                        {remaining.seconds}
                        {remaining.seconds === 1 ? 'second' : 'seconds'}
                    {:else if remaining.minutes > 0}
                        {remaining.minutes}
                        {remaining.minutes === 1 ? 'minute' : 'minutes'},
                        {remaining.seconds}
                        {remaining.seconds === 1 ? 'second' : 'seconds'}
                    {:else if remaining.seconds > 0}
                        {remaining.seconds} {remaining.seconds === 1 ? 'second' : 'seconds'}
                    {/if}
                </p>
            {:else}
                <p>Calculating release date...</p>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Using CSS variables for consistent styling and easier maintenance */
    :root {
        --poster-shadow: 0 6px 10px rgba(0, 0, 0, 0.25);
        --border-radius: 10px;
        --transition-speed: 0.4s;
        --yellow-accent: #ffd310;
    }

    .tile {
        height: 200px;
        width: 100%;
        margin-bottom: 40px;
        position: relative;
        transition: all 0.2s;
        border-radius: var(--border-radius);
    }

    .details {
        width: 99%;
        height: 80%;
        position: absolute;
        bottom: 0;
        padding: 3px;
        border-radius: var(--border-radius);
        box-shadow: var(--poster-shadow);
        box-sizing: border-box;
        margin-left: 1px; /* Removes pixel corner in poster */
        background: var(--background);
        --additional-padding: 10px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .countdown-container {
        margin-top: auto;
    }

    .countdown {
        margin: 0;
    }

    .details h2,
    .details h4,
    .details p {
        margin: 0;
    }

    .poster-container {
        height: 100%;
        width: auto;
        max-width: 32vw;
        position: absolute;
        bottom: 0;
        z-index: 2;
        box-sizing: border-box;
        border-radius: var(--border-radius);
        box-shadow: var(--poster-shadow);
        overflow: hidden;
        transform: translateZ(0);
        -webkit-transform: translate3d(0, 0, 0);
    }

    .poster {
        height: 100%;
        object-fit: cover;
        display: block;
        transition: all var(--transition-speed) ease;
        user-select: none;
    }

    .poster-container:hover .poster {
        transform: scale(1.2);
    }

    .poster-container a {
        z-index: 1;
        color: black;
    }

    .no-link {
        pointer-events: none;
        cursor: default;
        text-decoration: none;
    }

    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        color: #dbdbdb;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all var(--transition-speed) ease;
    }

    .poster-container:hover .overlay {
        opacity: 1;
    }

    .blocks {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .blocks p {
        padding: 5px;
        border: 1px solid var(--text-muted);
        display: inline-block;
        color: var(--text-main);
        border-radius: 5px;
        font-size: 0.9rem;
        margin-right: 5px;
    }

    .latest-banner {
        position: absolute;
        top: -20px;
        z-index: 3;
        background-color: var(--yellow-accent);
        border-radius: 20px;
        padding: 0.24rem 0.64rem;
        font-weight: 700;
        user-select: none;
    }

    .latest-banner span {
        font-size: 16px;
        margin: 0;
        color: #000;
    }

    /* Media queries simplified and organized better */
    @media (min-width: 1024px) {
        .tile {
            height: 350px;
        }

        .blocks {
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .details h4 {
            font-size: 1.2em;
        }

        .details h2 {
            font-size: 2em;
        }

        .details {
            padding: 20px;
            --additional-padding: 20px;
        }

        .poster-container {
            max-width: 236.22px;
        }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
        .tile {
            height: 300px;
        }

        .details {
            padding: 10px;
        }

        .poster-container {
            max-width: 202.47px;
        }
    }

    @media (min-width: 480px) and (max-width: 767px) {
        .tile {
            height: 250px;
        }

        .details {
            padding: 10px;
        }

        .poster-container {
            max-width: 168.72px;
        }
    }

    @media (max-width: 479px) {
        .tile {
            height: 200px;
        }

        .details h4 {
            font-size: 0.8em;
        }

        .details h2 {
            font-size: 1.2em;
        }

        .details {
            padding: 10px;
        }

        .poster-container {
            max-width: 134.97px;
        }
    }

    @media (max-width: 280px) {
        .tile {
            height: 150px;
        }

        .poster-container {
            max-width: 101.22px;
        }
    }
</style>
