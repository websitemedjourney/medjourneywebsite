"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import configData from "@/public/youtube.json";
import { YoutubeData } from "@/app/types";

const YoutubeSection = () => {
  const [data, setData] = useState<YoutubeData | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

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
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5&type=video`,
        );

        if (!ytRes.ok) {
          console.error("YouTube API error. Falling back to static data.");
          setData(configData as YoutubeData);
          return;
        }

        const searchData = await ytRes.json();

        if (searchData.items && searchData.items.length > 0) {
          const videos = searchData.items.map((video: any) => {
            const thumbnail =
              video.snippet?.thumbnails?.high?.url ||
              video.snippet?.thumbnails?.medium?.url ||
              video.snippet?.thumbnails?.default?.url ||
              configData.videos[0]?.thumbnail;

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = video.snippet.title;
            const decodedTitle =
              tempDiv.textContent || tempDiv.innerText || video.snippet.title;

            return {
              id: video.id.videoId,
              title: decodedTitle,
              thumbnail,
            };
          });

          setData({
            channelId: configData.channelId,
            channelName: configData.channelName,
            videos,
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

  if (!data?.videos || data.videos.length === 0) return null;

  const mainVideo = data.videos[0];
  const otherVideos = data.videos.slice(1);

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
            Our Latest Videos
          </h2>
          {data.channelName && (
            <p className="text-muted-foreground mt-2">
              From the channel of {data.channelName}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {/* Main Large Video */}
          <div className="flex flex-col gap-3">
            <div className="px-2 text-center">
              <h3 className="text-2xl font-bold theme-text-primary">{mainVideo.title}</h3>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black w-full">
              {playingVideo === mainVideo.id ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=1`}
                  title={mainVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setPlayingVideo(mainVideo.id)}
                  className="group block w-full h-full relative"
                  aria-label={`Play ${mainVideo.title}`}
                >
                  <img
                    src={mainVideo.thumbnail}
                    alt={mainVideo.title}
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

          {/* Grid of Other Videos */}
          {otherVideos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherVideos.map((v) => (
                <div key={v.id} className="flex flex-col gap-3 group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-black w-full">
                    {playingVideo === v.id ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        onClick={() => setPlayingVideo(v.id)}
                        className="block w-full h-full relative"
                        aria-label={`Play ${v.title}`}
                      >
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <span className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="grid place-items-center w-12 h-12 rounded-full bg-white/95 text-black shadow-xl scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-1" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm line-clamp-2 theme-text-primary group-hover:text-[var(--accent-color)] transition-colors">
                    {v.title}
                  </h4>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href={"https://www.youtube.com/@medjourneywebsite"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: "rgb(var(--accent-color))" }}
            >
              <Play className="w-5 h-5 fill-current" />
              Visit Our Channel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YoutubeSection;
