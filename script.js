// Config is loaded from config.js
async function getRecentTrack() {
    try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${config.LASTFM_USERNAME}&api_key=${config.LASTFM_API_KEY}&format=json&limit=1`);
        const data = await response.json();

        const track = data.recenttracks.track[0];
        const statusContainer = document.getElementById('music-status');
        const statusIndicator = document.querySelector('.status-indicator');

        // Update track info
        document.getElementById('album-art').src = track.image[2]['#text'] || 'path_to_fallback_image.png';
        document.getElementById('track-name').textContent = track.name;
        document.getElementById('artist-name').textContent = track.artist['#text'];

        // Check if track is currently playing
        if (track['@attr'] && track['@attr'].nowplaying === 'true') {
            statusIndicator.classList.add('active');
            statusContainer.textContent = 'Now listening';
        } else {
            statusIndicator.classList.remove('active');
            // Format the timestamp
            const timestamp = new Date(track.date.uts * 1000);
            const timeAgo = getTimeAgo(timestamp);
            statusContainer.textContent = `Last played ${timeAgo}`;
        }
    } catch (error) {
        console.error('Error fetching music data:', error);
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) {
        return 'just now';
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diffSeconds / 86400);
        return `${days}d ago`;
    }
}

// Update every 30 seconds
getRecentTrack();
setInterval(getRecentTrack, 30000);
