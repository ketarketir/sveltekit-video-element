<script lang="ts">
	import '../app.css';

	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Sveltekit Video Element</title>
	<meta name="description" content="Sveltekit Video Element" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<div class="container space-x-6 w-full max-w-5xl min-h-screen max-h-screen mx-auto">
	<header class="sticky top-0 z-10 bg-white">
		<div class="container flex items-center justify-between p-4">
			<div class="text-2xl font-bold">Sveltekit Video Element</div>
			<div class="flex items-center justify-center gap-2">
				<a
					href="https://github.com/ketarketir/sveltekit-video-element"
					target="_blank"
					rel="noopener noreferrer"
					role="button"
					tabindex="0"
					aria-label="GitHub"
					class="flex items-center justify-center p-2 gap-2 border border-black rounded-md hover:bg-black hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="fill-current size-5"
						><path
							fill="currentColor"
							d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
						/></svg
					>
				</a>
				<a
					href="https://www.npmjs.com/package/sveltekit-video-element"
					target="_blank"
					rel="noopener noreferrer"
					role="button"
					tabindex="0"
					aria-label="NPM"
					class="flex items-center justify-center p-2 gap-2 border border-red-500 rounded-md hover:bg-red-500/30 hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="256"
						height="256"
						viewBox="0 0 256 256"
						class="fill-current size-5"
						><path fill="#c12127" d="M0 256V0h256v256z" /><path
							fill="#fff"
							d="M48 48h160v160h-32V80h-48v128H48z"
						/></svg
					>
				</a>
			</div>
		</div>
	</header>

	{@render children()}
</div>
