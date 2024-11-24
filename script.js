async function getRecentTrack() {
    try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${config.LASTFM_USERNAME}&api_key=${config.LASTFM_API_KEY}&format=json&limit=1`);
        const data = await response.json();

        const track = data.recenttracks.track[0];
        const statusContainer = document.getElementById('music-status');
        const statusIndicator = document.querySelector('.status-indicator');
        const albumArt = document.getElementById('album-art');
        const musicContainer = document.querySelector('.music-container');

        musicContainer.onclick = () => {
            window.open(track.url, '_blank');
        };

        if (track.image[2]['#text']) {
            albumArt.src = track.image[2]['#text'];
        }

        document.getElementById('track-name').textContent = track.name;
        document.getElementById('artist-name').textContent = track.artist['#text'];

        if (track['@attr'] && track['@attr'].nowplaying === 'true') {
            statusIndicator.classList.add('active');
            statusContainer.textContent = 'Now listening';
        } else {
            statusIndicator.classList.remove('active');
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

getRecentTrack();
setInterval(getRecentTrack, 30000);
