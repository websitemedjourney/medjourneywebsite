"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import configData from "@/public/youtube.json";
import { YoutubeData } from "@/app/types";

const YoutubeSection = () => {
  const [data, setData] = useState<YoutubeData | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const fetchYoutubeData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (!apiKey) {
          console.warn(
            "Youtube API Key is missing. Falling back to static data.",
          );
          setData(configData as YoutubeData);
          return;
        }

        const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
        if (!channelId) {
          console.warn(
            "Youtube Channel ID is missing. Falling back to static data.",
          );
          setData(configData as YoutubeData);
          return;
        }

        const ytRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video`,
        );

        if (!ytRes.ok) {
          console.error("YouTube API error. Falling back to static data.");
          setData(configData as YoutubeData);
          return;
        }

        const searchData = await ytRes.json();

        if (searchData.items && searchData.items.length > 0) {
          const video = searchData.items[0];
          const thumbnail =
            video.snippet?.thumbnails?.high?.url ||
            video.snippet?.thumbnails?.default?.url ||
            configData.latestVideo?.thumbnail;

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = video.snippet.title;
          const decodedTitle =
            tempDiv.textContent || tempDiv.innerText || video.snippet.title;

          setData({
            channelId: configData.channelId,
            channelName: configData.channelName,
            latestVideo: {
              id: video.id.videoId,
              title: decodedTitle,
              thumbnail,
            },
          });
        } else {
          setData(configData as YoutubeData);
        }
      } catch (err) {
        console.error("Error fetching YouTube data:", err);
      }
    };

    fetchYoutubeData();
  }, []);

  if (!data?.latestVideo) return null;
  const v = data.latestVideo;

  return (
    <section id="video" className="section-pad theme-bg">
      <div className="container-px">
        <div className="text-center mb-10">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              background: "rgb(var(--accent-color) / 0.12)",
              color: "rgb(var(--accent-color))",
            }}
          >
            Latest on Youtube
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold theme-text-primary">
            {v.title}
          </h2>
          {data.channelName && (
            <p className="text-muted-foreground mt-2">
              From the channel of {data.channelName}
            </p>
          )}
        </div>

        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black">
          {playing ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
              title={v.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="group block w-full h-full relative"
              aria-label="Play video"
            >
              <img
                src={v.thumbnail}
                alt={v.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid place-items-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 text-black shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default YoutubeSection;
