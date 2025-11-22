<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import { generateId, isBrowser } from '../utils/index.js';
	import type { DashVideoProps } from '../types/index.js';

	type $$Props = DashVideoProps;

	let {
		src,
		dashConfig = {},
		controls = true,
		autoplay = false,
		preload = 'metadata',
		loop = false,
		muted = false,
		poster,
		width = '100%',
		height = 'auto',
		playsinline = false,
		crossorigin = 'anonymous',
		class: playerClass,
		children,
		...restProps
	}: $$Props & {
		children?: Snippet;
	} = $props();

	let videoEl = $state<HTMLVideoElement | null>(null);
	let player = $state<any | null>(null);
	let videoId = $state<string>(generateId('dash-video'));

	async function initDash() {
		if (!isBrowser() || !src) return;

		try {
			const dashjs = await import('dashjs');

			player = dashjs.MediaPlayer().create();

			if (dashConfig) {
				if (dashConfig.streaming) {
					player.updateSettings({
						streaming: dashConfig.streaming
					});
				}
				if (dashConfig.debug) {
					player.updateSettings({
						debug: dashConfig.debug
					});
				}
			}

			player.initialize(videoEl, src, autoplay);

			// Forward DASH events
			player.on('error', (e: any) => {
				console.error('DASH error:', e);
				videoEl?.dispatchEvent(
					new CustomEvent('dasherror', {
						detail: { error: e.error, event: e }
					})
				);
			});

			player.on('manifestLoaded', (e: any) => {
				videoEl?.dispatchEvent(new CustomEvent('dashmanifestloaded', { detail: e }));
			});

			player.on('streamInitialized', (e: any) => {
				videoEl?.dispatchEvent(new CustomEvent('dashstreaminitialized', { detail: e }));
			});

			player.on('qualityChangeRendered', (e: any) => {
				videoEl?.dispatchEvent(new CustomEvent('dashqualitychanged', { detail: e }));
			});

			player.on('bufferLoaded', (e: any) => {
				videoEl?.dispatchEvent(new CustomEvent('dashbufferloaded', { detail: e }));
			});

			player.on('fragmentLoadingCompleted', (e: any) => {
				videoEl?.dispatchEvent(new CustomEvent('dashfragmentloaded', { detail: e }));
			});
		} catch (error) {
			console.error('Failed to initialize DASH:', error);
			videoEl?.dispatchEvent(
				new CustomEvent('error', {
					detail: { error: error instanceof Error ? error.message : 'Unknown error' }
				})
			);
		}
	}

	onMount(() => {
		initDash();
	});

	onDestroy(() => {
		if (player) {
			try {
				player.reset();
			} catch (error) {
				console.error('Error destroying DASH player:', error);
			}
		}
	});

	$effect(() => {
		if (isBrowser() && src && player) {
			player.attachSource(src);
		}
	});

	export function getPlayer() {
		return player;
	}

	export function getVideoElement() {
		return videoEl;
	}

	export async function play() {
		if (videoEl) {
			await videoEl.play();
		}
	}

	export function pause() {
		if (videoEl) {
			videoEl.pause();
		}
	}

	export function getBitrateInfoListFor(type: 'video' | 'audio') {
		if (player) {
			return player.getBitrateInfoListFor(type);
		}
		return [];
	}

	export function setQualityFor(type: 'video' | 'audio', index: number) {
		if (player) {
			player.setQualityFor(type, index);
		}
	}

	export function getQualityFor(type: 'video' | 'audio') {
		if (player) {
			return player.getQualityFor(type);
		}
		return -1;
	}

	export function setAutoSwitchQualityFor(type: 'video' | 'audio', value: boolean) {
		if (player) {
			player.setAutoSwitchQualityFor(type, value);
		}
	}
</script>

<video
	bind:this={videoEl}
	id={videoId}
	{poster}
	{controls}
	{loop}
	{muted}
	{preload}
	{width}
	{height}
	{crossorigin}
	{playsinline}
	class={playerClass || ''}
	{...restProps}
>
	{@render children?.()}
	<track kind="captions" />
</video>

<style>
	video {
		max-width: 100%;
		height: auto;
	}
</style>
