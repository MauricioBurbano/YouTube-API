const apiKey = data.key;
const results = 24;
const searchInput = document.querySelector("#searchInput");
const videos = document.querySelector("#videos");

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        while (videos.firstChild) {
            videos.removeChild(videos.firstChild);
        }

        searchInput.blur();
        event.preventDefault();

        const searchQuery = searchInput.value;
        const get = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=relevance&';
        const url = `${get}key=${apiKey}&q=${searchQuery}&maxResults=${results}`;
        
        catchVideos().catch(error => {});
        async function catchVideos() {
            const response = await fetch(url);
            const data = await response.json();

            for (let i = 0; i < 25; i++) {
                const link = document.createElement("a");
                link.target = "_blank";
                const kind = data.items[i].id.kind;
                if (kind === "youtube#video") {
                    const video = data.items[i].id.videoId;
                    link.href = `https://www.youtube.com/watch?v=${video}`;
                }
                if (kind === "youtube#channel") {
                    const channel = data.items[i].id.channelId;
                    link.href = `https://www.youtube.com/channel/${channel}`;
                }
                if (kind === "youtube#playlist") {
                    const playlist = data.items[i].id.playlistId;
                    link.href = `https://www.youtube.com/playlist?list=${playlist}`;
                }

                const img = document.createElement("img");
                img.src = data.items[i].snippet.thumbnails.high.url;

                const title = document.createElement("p");
                title.innerHTML = data.items[i].snippet.title;

                link.appendChild(img);

                const videoDiv = document.createElement("div");
                videoDiv.id = "videoDiv";

                videoDiv.appendChild(link);
                
                videoDiv.appendChild(title);

                if (kind !== "youtube#channel") {
                    const channelLink = document.createElement("a");
                    channelLink.target = "_blank";
                    const channelId = data.items[i].snippet.channelId;
                    channelLink.href = `https://www.youtube.com/channel/${channelId}`;
                    channelLink.innerHTML = data.items[i].snippet.channelTitle;
                    videoDiv.appendChild(channelLink);
                }

                videos.appendChild(videoDiv);
            }
        }
    }
});
searchInput.focus();