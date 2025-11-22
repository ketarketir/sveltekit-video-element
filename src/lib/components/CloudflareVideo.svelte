<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { generateId, isBrowser, buildCloudflareStreamUrl, loadScript } from '../utils/index.js';
	import type { CloudflareVideoProps } from '../types/index.js';

	type $$Props = CloudflareVideoProps;

	let {
		src,
		videoId,
		accountId,
		streamUrl,
		signedUrl,
		thumbnailTime,
		poster,
		autoplay = false,
		controls = true,
		loop = false,
		muted = false,
		preload = 'metadata',
		width = '100%',
		height = 'auto',
		playsinline = false,
		crossorigin = 'anonymous',
		children,
		...restProps
	}: $$Props & {
		children?: Snippet;
	} = $props();

	let streamEl = $state<HTMLVideoElement | null>(null);
	let containerId = $state<string>(generateId('cloudflare-stream'));
	let videoSrc = $derived(
		src ||
			streamUrl ||
			(videoId && accountId
				? buildCloudflareStreamUrl(accountId, videoId, { signedUrl })
				: undefined)
	);
	let posterUrl = $derived(
		poster ||
			(videoId && accountId && thumbnailTime !== undefined
				? `https://customer-${accountId}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=${thumbnailTime}s`
				: videoId && accountId
					? `https://customer-${accountId}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`
					: undefined)
	);

	onMount(async () => {
		if (isBrowser()) {
			try {
				await loadScript(
					'https://embed.cloudflarestream.com/embed/sdk.latest.js',
					'cloudflare-stream-sdk'
				);
			} catch (error) {
				console.error('Failed to load Cloudflare Stream SDK:', error);
			}
		}
	});

	export function getVideoElement() {
		return streamEl;
	}

	export async function play() {
		if (streamEl) {
			await streamEl.play();
		}
	}

	export function pause() {
		if (streamEl) {
			streamEl.pause();
		}
	}
</script>

{#if isBrowser() && videoId && accountId}
	<stream
		bind:this={streamEl}
		id={containerId}
		src={videoId}
		{controls}
		{autoplay}
		{loop}
		{muted}
		{preload}
		{width}
		{height}
		{poster}
		ad-url={restProps['ad-url' as keyof typeof restProps] || undefined}
		preload-time={restProps['preload-time' as keyof typeof restProps] || undefined}
		default-text-track={restProps['default-text-track' as keyof typeof restProps] || undefined}
		class={restProps.class || ''}
		{...restProps}
	></stream>
{:else}
	<video
		bind:this={streamEl}
		id={containerId}
		src={videoSrc}
		poster={posterUrl}
		{autoplay}
		{controls}
		{loop}
		{muted}
		{preload}
		{width}
		{height}
		{crossorigin}
		{playsinline}
		class={restProps.class || ''}
		onloadstart={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('loadstart', { detail: e }));
		}}
		onplay={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('play', { detail: e }));
		}}
		onpause={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('pause', { detail: e }));
		}}
		onended={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('ended', { detail: e }));
		}}
		ontimeupdate={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('timeupdate', { detail: e }));
		}}
		onvolumechange={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('volumechange', { detail: e }));
		}}
		onseeking={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('seeking', { detail: e }));
		}}
		onseeked={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('seeked', { detail: e }));
		}}
		onwaiting={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('waiting', { detail: e }));
		}}
		ondurationchange={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('durationchange', { detail: e }));
		}}
		onprogress={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('progress', { detail: e }));
		}}
		onerror={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('error', { detail: e }));
		}}
		onloadedmetadata={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('loadedmetadata', { detail: e }));
		}}
		onloadeddata={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('loadeddata', { detail: e }));
		}}
		oncanplay={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('canplay', { detail: e }));
		}}
		oncanplaythrough={(e: any) => {
			streamEl?.dispatchEvent(new CustomEvent('canplaythrough', { detail: e }));
		}}
		{...restProps}
	>
		{@render children?.()}
		<track kind="captions" />
	</video>
{/if}

<style>
	video,
	stream {
		max-width: 100%;
		height: auto;
	}
</style>
