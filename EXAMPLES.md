# Example Usage

## Installation

```bash
npm install sveltekit-video-elements
```

## Basic Examples

### 1. Simple HLS Video

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-elements';
</script>

<HlsVideo
	src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
	controls
	autoplay
	poster="https://image.mux.com/x36xhzz/thumbnail.jpg"
/>
```

### 2. Mux Video with Analytics

```svelte
<script>
	import { MuxVideo } from 'sveltekit-video-elements';
</script>

<MuxVideo
	playbackId="x36xhzz"
	envKey="YOUR_MUX_ENV_KEY"
	metadata={{
		video_title: 'Big Buck Bunny',
		viewer_user_id: 'user-123'
	}}
	controls
/>
```

### 3. Cloudinary with Transformations

```svelte
<script>
	import { CloudinaryVideo } from 'sveltekit-video-elements';

	let quality = 'auto';
</script>

<CloudinaryVideo
	cloudName="demo"
	publicId="elephants"
	transformation={{
		quality: quality,
		width: 1280,
		height: 720,
		crop: 'fill',
		effect: 'saturation:50'
	}}
	controls
/>

<label>
	Quality:
	<select bind:value={quality}>
		<option value="auto">Auto</option>
		<option value="90">Best</option>
		<option value="70">Good</option>
		<option value="50">Medium</option>
	</select>
</label>
```

### 4. Video.js with Custom Skin

```svelte
<script>
	import { VideoJsVideo } from 'sveltekit-video-elements';
</script>

<VideoJsVideo
	src="https://vjs.zencdn.net/v/oceans.mp4"
	options={{
		fluid: true,
		aspectRatio: '16:9',
		controlBar: {
			volumePanel: {
				inline: false
			}
		}
	}}
	controls
/>
```

### 5. Cloudflare Stream

```svelte
<script>
	import { CloudflareVideo } from 'sveltekit-video-elements';
</script>

<CloudflareVideo videoId="YOUR_VIDEO_ID" accountId="YOUR_ACCOUNT_ID" controls autoplay muted />
```

## Advanced Examples

### Quality Selector for HLS

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-elements';

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
		on:hlsmanifestparsed={handleManifestParsed}
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

### Custom Video Player Integration

```svelte
<script>
	import { CustomVideo } from 'sveltekit-video-elements';

	// Example: Integrate with Plyr
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
		console.log('Plyr player ready:', player);
	}
</script>

<CustomVideo
	src="https://example.com/video.mp4"
	customPlayer={plyrPlayer}
	onPlayerReady={handlePlayerReady}
	controls
/>
```

### Event Handling

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-elements';

	let isPlaying = false;
	let currentTime = 0;
	let duration = 0;
	let volume = 1;

	function handlePlay() {
		isPlaying = true;
		console.log('Video started playing');
	}

	function handlePause() {
		isPlaying = false;
		console.log('Video paused');
	}

	function handleTimeUpdate(event) {
		const video = event.target;
		currentTime = video.currentTime;
	}

	function handleLoadedMetadata(event) {
		const video = event.target;
		duration = video.duration;
	}

	function handleVolumeChange(event) {
		const video = event.target;
		volume = video.volume;
	}

	function handleError(event) {
		console.error('Video error:', event.detail);
	}
</script>

<div class="video-wrapper">
	<HlsVideo
		src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
		controls
		on:play={handlePlay}
		on:pause={handlePause}
		on:timeupdate={handleTimeUpdate}
		on:loadedmetadata={handleLoadedMetadata}
		on:volumechange={handleVolumeChange}
		on:error={handleError}
	/>

	<div class="info">
		<p>Status: {isPlaying ? 'Playing' : 'Paused'}</p>
		<p>Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s</p>
		<p>Volume: {(volume * 100).toFixed(0)}%</p>
	</div>
</div>

<style>
	.video-wrapper {
		max-width: 900px;
		margin: 2rem auto;
	}

	.info {
		margin-top: 1rem;
		padding: 1rem;
		background: #f0f0f0;
		border-radius: 8px;
		font-family: monospace;
	}
</style>
```

### SvelteKit Load Function Integration

```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// Fetch video data from your API or database
	const videoData = await fetchVideoData(params.id);

	return {
		video: {
			src: videoData.hlsUrl,
			poster: videoData.thumbnailUrl,
			title: videoData.title,
			description: videoData.description
		}
	};
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
	import { HlsVideo } from 'sveltekit-video-elements';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container">
	<h1>{data.video.title}</h1>

	<HlsVideo
		src={data.video.src}
		poster={data.video.poster}
		controls
		hlsConfig={{
			lowLatencyMode: true,
			maxBufferLength: 30
		}}
	/>

	<p>{data.video.description}</p>
</div>
```

### Responsive Video with Aspect Ratio

```svelte
<script>
	import { MuxVideo } from 'sveltekit-video-elements';
</script>

<div class="video-aspect-ratio">
	<MuxVideo playbackId="x36xhzz" controls class="video-responsive" />
</div>

<style>
	.video-aspect-ratio {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%; /* 16:9 aspect ratio */
		background: #000;
	}

	.video-aspect-ratio :global(.video-responsive) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
```

### Multiple Videos in a Grid

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-elements';

	const videos = [
		{
			id: 1,
			title: 'Video 1',
			src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
			poster: 'https://image.mux.com/x36xhzz/thumbnail.jpg'
		},
		{
			id: 2,
			title: 'Video 2',
			src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
			poster: 'https://image.mux.com/x36xhzz/thumbnail.jpg'
		},
		{
			id: 3,
			title: 'Video 3',
			src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
			poster: 'https://image.mux.com/x36xhzz/thumbnail.jpg'
		}
	];
</script>

<div class="video-grid">
	{#each videos as video (video.id)}
		<div class="video-item">
			<h3>{video.title}</h3>
			<HlsVideo src={video.src} poster={video.poster} controls preload="none" />
		</div>
	{/each}
</div>

<style>
	.video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		padding: 2rem;
	}

	.video-item {
		background: #fff;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.video-item h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}
</style>
```

## TypeScript Examples

### Typed Component Props

```svelte
<script lang="ts">
	import { HlsVideo } from 'sveltekit-video-elements';
	import type { HlsVideoProps } from 'sveltekit-video-elements';

	const videoProps: HlsVideoProps = {
		src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
		controls: true,
		autoplay: false,
		hlsConfig: {
			debug: false,
			lowLatencyMode: true,
			maxBufferLength: 30,
			maxMaxBufferLength: 60
		}
	};
</script>

<HlsVideo {...videoProps} />
```

### Type-Safe Event Handlers

```svelte
<script lang="ts">
	import { MuxVideo } from 'sveltekit-video-elements';
	import type { MuxVideoProps } from 'sveltekit-video-elements';

	let videoRef: typeof MuxVideo;

	const handlePlay = (event: Event): void => {
		console.log('Video playing');
	};

	const handleError = (event: CustomEvent): void => {
		console.error('Error:', event.detail);
	};

	const playVideo = async (): Promise<void> => {
		if (videoRef) {
			await videoRef.play();
		}
	};
</script>

<MuxVideo
	bind:this={videoRef}
	playbackId="x36xhzz"
	controls
	on:play={handlePlay}
	on:error={handleError}
/>

<button on:click={playVideo}>Play Video</button>
```

## More Examples

Check out the `/examples` directory in the repository for more comprehensive examples and use cases.
