# API Reference

Complete API documentation for all components and utilities.

## Table of Contents

- [Common Props](#common-props)
- [Common Events](#common-events)
- [Component-Specific APIs](#component-specific-apis)
  - [HlsVideo](#hlsvideo)
  - [MuxVideo](#muxvideo)
  - [JwPlayerVideo](#jwplayervideo)
  - [CloudflareVideo](#cloudflarevideo)
  - [VideoJsVideo](#videojsvideo)
  - [DashVideo](#dashvideo)
  - [CloudinaryVideo](#cloudinaryvideo)
  - [CustomVideo](#customvideo)
- [Utility Functions](#utility-functions)
- [TypeScript Types](#typescript-types)

---

## Common Props

All video components extend these base props:

```typescript
interface BaseVideoProps {
	src?: string;
	poster?: string;
	autoplay?: boolean;
	controls?: boolean;
	loop?: boolean;
	muted?: boolean;
	preload?: 'none' | 'metadata' | 'auto';
	width?: number | string;
	height?: number | string;
	crossorigin?: 'anonymous' | 'use-credentials';
	playsinline?: boolean;
	class?: string;
}
```

### Prop Details

| Prop          | Type                               | Default      | Description           |
| ------------- | ---------------------------------- | ------------ | --------------------- |
| `src`         | `string`                           | `undefined`  | Video source URL      |
| `poster`      | `string`                           | `undefined`  | Poster image URL      |
| `autoplay`    | `boolean`                          | `false`      | Auto-play on load     |
| `controls`    | `boolean`                          | `true`       | Show video controls   |
| `loop`        | `boolean`                          | `false`      | Loop playback         |
| `muted`       | `boolean`                          | `false`      | Mute audio            |
| `preload`     | `'none' \| 'metadata' \| 'auto'`   | `'metadata'` | Preload strategy      |
| `width`       | `number \| string`                 | `'100%'`     | Video width           |
| `height`      | `number \| string`                 | `'auto'`     | Video height          |
| `crossorigin` | `'anonymous' \| 'use-credentials'` | `undefined`  | CORS mode             |
| `playsinline` | `boolean`                          | `false`      | Play inline on mobile |
| `class`       | `string`                           | `''`         | CSS class name        |

---

## Common Events

All components forward standard HTML5 video events:

```typescript
interface VideoEventHandlers {
	onloadstart?: (event: Event) => void;
	onloadedmetadata?: (event: Event) => void;
	onloadeddata?: (event: Event) => void;
	oncanplay?: (event: Event) => void;
	oncanplaythrough?: (event: Event) => void;
	onplay?: (event: Event) => void;
	onpause?: (event: Event) => void;
	onended?: (event: Event) => void;
	ontimeupdate?: (event: Event) => void;
	onvolumechange?: (event: Event) => void;
	onseeking?: (event: Event) => void;
	onseeked?: (event: Event) => void;
	onwaiting?: (event: Event) => void;
	ondurationchange?: (event: Event) => void;
	onprogress?: (event: Event) => void;
	onerror?: (event: Event) => void;
	onstalled?: (event: Event) => void;
	onsuspend?: (event: Event) => void;
	onabort?: (event: Event) => void;
	onemptied?: (event: Event) => void;
	onratechange?: (event: Event) => void;
}
```

### Event Details

| Event            | Description                            |
| ---------------- | -------------------------------------- |
| `loadstart`      | Fired when loading starts              |
| `loadedmetadata` | Metadata loaded (duration, dimensions) |
| `loadeddata`     | First frame loaded                     |
| `canplay`        | Playback can start                     |
| `canplaythrough` | Can play through without buffering     |
| `play`           | Playback started                       |
| `pause`          | Playback paused                        |
| `ended`          | Playback ended                         |
| `timeupdate`     | Current time updated                   |
| `volumechange`   | Volume changed                         |
| `seeking`        | Seeking started                        |
| `seeked`         | Seeking completed                      |
| `waiting`        | Waiting for data                       |
| `durationchange` | Duration changed                       |
| `progress`       | Download progress                      |
| `error`          | Error occurred                         |

---

## Component-Specific APIs

### HlsVideo

HTTP Live Streaming component with hls.js integration.

#### Additional Props

```typescript
interface HlsVideoProps extends BaseVideoProps {
	hlsConfig?: HlsConfig;
	onhlsmanifestparsed?: (event: CustomEvent) => void;
	onhlslevelswitched?: (event: CustomEvent) => void;
	onhlsfragloaded?: (event: CustomEvent) => void;
	onhlserror?: (event: CustomEvent) => void;
}
```

#### HLS Configuration

```typescript
interface HlsConfig {
	// Buffer settings
	maxBufferLength?: number; // Default: 30
	maxMaxBufferLength?: number; // Default: 600
	backBufferLength?: number; // Default: Infinity

	// Latency settings
	lowLatencyMode?: boolean; // Default: false
	liveSyncDurationCount?: number; // Default: 3

	// Quality settings
	startLevel?: number; // Default: -1 (auto)
	capLevelToPlayerSize?: boolean; // Default: false

	// Network settings
	xhrSetup?: (xhr: XMLHttpRequest, url: string) => void;
	fetchSetup?: (context: any, initParams: any) => Request;

	// Debug
	debug?: boolean; // Default: false
}
```

#### Methods

```typescript
class HlsVideo {
	// Player control
	play(): Promise<void>;
	pause(): void;

	// Quality control
	getCurrentLevel(): number;
	setCurrentLevel(level: number): void;
	getLevels(): Array<{
		width: number;
		height: number;
		bitrate: number;
		name: string;
	}>;

	// Instance access
	getHls(): Hls | null;
	getVideoElement(): HTMLVideoElement;
}
```

#### Example

```svelte
<script>
	import { HlsVideo } from 'sveltekit-video-element';

	let videoRef;

	function handleManifestParsed(event) {
		console.log('Levels:', videoRef.getLevels());
	}
</script>

<HlsVideo
	bind:this={videoRef}
	src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
	controls
	hlsConfig={{
		lowLatencyMode: true,
		maxBufferLength: 30,
		debug: false
	}}
	onhlsmanifestparsed={handleManifestParsed}
/>
```

---

### MuxVideo

Professional video hosting with analytics.

#### Additional Props

```typescript
interface MuxVideoProps extends BaseVideoProps {
	playbackId: string;
	streamType?: 'on-demand' | 'live' | 'live:dvr';
	tokens?: {
		playback?: string;
		thumbnail?: string;
		storyboard?: string;
	};
	thumbnailTime?: number;
	metadata?: {
		video_id?: string;
		video_title?: string;
		viewer_user_id?: string;
		[key: string]: any;
	};
	beaconCollectionDomain?: string;
	customDomain?: string;
	envKey?: string;
	debug?: boolean;
	disableCookies?: boolean;
	maxResolution?: string;
	minResolution?: string;
	renditionOrder?: 'desc' | 'asc';
	hlsConfig?: HlsConfig;
}
```

#### Methods

```typescript
class MuxVideo {
	play(): Promise<void>;
	pause(): void;
	getVideoElement(): HTMLVideoElement;
	getMuxInstance(): any;
}
```

#### Example

```svelte
<script>
	import { MuxVideo } from 'sveltekit-video-element';
</script>

<MuxVideo
	playbackId="abc123"
	envKey="your-env-key"
	streamType="on-demand"
	controls
	metadata={{
		video_title: 'My Video',
		viewer_user_id: 'user-123',
		video_id: 'video-456'
	}}
/>
```

---

### JwPlayerVideo

Enterprise video player.

#### Additional Props

```typescript
interface JwPlayerVideoProps extends BaseVideoProps {
	playerId: string;
	mediaId?: string;
	libraryUrl?: string;
	config?: {
		aspectratio?: string;
		skin?: object;
		advertising?: object;
		analytics?: object;
		[key: string]: any;
	};
}
```

#### Methods

```typescript
class JwPlayerVideo {
	play(): Promise<void>;
	pause(): void;
	getPlayer(): any;
}
```

#### Example

```svelte
<script>
	import { JwPlayerVideo } from 'sveltekit-video-element';
</script>

<JwPlayerVideo
	playerId="ABC12345"
	mediaId="xyz789"
	controls
	config={{
		aspectratio: '16:9',
		skin: {
			name: 'bekle'
		}
	}}
/>
```

---

### CloudflareVideo

Cloudflare Stream integration.

#### Additional Props

```typescript
interface CloudflareVideoProps extends BaseVideoProps {
	videoId: string;
	accountId: string;
	streamUrl?: string;
	signedUrl?: string;
	thumbnailTime?: number;
}
```

#### Methods

```typescript
class CloudflareVideo {
	play(): Promise<void>;
	pause(): void;
	getVideoElement(): HTMLVideoElement;
}
```

#### Example

```svelte
<script>
	import { CloudflareVideo } from 'sveltekit-video-element';
</script>

<CloudflareVideo accountId="your-account-id" videoId="your-video-id" controls />
```

---

### VideoJsVideo

Video.js integration.

#### Additional Props

```typescript
interface VideoJsVideoProps extends BaseVideoProps {
	options?: {
		fluid?: boolean;
		aspectRatio?: string;
		controlBar?: object;
		plugins?: object;
		[key: string]: any;
	};
	plugins?: {
		[pluginName: string]: any;
	};
}
```

#### Methods

```typescript
class VideoJsVideo {
	play(): Promise<void>;
	pause(): void;
	getPlayer(): any;
}
```

#### Example

```svelte
<script>
	import { VideoJsVideo } from 'sveltekit-video-element';
</script>

<VideoJsVideo
	src="https://vjs.zencdn.net/v/oceans.mp4"
	controls
	options={{
		fluid: true,
		aspectRatio: '16:9',
		controlBar: {
			volumePanel: {
				inline: false
			}
		}
	}}
/>
```

---

### DashVideo

DASH streaming with dash.js.

#### Additional Props

```typescript
interface DashVideoProps extends BaseVideoProps {
	dashConfig?: {
		streaming?: {
			lowLatencyEnabled?: boolean;
			bufferTimeDefault?: number;
			retryAttempts?: object;
			retryIntervals?: object;
		};
		debug?: {
			logLevel?: number;
		};
	};
	ondashmanifestloaded?: (event: CustomEvent) => void;
	ondashqualitychanged?: (event: CustomEvent) => void;
}
```

#### Methods

```typescript
class DashVideo {
	play(): Promise<void>;
	pause(): void;
	getPlayer(): any;
	getBitrateInfoListFor(type: 'video' | 'audio'): Array<any>;
	setQualityFor(type: 'video' | 'audio', index: number): void;
	getQualityFor(type: 'video' | 'audio'): number;
}
```

#### Example

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

---

### CloudinaryVideo

Video transformation and optimization.

#### Additional Props

```typescript
interface CloudinaryVideoProps extends BaseVideoProps {
	cloudName: string;
	publicId: string;
	transformation?: {
		quality?: string | number;
		format?: string;
		width?: number;
		height?: number;
		crop?: string;
		gravity?: string;
		effect?: string;
		overlay?: string;
		startOffset?: number | string;
		endOffset?: number | string;
		duration?: number | string;
		[key: string]: any;
	};
	sourceTypes?: string[];
	secure?: boolean;
}
```

#### Methods

```typescript
class CloudinaryVideo {
	play(): Promise<void>;
	pause(): void;
	getVideoElement(): HTMLVideoElement;
	getTransformationUrl(transformation?: object): string;
}
```

#### Example

```svelte
<script>
	import { CloudinaryVideo } from 'sveltekit-video-element';
</script>

<CloudinaryVideo
	cloudName="demo"
	publicId="elephants"
	transformation={{
		quality: 'auto',
		width: 1280,
		height: 720,
		crop: 'fill',
		effect: 'saturation:50'
	}}
	controls
/>
```

---

### CustomVideo

Custom player integration.

#### Additional Props

```typescript
interface CustomVideoProps extends BaseVideoProps {
	customPlayer?:
		| {
				init: (element: HTMLElement, config: any) => Promise<any> | any;
		  }
		| Function;
	playerConfig?: Record<string, any>;
	onPlayerReady?: (player: any) => void;
}
```

#### Methods

```typescript
class CustomVideo {
	play(): Promise<void>;
	pause(): void;
	getPlayer(): any;
	getVideoElement(): HTMLVideoElement;
	getContainerElement(): HTMLDivElement;
}
```

#### Example

```svelte
<script>
	import { CustomVideo } from 'sveltekit-video-element';

	const myPlayer = {
		async init(element, config) {
			const Player = (await import('my-player')).default;
			return new Player(element, config);
		}
	};
</script>

<CustomVideo
	src="https://example.com/video.mp4"
	customPlayer={myPlayer}
	controls
	onPlayerReady={(player) => console.log('Ready!', player)}
/>
```

---

## Utility Functions

### buildMuxUrl

Build Mux video URL with options.

```typescript
function buildMuxUrl(
	playbackId: string,
	options?: {
		token?: string;
		thumbnailTime?: number;
		maxResolution?: string;
		minResolution?: string;
		customDomain?: string;
	}
): string;
```

**Example:**

```typescript
import { buildMuxUrl } from 'sveltekit-video-element';

const url = buildMuxUrl('abc123', {
	maxResolution: '1080p',
	token: 'xyz'
});
```

### buildCloudinaryUrl

Build Cloudinary video URL with transformations.

```typescript
function buildCloudinaryUrl(
	cloudName: string,
	publicId: string,
	transformation?: Record<string, any>,
	secure?: boolean
): string;
```

**Example:**

```typescript
import { buildCloudinaryUrl } from 'sveltekit-video-element';

const url = buildCloudinaryUrl(
	'demo',
	'elephants',
	{
		quality: 'auto',
		width: 1280
	},
	true
);
```

### buildCloudflareStreamUrl

Build Cloudflare Stream URL.

```typescript
function buildCloudflareStreamUrl(
	accountId: string,
	videoId: string,
	options?: {
		signedUrl?: string;
	}
): string;
```

### isBrowser

Check if code is running in browser.

```typescript
function isBrowser(): boolean;
```

### loadScript

Dynamically load external script.

```typescript
function loadScript(src: string, id?: string): Promise<void>;
```

### generateId

Generate unique ID for elements.

```typescript
function generateId(prefix?: string): string;
```

---

## TypeScript Types

All types are exported from the main package:

```typescript
import type {
	BaseVideoProps,
	HlsVideoProps,
	MuxVideoProps,
	JwPlayerVideoProps,
	CloudflareVideoProps,
	VideoJsVideoProps,
	DashVideoProps,
	CloudinaryVideoProps,
	CustomVideoProps,
	VideoPlayerInstance,
	VideoEventHandlers
} from 'sveltekit-video-element';
```

### VideoPlayerInstance

Common interface for player instances:

```typescript
interface VideoPlayerInstance {
	play: () => Promise<void>;
	pause: () => void;
	load: () => void;
	currentTime: number;
	duration: number;
	volume: number;
	muted: boolean;
	paused: boolean;
	ended: boolean;
	readyState: number;
	destroy?: () => void;
}
```

---

## Best Practices

### Error Handling

Always handle errors gracefully:

```svelte
<script>
	function handleError(event) {
		console.error('Video error:', event.detail);
		// Show user-friendly error message
	}
</script>

<HlsVideo src="..." controls onerror={handleError} />
```

### Cleanup

Components automatically clean up on unmount, but you can also manually control:

```svelte
<script>
	import { onDestroy } from 'svelte';

	let videoRef;

	onDestroy(() => {
		if (videoRef) {
			videoRef.pause();
		}
	});
</script>
```

### Performance

Optimize performance with lazy loading:

```svelte
<HlsVideo src="..." preload="none" controls />
```

---

For more information, see:

- [Quick Start Guide](./QUICK_START.md)
- [Full Documentation](./DOCUMENTATION.md)
- [Examples](../EXAMPLES.md)
