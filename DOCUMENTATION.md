# SvelteKit Video Elements - Interactive Documentation

Complete documentation with live examples for all video components.

## 📚 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
  - [HLS Video](#hls-video)
  - [Mux Video](#mux-video)
  - [JW Player Video](#jw-player-video)
  - [Cloudflare Stream](#cloudflare-stream)
  - [Video.js](#videojs)
  - [DASH Video](#dash-video)
  - [Cloudinary Video](#cloudinary-video)
  - [Custom Video](#custom-video)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)

---

## Installation

```bash
npm install sveltekit-video-element
```

## Quick Start

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';
</script>

<HlsVideo src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" controls autoplay />
```

---

## Components

### HLS Video

HTTP Live Streaming with hls.js integration. Perfect for adaptive bitrate streaming.

#### Basic Example

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';
</script>

<HlsVideo
	src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
	controls
	autoplay
	poster="https://image.mux.com/x36xhzz/thumbnail.jpg"
/>
```

#### Advanced Example with Quality Selector

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';

	let videoRef;
	let levels = [];
	let currentLevel = -1;

	function handleManifestParsed() {
		if (videoRef) {
			levels = videoRef.getLevels();
			currentLevel = videoRef.getCurrentLevel();
		}
	}

	function changeQuality(event) {
		const level = parseInt(event.target.value);
		if (videoRef) {
			videoRef.setCurrentLevel(level);
			currentLevel = level;
		}
	}
</script>

<div class="video-container">
	<HlsVideo
		bind:this={videoRef}
		src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
		controls
		hlsConfig={{
			lowLatencyMode: true,
			maxBufferLength: 30
		}}
		onhlsmanifestparsed={handleManifestParsed}
	/>

	{#if levels.length > 0}
		<div class="quality-selector">
			<label>
				Quality:
				<select value={currentLevel} on:change={changeQuality}>
					<option value={-1}>Auto</option>
					{#each levels as level, i}
						<option value={i}>
							{level.height}p - {(level.bitrate / 1000000).toFixed(2)} Mbps
						</option>
					{/each}
				</select>
			</label>
		</div>
	{/if}
</div>

<style>
	.video-container {
		max-width: 900px;
		margin: 2rem auto;
	}

	.quality-selector {
		margin-top: 1rem;
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 8px;
	}
</style>
```

#### Props

| Prop                  | Type        | Default | Description                       |
| --------------------- | ----------- | ------- | --------------------------------- |
| `src`                 | `string`    | -       | HLS manifest URL (.m3u8)          |
| `hlsConfig`           | `HlsConfig` | `{}`    | hls.js configuration options      |
| `onhlsmanifestparsed` | `function`  | -       | Called when manifest is parsed    |
| `onhlslevelswitched`  | `function`  | -       | Called when quality level changes |
| `onhlsfragloaded`     | `function`  | -       | Called when fragment is loaded    |

---

### Mux Video

Professional video hosting with built-in analytics support.

**⚠️ Requires API Keys**: You need a Mux account and API keys to use this component.

#### Configuration Form

Before using Mux Video, fill in your configuration:

```svelte
<script>
	import { MuxVideo } from 'sveltekit-video-element';
	import { writable } from 'svelte/store';

	let muxConfig = writable({
		playbackId: '',
		envKey: '',
		metadata: {
			video_title: '',
			viewer_user_id: ''
		}
	});

	let showVideo = false;

	function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		muxConfig.set({
			playbackId: formData.get('playbackId'),
			envKey: formData.get('envKey'),
			metadata: {
				video_title: formData.get('video_title'),
				viewer_user_id: formData.get('viewer_user_id')
			}
		});

		showVideo = true;
	}
</script>

<div class="mux-demo">
	<form onsubmit={handleSubmit} class="config-form">
		<h3>Mux Configuration</h3>

		<div class="form-group">
			<label for="playbackId">Playback ID *</label>
			<input type="text" id="playbackId" name="playbackId" placeholder="e.g., x36xhzz" required />
			<small>Get from your Mux dashboard</small>
		</div>

		<div class="form-group">
			<label for="envKey">Environment Key (for analytics)</label>
			<input type="text" id="envKey" name="envKey" placeholder="e.g., your-env-key" />
			<small>Optional - for Mux Data analytics</small>
		</div>

		<div class="form-group">
			<label for="video_title">Video Title</label>
			<input type="text" id="video_title" name="video_title" placeholder="My Awesome Video" />
		</div>

		<div class="form-group">
			<label for="viewer_user_id">Viewer User ID</label>
			<input type="text" id="viewer_user_id" name="viewer_user_id" placeholder="user-123" />
		</div>

		<button type="submit" class="submit-btn"> Load Video </button>
	</form>

	{#if showVideo && $muxConfig.playbackId}
		<div class="video-player">
			<MuxVideo
				playbackId={$muxConfig.playbackId}
				envKey={$muxConfig.envKey}
				controls
				metadata={$muxConfig.metadata}
			/>
		</div>
	{/if}
</div>

<style>
	.mux-demo {
		max-width: 900px;
		margin: 2rem auto;
	}

	.config-form {
		background: #f5f5f5;
		padding: 2rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.form-group small {
		display: block;
		color: #666;
		margin-top: 0.25rem;
	}

	.submit-btn {
		background: #000;
		color: #fff;
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
	}

	.submit-btn:hover {
		background: #333;
	}
</style>
```

#### Props

| Prop         | Type                                  | Default       | Description              |
| ------------ | ------------------------------------- | ------------- | ------------------------ |
| `playbackId` | `string`                              | -             | Mux playback ID          |
| `envKey`     | `string`                              | -             | Mux Data environment key |
| `metadata`   | `object`                              | `{}`          | Analytics metadata       |
| `streamType` | `'on-demand' \| 'live' \| 'live:dvr'` | `'on-demand'` | Stream type              |

---

### JW Player Video

Enterprise-grade video player with extensive features.

**⚠️ Requires License**: You need a JW Player account and player ID.

#### Configuration Form

```svelte
<script>
	import { JwPlayerVideo } from 'sveltekit-video-element';

	let config = {
		playerId: '',
		mediaId: '',
		src: ''
	};

	let showVideo = false;

	function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		config = {
			playerId: formData.get('playerId'),
			mediaId: formData.get('mediaId'),
			src: formData.get('src')
		};

		showVideo = true;
	}
</script>

<div class="jwplayer-demo">
	<form onsubmit={handleSubmit} class="config-form">
		<h3>JW Player Configuration</h3>

		<div class="form-group">
			<label for="playerId">Player ID *</label>
			<input type="text" id="playerId" name="playerId" placeholder="e.g., ABC12345" required />
			<small>Get from JW Player dashboard</small>
		</div>

		<div class="form-group">
			<label for="mediaId">Media ID</label>
			<input type="text" id="mediaId" name="mediaId" placeholder="Optional - for JW-hosted media" />
		</div>

		<div class="form-group">
			<label for="src">OR Video URL</label>
			<input type="url" id="src" name="src" placeholder="https://example.com/video.mp4" />
		</div>

		<button type="submit" class="submit-btn"> Load Video </button>
	</form>

	{#if showVideo && config.playerId}
		<JwPlayerVideo playerId={config.playerId} mediaId={config.mediaId} src={config.src} controls />
	{/if}
</div>
```

#### Props

| Prop       | Type     | Default | Description             |
| ---------- | -------- | ------- | ----------------------- |
| `playerId` | `string` | -       | JW Player ID (required) |
| `mediaId`  | `string` | -       | JW-hosted media ID      |
| `src`      | `string` | -       | Direct video URL        |
| `config`   | `object` | `{}`    | JW Player configuration |

---

### Cloudflare Stream

Stream videos with Cloudflare's global CDN.

**⚠️ Requires Cloudflare Account**: You need account ID and video ID.

#### Configuration Form

```svelte
<script>
	import { CloudflareVideo } from 'sveltekit-video-element';

	let config = {
		accountId: '',
		videoId: '',
		signedUrl: ''
	};

	let showVideo = false;

	function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		config = {
			accountId: formData.get('accountId'),
			videoId: formData.get('videoId'),
			signedUrl: formData.get('signedUrl')
		};

		showVideo = true;
	}
</script>

<div class="cloudflare-demo">
	<form onsubmit={handleSubmit} class="config-form">
		<h3>Cloudflare Stream Configuration</h3>

		<div class="form-group">
			<label for="accountId">Account ID *</label>
			<input
				type="text"
				id="accountId"
				name="accountId"
				placeholder="Your Cloudflare account ID"
				required
			/>
		</div>

		<div class="form-group">
			<label for="videoId">Video ID *</label>
			<input type="text" id="videoId" name="videoId" placeholder="Video identifier" required />
		</div>

		<div class="form-group">
			<label for="signedUrl">OR Signed URL</label>
			<input
				type="url"
				id="signedUrl"
				name="signedUrl"
				placeholder="https://customer-xxx.cloudflarestream.com/..."
			/>
		</div>

		<button type="submit" class="submit-btn"> Load Video </button>
	</form>

	{#if showVideo && config.accountId && config.videoId}
		<CloudflareVideo
			accountId={config.accountId}
			videoId={config.videoId}
			signedUrl={config.signedUrl}
			controls
		/>
	{/if}
</div>
```

#### Props

| Prop        | Type     | Default | Description               |
| ----------- | -------- | ------- | ------------------------- |
| `accountId` | `string` | -       | Cloudflare account ID     |
| `videoId`   | `string` | -       | Video identifier          |
| `signedUrl` | `string` | -       | Pre-signed URL (optional) |

---

### Video.js

Popular open-source HTML5 video player.

#### Basic Example

```svelte
<script>
	import { VideoJsVideo } from 'sveltekit-video-element';
</script>

<VideoJsVideo
	src="https://vjs.zencdn.net/v/oceans.mp4"
	controls
	options={{
		fluid: true,
		aspectRatio: '16:9'
	}}
/>
```

#### Props

| Prop      | Type     | Default | Description      |
| --------- | -------- | ------- | ---------------- |
| `src`     | `string` | -       | Video source URL |
| `options` | `object` | `{}`    | Video.js options |
| `plugins` | `object` | `{}`    | Video.js plugins |

---

### DASH Video

Dynamic Adaptive Streaming over HTTP with dash.js.

#### Basic Example

```svelte
<script>
	import { DashVideo } from 'sveltekit-video-element';
</script>

<DashVideo
	src="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd"
	controls
	dashConfig={{
		streaming: {
			lowLatencyEnabled: true,
			bufferTimeDefault: 4
		}
	}}
/>
```

#### Props

| Prop         | Type     | Default | Description              |
| ------------ | -------- | ------- | ------------------------ |
| `src`        | `string` | -       | DASH manifest URL (.mpd) |
| `dashConfig` | `object` | `{}`    | dash.js configuration    |

---

### Cloudinary Video

Video transformation and optimization with Cloudinary.

**⚠️ Requires Cloudinary Account**: You need cloud name and public ID.

#### Configuration Form

```svelte
<script>
	import { CloudinaryVideo } from 'sveltekit-video-element';

	let config = {
		cloudName: '',
		publicId: '',
		quality: 'auto',
		width: 1280,
		effect: ''
	};

	let showVideo = false;

	function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		config = {
			cloudName: formData.get('cloudName'),
			publicId: formData.get('publicId'),
			quality: formData.get('quality'),
			width: parseInt(formData.get('width')),
			effect: formData.get('effect')
		};

		showVideo = true;
	}
</script>

<div class="cloudinary-demo">
	<form onsubmit={handleSubmit} class="config-form">
		<h3>Cloudinary Configuration</h3>

		<div class="form-group">
			<label for="cloudName">Cloud Name *</label>
			<input type="text" id="cloudName" name="cloudName" placeholder="e.g., demo" required />
		</div>

		<div class="form-group">
			<label for="publicId">Public ID *</label>
			<input type="text" id="publicId" name="publicId" placeholder="e.g., elephants" required />
		</div>

		<div class="form-group">
			<label for="quality">Quality</label>
			<select id="quality" name="quality">
				<option value="auto">Auto</option>
				<option value="90">Best</option>
				<option value="70">Good</option>
				<option value="50">Medium</option>
			</select>
		</div>

		<div class="form-group">
			<label for="width">Width (px)</label>
			<input type="number" id="width" name="width" value="1280" min="320" max="1920" />
		</div>

		<div class="form-group">
			<label for="effect">Effect (optional)</label>
			<input type="text" id="effect" name="effect" placeholder="e.g., sepia, blur:300" />
		</div>

		<button type="submit" class="submit-btn"> Load Video </button>
	</form>

	{#if showVideo && config.cloudName && config.publicId}
		<CloudinaryVideo
			cloudName={config.cloudName}
			publicId={config.publicId}
			transformation={{
				quality: config.quality,
				width: config.width,
				...(config.effect && { effect: config.effect })
			}}
			controls
		/>
	{/if}
</div>
```

#### Props

| Prop             | Type     | Default | Description            |
| ---------------- | -------- | ------- | ---------------------- |
| `cloudName`      | `string` | -       | Cloudinary cloud name  |
| `publicId`       | `string` | -       | Video public ID        |
| `transformation` | `object` | `{}`    | Transformation options |

---

### Custom Video

Integrate your own video player.

#### Example with Plyr

```svelte
<script>
	import { CustomVideo } from 'sveltekit-video-element';

	const plyrPlayer = {
		async init(element, config) {
			// Import Plyr dynamically
			const Plyr = (await import('plyr')).default;

			// Create video element
			const video = document.createElement('video');
			video.src = config.src;
			video.controls = config.controls;
			element.appendChild(video);

			// Initialize Plyr
			const player = new Plyr(video, {
				controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
			});

			return player;
		}
	};

	function handlePlayerReady(player) {
		console.log('Player ready:', player);
	}
</script>

<CustomVideo
	src="https://example.com/video.mp4"
	customPlayer={plyrPlayer}
	onPlayerReady={handlePlayerReady}
	controls
/>
```

---

## Advanced Usage

### SSR Compatibility

All components are SSR-compatible:

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';
	import { browser } from '$app/environment';
</script>

{#if browser}
	<HlsVideo src="..." controls />
{:else}
	<div class="video-placeholder">Loading video player...</div>
{/if}
```

### Event Handling

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';

	let isPlaying = false;
	let currentTime = 0;

	function handlePlay() {
		isPlaying = true;
	}

	function handlePause() {
		isPlaying = false;
	}

	function handleTimeUpdate(event) {
		currentTime = event.target.currentTime;
	}
</script>

<HlsVideo
	src="..."
	controls
	onplay={handlePlay}
	onpause={handlePause}
	ontimeupdate={handleTimeUpdate}
/>

<p>Status: {isPlaying ? 'Playing' : 'Paused'}</p>
<p>Time: {currentTime.toFixed(2)}s</p>
```

---

## API Reference

### Common Props (All Components)

| Prop          | Type                             | Default      | Description           |
| ------------- | -------------------------------- | ------------ | --------------------- |
| `src`         | `string`                         | -            | Video source URL      |
| `poster`      | `string`                         | -            | Poster image URL      |
| `controls`    | `boolean`                        | `true`       | Show controls         |
| `autoplay`    | `boolean`                        | `false`      | Auto-play video       |
| `loop`        | `boolean`                        | `false`      | Loop playback         |
| `muted`       | `boolean`                        | `false`      | Mute audio            |
| `preload`     | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | Preload strategy      |
| `width`       | `number \| string`               | `'100%'`     | Video width           |
| `height`      | `number \| string`               | `'auto'`     | Video height          |
| `playsinline` | `boolean`                        | `false`      | Play inline on mobile |

### Common Events

- `onloadstart`
- `onplay`
- `onpause`
- `onended`
- `ontimeupdate`
- `onvolumechange`
- `onseeking`
- `onseeked`
- `onerror`
- `onloadedmetadata`
- `onloadeddata`

---

## Support

- 📖 [Full Documentation](https://github.com/yourusername/sveltekit-video-element)
- 🐛 [Report Issues](https://github.com/yourusername/sveltekit-video-element/issues)
- 💬 [Discussions](https://github.com/yourusername/sveltekit-video-element/discussions)

## License

MIT
