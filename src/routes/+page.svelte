<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import {
		HlsVideo,
		JwPlayerVideo,
		VideoJsVideo,
		CloudflareVideo,
		DashVideo,
		CloudinaryVideo,
		CustomVideo,
		MuxVideo
	} from '$lib/index.js';
	import type { MuxVideoProps, HlsVideoProps } from '../lib/types/index.js';

	type VideoType =
		| 'hls'
		| 'mux'
		| 'jwplayer'
		| 'cloudflare'
		| 'videojs'
		| 'dash'
		| 'cloudinary'
		| 'custom';

	let selectedType = $state<VideoType>((page.url.searchParams.get('type') as VideoType) || 'hls');

	let muxConfig = writable({
		playbackId: '',
		envKey: '',
		metadata: {
			video_title: '',
			viewer_user_id: ''
		}
	});

	let jwplayerConfig = writable({
		playerId: '',
		mediaId: '',
		src: ''
	});

	let cloudflareConfig = writable({
		accountId: '',
		videoId: '',
		signedUrl: ''
	});

	let cloudinaryConfig = writable({
		cloudName: '',
		publicId: '',
		quality: 'auto',
		width: 1280,
		effect: ''
	});

	let showMuxVideo = $state(false);
	let showJwPlayerVideo = $state(false);
	let showCloudflareVideo = $state(false);
	let showCloudinaryVideo = $state(false);

	const sampleHlsUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
	const sampleDashUrl = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
	const sampleMp4Url = 'https://vjs.zencdn.net/v/oceans.mp4';
	const defaultPoster = 'https://image.mux.com/x36xhzz/thumbnail.jpg';

	const videoTypes = [
		{ value: 'hls', label: 'HLS Video', requiresConfig: false },
		{ value: 'mux', label: 'Mux Video', requiresConfig: true },
		{ value: 'jwplayer', label: 'JW Player', requiresConfig: true },
		{ value: 'cloudflare', label: 'Cloudflare Stream', requiresConfig: true },
		{ value: 'videojs', label: 'Video.js', requiresConfig: false },
		{ value: 'dash', label: 'DASH Video', requiresConfig: false },
		{ value: 'cloudinary', label: 'Cloudinary', requiresConfig: true },
		{ value: 'custom', label: 'Custom Player', requiresConfig: false }
	];

	function handleMuxSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		muxConfig.set({
			playbackId: formData.get('playbackId') as string,
			envKey: formData.get('envKey') as string,
			metadata: {
				video_title: formData.get('video_title') as string,
				viewer_user_id: formData.get('viewer_user_id') as string
			}
		});

		showMuxVideo = true;
	}

	function handleJwPlayerSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		jwplayerConfig.set({
			playerId: formData.get('playerId') as string,
			mediaId: formData.get('mediaId') as string,
			src: formData.get('src') as string
		});

		showJwPlayerVideo = true;
	}

	function handleCloudflareSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		cloudflareConfig.set({
			accountId: formData.get('accountId') as string,
			videoId: formData.get('videoId') as string,
			signedUrl: formData.get('signedUrl') as string
		});

		showCloudflareVideo = true;
	}

	function handleCloudinarySubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		cloudinaryConfig.set({
			cloudName: formData.get('cloudName') as string,
			publicId: formData.get('publicId') as string,
			quality: formData.get('quality') as string,
			width: parseInt(formData.get('width') as string),
			effect: formData.get('effect') as string
		});

		showCloudinaryVideo = true;
	}
	let hlsVideoRef = $state<any>(null);
	let hlsLevels = $state<any[]>([]);
	let currentHlsLevel = $state(-1);

	function handleHlsManifestParsed() {
		if (hlsVideoRef) {
			hlsLevels = hlsVideoRef.getLevels();
			currentHlsLevel = hlsVideoRef.getCurrentLevel();
		}
	}

	function changeHlsQuality(event: Event) {
		const level = parseInt((event.target as HTMLSelectElement).value);
		if (hlsVideoRef) {
			hlsVideoRef.setCurrentLevel(level);
			currentHlsLevel = level;
		}
	}
</script>

<main class="demo-container">
	<header class="demo-header">
		<h1>SvelteKit Video Elements - Interactive Demo</h1>
		<p>Try out different video players with live examples</p>
	</header>
	<nav class="type-selector">
		{#each videoTypes as type}
			<button
				class="type-btn"
				class:active={selectedType === type.value}
				onclick={() => {
					goto(`?type=${type.value}`);
					selectedType = type.value as VideoType;
				}}
			>
				{type.label}
				{#if type.requiresConfig}
					<span class="badge">Config Required</span>
				{/if}
			</button>
		{/each}
	</nav>
	<section class="demo-content">
		<div class="demo-header-section">
			<h2>{videoTypes.find((t) => t.value === selectedType)?.label}</h2>
		</div>
		{#if selectedType === 'hls'}
			<div class="video-demo">
				<div class="demo-info">
					<h3>HTTP Live Streaming (HLS)</h3>
					<p>Adaptive bitrate streaming with hls.js. Supports quality level switching.</p>
				</div>

				<div class="video-wrapper">
					<HlsVideo
						bind:this={hlsVideoRef}
						src={sampleHlsUrl}
						controls
						poster={defaultPoster}
						hlsConfig={{
							lowLatencyMode: true,
							maxBufferLength: 30
						}}
						onhlsmanifestparsed={handleHlsManifestParsed}
					/>
				</div>
				{#if hlsLevels.length > 0}
					<div class="quality-selector">
						<label>
							Quality Level:
							<select value={currentHlsLevel} onchange={changeHlsQuality}>
								<option value={-1}>Auto</option>
								{#each hlsLevels as level, i}
									<option value={i}>
										{level.height}p - {(level.bitrate / 1000000).toFixed(2)} Mbps
									</option>
								{/each}
							</select>
						</label>
					</div>
				{/if}
				<div class="code-block">
					<pre>
<code>
{`
<HlsVideo
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  controls
  hlsConfig={{
    lowLatencyMode: true,
    maxBufferLength: 30
  }}
/>`}
  </code>
          </pre>
				</div>
			</div>
		{/if}
		{#if selectedType === 'mux'}
			<div class="video-demo">
				<div class="demo-info">
					<h3>Mux Video</h3>
					<p>Professional video hosting with analytics. Requires Mux account.</p>
				</div>

				<form onsubmit={handleMuxSubmit} class="config-form">
					<h4>Configuration</h4>

					<div class="form-group">
						<label for="mux-playbackId">
							Playback ID *
							<input
								type="text"
								id="mux-playbackId"
								name="playbackId"
								placeholder="e.g., x36xhzz"
								required
							/>
						</label>
						<small>Get from your Mux dashboard</small>
					</div>

					<div class="form-group">
						<label for="mux-envKey">
							Environment Key (optional)
							<input type="text" id="mux-envKey" name="envKey" placeholder="For analytics" />
						</label>
					</div>

					<div class="form-group">
						<label for="mux-video-title">
							Video Title
							<input type="text" id="mux-video-title" name="video_title" placeholder="My Video" />
						</label>
					</div>

					<div class="form-group">
						<label for="mux-viewer-id">
							Viewer User ID
							<input type="text" id="mux-viewer-id" name="viewer_user_id" placeholder="user-123" />
						</label>
					</div>

					<button type="submit" class="submit-btn">Load Video</button>
				</form>

				{#if showMuxVideo && $muxConfig.playbackId}
					<div class="video-wrapper">
						<MuxVideo
							playbackId={$muxConfig.playbackId}
							envKey={$muxConfig.envKey}
							controls
							metadata={$muxConfig.metadata}
						/>
					</div>
				{/if}

				<div class="code-block">
					<pre>
<code>
{`
<MuxVideo
  playbackId="${$muxConfig.playbackId || 'your-playback-id'}"
  envKey="${$muxConfig.envKey || 'your-env-key'}"
  controls
  metadata={{
  video_title: "${$muxConfig.metadata.video_title || 'My Video'}",
  viewer_user_id: "${$muxConfig.metadata.viewer_user_id || 'user-123'}"
  }}
/>`}
</code>
</pre>
				</div>
			</div>
		{/if}
		{#if selectedType === 'jwplayer'}
			<div class="video-demo">
				<div class="demo-info">
					<h3>JW Player</h3>
					<p>Enterprise video player. Requires JW Player account and player ID.</p>
				</div>

				<form onsubmit={handleJwPlayerSubmit} class="config-form">
					<h4>Configuration</h4>

					<div class="form-group">
						<label for="jw-playerId">
							Player ID *
							<input type="text" id="jw-playerId" name="playerId" placeholder="ABC12345" required />
						</label>
						<small>Get from JW Player dashboard</small>
					</div>

					<div class="form-group">
						<label for="jw-mediaId">
							Media ID
							<input type="text" id="jw-mediaId" name="mediaId" placeholder="Optional" />
						</label>
					</div>

					<div class="form-group">
						<label for="jw-src">
							OR Video URL
							<input
								type="url"
								id="jw-src"
								name="src"
								placeholder="https://example.com/video.mp4"
							/>
						</label>
					</div>

					<button type="submit" class="submit-btn">Load Video</button>
				</form>

				{#if showJwPlayerVideo && $jwplayerConfig.playerId}
					<div class="video-wrapper">
						<JwPlayerVideo
							playerId={$jwplayerConfig.playerId}
							mediaId={$jwplayerConfig.mediaId}
							src={$jwplayerConfig.src}
							controls
						/>
					</div>
				{/if}

				<div class="code-block">
					<pre><code
							>{`
<JwPlayerVideo
  playerId="${$jwplayerConfig.playerId || 'your-player-id'}"
  ${$jwplayerConfig.mediaId ? `mediaId="${$jwplayerConfig.mediaId}"` : ''}
  ${$jwplayerConfig.src ? `src="${$jwplayerConfig.src}"` : ''}
  controls
/>`}</code
						></pre>
				</div>
			</div>
		{/if}
		{#if selectedType === 'cloudflare'}
			<div class="video-demo">
				<div class="demo-info">
					<h3>Cloudflare Stream</h3>
					<p>Stream videos with Cloudflare's CDN. Requires account ID and video ID.</p>
				</div>

				<form onsubmit={handleCloudflareSubmit} class="config-form">
					<h4>Configuration</h4>

					<div class="form-group">
						<label for="cf-accountId">
							Account ID *
							<input
								type="text"
								id="cf-accountId"
								name="accountId"
								placeholder="Your account ID"
								required
							/>
						</label>
					</div>

					<div class="form-group">
						<label for="cf-videoId">
							Video ID *
							<input
								type="text"
								id="cf-videoId"
								name="videoId"
								placeholder="Video identifier"
								required
							/>
						</label>
					</div>

					<div class="form-group">
						<label for="cf-signedUrl">
							OR Signed URL
							<input type="url" id="cf-signedUrl" name="signedUrl" placeholder="Pre-signed URL" />
						</label>
					</div>

					<button type="submit" class="submit-btn">Load Video</button>
				</form>

				{#if showCloudflareVideo && $cloudflareConfig.accountId && $cloudflareConfig.videoId}
					<div class="video-wrapper">
						<CloudflareVideo
							accountId={$cloudflareConfig.accountId}
							videoId={$cloudflareConfig.videoId}
							signedUrl={$cloudflareConfig.signedUrl}
							controls
						/>
					</div>
				{/if}

				<div class="code-block">
					<pre><code
							>{`
<CloudflareVideo
  accountId="${$cloudflareConfig.accountId || 'your-account-id'}"
  videoId="${$cloudflareConfig.videoId || 'your-video-id'}"
  controls
/>`}</code
						></pre>
				</div>
			</div>
		{/if}
		{#if selectedType === 'videojs'}
			<div class="video-demo">
				<div class="demo-info">
					<h3>Video.js</h3>
					<p>Popular open-source HTML5 video player with extensive plugin support.</p>
				</div>

				<div class="video-wrapper">
					<VideoJsVideo
						src={sampleMp4Url}
						controls
						options={{
							fluid: true,
							aspectRatio: '16:9'
						}}
					/>
				</div>

				<div class="code-block">
					<pre><code
							>{`
<VideoJsVideo
  src="https://vjs.zencdn.net/v/oceans.mp4"
  controls
  options={{
    fluid: true,
    aspectRatio: '16:9'
  }}
/>`}</code
						></pre>
				</div>
			</div>
		{/if}
		{#if selectedType === 'dash'}
			<div class="video-demo">
				<div class="demo-info">
					<h3>DASH Video</h3>
					<p>Dynamic Adaptive Streaming over HTTP with dash.js integration.</p>
				</div>

				<div class="video-wrapper">
					<DashVideo
						src={sampleDashUrl}
						controls
						dashConfig={{
							streaming: {
								lowLatencyEnabled: true,
								bufferTimeDefault: 4
							}
						}}
					/>
				</div>

				<div class="code-block">
					<pre><code
							>{`
<DashVideo
  src="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd"
  controls
  dashConfig={{
    streaming: {
      lowLatencyEnabled: true,
      bufferTimeDefault: 4
    }
  }}
/>`}</code
						></pre>
				</div>
			</div>
		{/if}
		{#if selectedType === 'cloudinary'}
			<div class="video-demo">
				<div class="demo-info">
					<h3>Cloudinary Video</h3>
					<p>Video transformation and optimization. Requires Cloudinary account.</p>
				</div>

				<form onsubmit={handleCloudinarySubmit} class="config-form">
					<h4>Configuration</h4>

					<div class="form-group">
						<label for="cdn-cloudName">
							Cloud Name *
							<input
								type="text"
								id="cdn-cloudName"
								name="cloudName"
								placeholder="e.g., demo"
								required
							/>
						</label>
					</div>

					<div class="form-group">
						<label for="cdn-publicId">
							Public ID *
							<input
								type="text"
								id="cdn-publicId"
								name="publicId"
								placeholder="e.g., elephants"
								required
							/>
						</label>
					</div>

					<div class="form-group">
						<label for="cdn-quality">
							Quality
							<select id="cdn-quality" name="quality">
								<option value="auto">Auto</option>
								<option value="90">Best</option>
								<option value="70">Good</option>
								<option value="50">Medium</option>
							</select>
						</label>
					</div>

					<div class="form-group">
						<label for="cdn-width">
							Width (px)
							<input type="number" id="cdn-width" name="width" value="1280" min="320" max="1920" />
						</label>
					</div>

					<div class="form-group">
						<label for="cdn-effect">
							Effect (optional)
							<input
								type="text"
								id="cdn-effect"
								name="effect"
								placeholder="e.g., sepia, blur:300"
							/>
						</label>
					</div>

					<button type="submit" class="submit-btn">Load Video</button>
				</form>

				{#if showCloudinaryVideo && $cloudinaryConfig.cloudName && $cloudinaryConfig.publicId}
					<div class="video-wrapper">
						<CloudinaryVideo
							cloudName={$cloudinaryConfig.cloudName}
							publicId={$cloudinaryConfig.publicId}
							transformation={{
								quality: $cloudinaryConfig.quality,
								width: $cloudinaryConfig.width,
								...($cloudinaryConfig.effect && { effect: $cloudinaryConfig.effect })
							}}
							controls
						/>
					</div>
				{/if}

				<div class="code-block">
					<pre><code
							>{`
<CloudinaryVideo
  cloudName="${$cloudinaryConfig.cloudName || 'demo'}"
  publicId="${$cloudinaryConfig.publicId || 'elephants'}"
  transformation={{
    quality: "${$cloudinaryConfig.quality}",
    width: ${$cloudinaryConfig.width}${$cloudinaryConfig.effect ? `,\n    effect: "${$cloudinaryConfig.effect}"` : ''}
  }}
  controls
/>`}</code
						></pre>
				</div>
			</div>
		{/if}
		{#if selectedType === 'custom'}
			<div class="video-demo">
				<div class="demo-info">
					<h3>Custom Video Player</h3>
					<p>Integrate your own video player. Falls back to native HTML5 video element.</p>
				</div>

				<div class="video-wrapper">
					<CustomVideo src={sampleMp4Url} controls />
				</div>

				<div class="code-block">
					<pre><code
							>{`
  // Example: Integrate with Plyr
  const plyrPlayer = {
    async init(element, config) {
      const Plyr = (await import('plyr')).default;
      const video = document.createElement('video');
      video.src = config.src;
      element.appendChild(video);
      return new Plyr(video);
    }
  };
</script>

<CustomVideo
  src="https://example.com/video.mp4"
  customPlayer={plyrPlayer}
  controls
/>`}</code
						></pre>
				</div>
			</div>
		{/if}
	</section>
</main>

<!-- svelte-ignore css_unused_selector-->
<style>
	.demo-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	.demo-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.demo-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: #000;
	}

	.demo-header p {
		font-size: 1.125rem;
		color: #666;
	}

	.type-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 3rem;
	}

	.type-btn {
		padding: 0.75rem 1.5rem;
		border: 2px solid #000;
		background: #fff;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.type-btn:hover {
		background: #f5f5f5;
	}

	.type-btn.active {
		background: #000;
		color: #fff;
	}

	.type-btn.active .badge {
		background: #fff;
		color: #000;
	}

	.type-btn:active {
		transform: scale(0.95);
	}

	.badge {
		font-size: 0.625rem;
		padding: 0.125rem 0.5rem;
		background: #000;
		color: #fff;
		border-radius: 4px;
		font-weight: 500;
	}

	.demo-content {
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 12px;
		overflow: hidden;
	}

	.demo-header-section {
		background: #f9f9f9;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e5e5;
	}

	.demo-header-section h2 {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 700;
	}

	.video-demo {
		padding: 2rem;
	}

	.demo-info {
		margin-bottom: 2rem;
	}

	.demo-info h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.demo-info p {
		margin: 0;
		color: #666;
	}

	.config-form {
		background: #f9f9f9;
		padding: 2rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.config-form h4 {
		margin: 0 0 1.5rem 0;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.form-group input,
	.form-group select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #000;
	}

	.form-group small {
		display: block;
		color: #666;
		margin-top: 0.25rem;
		font-size: 0.875rem;
	}

	.submit-btn {
		background: #000;
		color: #fff;
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.submit-btn:hover {
		background: #333;
	}

	.submit-btn:active {
		transform: scale(0.95);
	}

	.video-wrapper {
		margin-bottom: 2rem;
		border-radius: 8px;
		overflow: hidden;
		background: #000;
	}

	.quality-selector {
		background: #f9f9f9;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.quality-selector label {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-weight: 600;
	}

	.quality-selector select {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
	}

	.code-block {
		background: #1e1e1e;
		border-radius: 8px;
		padding: 1.5rem;
		overflow-x: auto;
	}

	.code-block pre {
		margin: 0;
	}

	.code-block code {
		color: #d4d4d4;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.demo-container {
			padding: 1rem;
		}

		.demo-header h1 {
			font-size: 1.75rem;
		}

		.type-selector {
			gap: 0.5rem;
		}

		.type-btn {
			padding: 0.5rem 1rem;
			font-size: 0.875rem;
		}

		.video-demo {
			padding: 1rem;
		}

		.config-form {
			padding: 1rem;
		}
	}
</style>
