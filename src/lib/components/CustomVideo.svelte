<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import { generateId, isBrowser } from '../utils/index.js';
	import type { CustomVideoProps } from '../types/index.js';

	type $$Props = CustomVideoProps & {
		children?: Snippet;
	};

	let {
		src,
		customPlayer,
		playerConfig,
		onPlayerReady,
		poster,
		autoplay = false,
		controls = true,
		loop = false,
		muted = false,
		preload = 'auto',
		width = '100%',
		height = 'auto',
		crossorigin = 'anonymous',
		playsinline = false,
		class: customClass = '',
		children,
		...restProps
	}: $$Props = $props();

	let containerEl = $state<HTMLDivElement | null>(null);
	let videoEl = $state<HTMLVideoElement | null>(null);
	let player = $state<any | null>(null);
	let videoId = $state<string>(generateId('custom-video'));

	async function initCustomPlayer() {
		if (!isBrowser() || !customPlayer) return;

		try {
			// Initialize custom player
			if (typeof customPlayer === 'function') {
				// If customPlayer is a constructor or factory function
				player = new customPlayer(containerEl || videoEl, {
					src,
					poster,
					autoplay,
					controls,
					loop,
					muted,
					preload,
					width,
					height,
					crossorigin,
					playsinline,
					...playerConfig
				});
			} else if (typeof customPlayer === 'object' && customPlayer.init) {
				// If customPlayer is an object with init method
				player = await customPlayer.init(containerEl || videoEl, {
					src,
					poster,
					autoplay,
					controls,
					loop,
					muted,
					preload,
					width,
					height,
					crossorigin,
					playsinline,
					...playerConfig
				});
			}

			// Call onPlayerReady callback if provided
			if (onPlayerReady && player) {
				onPlayerReady(player);
			}

			// Dispatch ready event
			containerEl?.dispatchEvent(new CustomEvent('ready', { detail: { player } }));
		} catch (error) {
			console.error('Failed to initialize custom player:', error);
			containerEl?.dispatchEvent(
				new CustomEvent('error', {
					detail: { error: error instanceof Error ? error.message : 'Unknown error' }
				})
			);
		}
	}

	onMount(() => {
		initCustomPlayer();
	});

	onDestroy(() => {
		if (player) {
			try {
				// Try common destroy/dispose methods
				if (typeof player.destroy === 'function') {
					player.destroy();
				} else if (typeof player.dispose === 'function') {
					player.dispose();
				} else if (typeof player.remove === 'function') {
					player.remove();
				}
			} catch (error) {
				console.error('Error destroying custom player:', error);
			}
		}
	});

	$effect(() => {
		if (player && src) {
			// Try to update source if player has loadSource or similar method
			if (typeof player.loadSource === 'function') {
				player.loadSource(src);
			} else if (typeof player.load === 'function') {
				player.load(src);
			} else if (typeof player.src === 'function') {
				player.src(src);
			}
		}
	});

	export function getPlayer() {
		return player;
	}

	export function getVideoElement() {
		return videoEl;
	}

	export function getContainerElement() {
		return containerEl;
	}

	export async function play() {
		if (player && typeof player.play === 'function') {
			await player.play();
		} else if (videoEl) {
			await videoEl.play();
		}
	}

	export function pause() {
		if (player && typeof player.pause === 'function') {
			player.pause();
		} else if (videoEl) {
			videoEl.pause();
		}
	}
</script>

<div bind:this={containerEl} id={`${videoId}-container`} class={customClass}>
	{#if !customPlayer}
		<!-- Fallback to native video element if no custom player provided -->
		<video
			bind:this={videoEl}
			id={videoId}
			{src}
			{poster}
			{autoplay}
			{controls}
			{loop}
			{muted}
			{preload}
			{width}
			{height}
			{crossorigin}
			{playsinline}
			{...restProps}
		>
			{@render children?.()}
			<track kind="captions" />
		</video>
	{:else}
		<!-- Custom player will be initialized in the container -->
		<div id={videoId} data-custom-player="true">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	div {
		width: 100%;
	}

	video {
		max-width: 100%;
		height: auto;
	}

	div[data-custom-player='true'] {
		width: 100%;
		min-height: 200px;
	}
</style>
