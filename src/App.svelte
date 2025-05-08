<script lang="ts">
    import Timeline from './components/Timeline.svelte';
</script>

<main>
    <header>
        <div id="logo">
            <h1>Upcoming</h1>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/2560px-Marvel_Logo.svg.png"
                alt="Marvel Logo"
            />
            <h1>Releases</h1>
        </div>
        <p id="subtitle">
            A small project maintained by <a href="https://maxwilson.co.uk/">Max Wilson</a>
        </p>
    </header>

    <Timeline />

    <footer>
        <p>
            This is an unofficial fan project. Marvel and all related characters are property of
            Marvel Entertainment, LLC.
        </p>
    </footer>
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
    }

    header {
        margin-bottom: 40px;
        text-align: center;
    }

    #logo {
        display: flex;
        margin: auto;
        width: 100%;
        height: auto;
        margin-bottom: 10px;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    #logo img {
        width: 25%;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        margin-left: 1em;
        margin-right: 1em;
    }

    #logo h1 {
        margin: 0;
        font-size: 2rem;
    }

    #subtitle {
        margin: 0;
        width: 100%;
        margin-bottom: 40px;
        text-align: center;
        color: rgb(199, 199, 199);
    }

    #subtitle a {
        font-weight: bold;
        text-decoration: none;
        color: inherit;
        transition: color 0.2s;
    }

    #subtitle a:hover {
        color: white;
    }

    footer {
        margin-top: 60px;
        text-align: center;
        font-size: 0.8rem;
        color: var(--text-muted);
    }
</style>
