<script lang="ts">
    import dayjs from 'dayjs';
    import { onMount } from 'svelte';
    import duration from 'dayjs/plugin/duration.js';
    import relativeTime from 'dayjs/plugin/relativeTime';

    export let title: string;
    export let date: string;
    export let length: string;
    export let poster: string;
    export let tv: boolean;
    export let disneyplus: string;
    export let latest: boolean = false;

    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    let r, local, timer, w, posterWidth;
    let diff: number = 0;
    let dateFormat: string = 'YYYY-MM-DD[T]HH:mm:ss[Z]';
    let target = dayjs(date, dateFormat);
    let done: boolean = false;
    let remaining: string | any = 'Loading...';

    function getRemaining() {
        if (diff > 0) {
            r = dayjs.duration(diff);
            let week = Math.floor(r.days() / 7);
            let day = r.days() - week * 7;
            remaining = {
                years: r.years(),
                months: r.months(),
                weeks: week,
                days: day,
                hours: r.hours(),
                minutes: r.minutes(),
                seconds: r.seconds(),
            };
            diff -= 1000;
        } else {
            done = true;
            clearInterval(timer);
        }
    }

    if (dayjs.isDayjs(target)) {
        local = dayjs();
        diff = target.valueOf() - local.valueOf();
    }

    onMount(async () => {
        getRemaining();
        timer = setInterval(getRemaining, 1000);
    });
</script>

<svelte:window bind:innerWidth={w} />

<div class="tile">
    <div class="poster-container" class:latest bind:clientWidth={posterWidth}>
        <a href={disneyplus ? disneyplus : '#/'}>
            <img src={poster} alt={title} class="poster" />
        </a>
        {#if disneyplus}
            <div class="overlay">
                <i class="fa-solid fa-circle-play fa-4x" />
            </div>
        {/if}
    </div>
    <div class="details" style="padding-left: calc({posterWidth}px + var(--additional-padding))">
        {#if latest}
            <div class="latest-banner">
                <h3>Latest Release!</h3>
            </div>
        {/if}
        <h2>{title}</h2>
        <h4>{dayjs(date).format('MMMM D, YYYY')}</h4>
        <div class="blocks">
            <p class="film-length">
                {length != '0' ? length + (tv ? ' episodes' : '') : 'Unknown'}
            </p>
        </div>
        {#if done === false}
            <p class="countdown">
                {#if remaining.years > 0}
                    {remaining.years + ' years'},
                    {remaining.months + ' months'},
                    {remaining.weeks + ' weeks'}
                {:else if remaining.months > 0}
                    {remaining.months + ' months'},
                    {remaining.weeks + ' weeks'},
                    {remaining.days + ' days'}
                {:else if remaining.weeks > 0}
                    {remaining.weeks + ' weeks'},
                    {remaining.days + ' days'},
                    {remaining.hours + ' hours'}
                {:else if remaining.days > 0}
                    {remaining.days + ' days'},
                    {remaining.hours + ' hours'},
                    {remaining.minutes + ' minutes'}
                {:else if remaining.hours > 0}
                    {remaining.hours + ' hours'},
                    {remaining.minutes + ' minutes'},
                    {remaining.seconds + ' seconds'}
                {:else if remaining.minutes > 0}
                    {remaining.minutes + ' minutes'},
                    {remaining.seconds + ' seconds'}
                {:else if remaining.seconds > 0}
                    {remaining.seconds + ' seconds'}
                {/if}
            </p>
        {:else}
            <p>Out now!</p>
        {/if}
    </div>
</div>

<style>
    .tile {
        height: 200px;
        width: 100%;
        margin-bottom: 40px;
        position: relative;
        transition: all 0.2s;
        border-radius: 10px;
    }

    .details {
        width: 99%;
        height: 80%;
        position: absolute;
        bottom: 0;
        padding: 3px;
        border-radius: 10px;
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
        box-sizing: border-box;
        margin-left: 1px; /* Removes pixel corner in poster */
        background: var(--background);
        --additional-padding: 10px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .countdown {
        margin-top: auto !important;
    }

    .details h2,
    .details h4,
    .details p {
        margin-block-start: 0;
        margin-block-end: 0;
        margin-inline-start: 0;
        margin-inline-end: 0;
    }

    .poster-container {
        height: 100%;
        width: auto;
        max-width: 32vw;
        position: absolute;
        bottom: 0;
        z-index: 9999;
        box-sizing: border-box;
        border-radius: 10px;
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        transform: translate3d(0, 0, 0);
        -webkit-transform: translate3d(0, 0, 0);
    }

    .poster {
        height: 100%;
        object-fit: cover;
        display: block;
        transition: all 0.4s ease;
        -khtml-user-select: none;
        -o-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
    }

    .poster-container:hover .poster {
        transform: scale(1.2);
    }

    .poster-container a {
        z-index: 8;
        color: black;
    }

    [href='#/'] {
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
        cursor: default;
        text-decoration: none;
        color: #dbdbdb;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all 0.4s ease;
    }

    .poster-container:hover .overlay {
        opacity: 1;
    }

    .blocks {
        margin-top: 5px !important;
        margin-bottom: 5px !important;
    }

    .film-length {
        padding: 5px;
        border: 1px solid var(--text-muted);
        display: inline-block;
        color: var(--text-main);
        border-radius: 5px;
        font-size: 0.9rem;
    }

    .latest-banner {
        position: absolute;
        top: -20px;
        z-index: 99999;
        background-color: #ffd310;
        border-radius: 20px;
        padding: 0.22rem 0.6rem;
        font-weight: 700;
        user-select: none;
    }

    .latest-banner h3 {
        margin: 0;
        color: #000;
    }

    /* Desktop */
    @media all and (min-width: 1024px) {
        .tile {
            height: 350px;
        }

        .blocks {
            margin-top: 10px !important;
            margin-bottom: 10px !important;
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

    /* Tablet Landscape */
    @media all and (min-width: 768px) and (max-width: 1024px) {
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

    /* Tablet */
    @media all and (min-width: 480px) and (max-width: 768px) {
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

    /* Phone landscape & smaller */
    @media all and (max-width: 480px) {
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

    /* Phone landscape & smaller */
    @media all and (max-width: 280px) {
        .tile {
            height: 150px;
        }

        .poster-container {
            max-width: 101.22px;
        }
    }
</style>
