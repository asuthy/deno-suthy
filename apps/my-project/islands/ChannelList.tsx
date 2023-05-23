import { useEffect, useState } from "preact/hooks";
import { formatDistanceToNowStrict } from "https://unpkg.com/date-fns@2.29.3/esm//index.js";

interface Channel {
  "uuid": "string";
  "name": "string";
  "description": "string";
  "url": "string";
  "internal_url": "string";
  "content_key": "string";
  "api_key": "string";
  "staff_access_token": "string";
  "created_at": "string";
  "deploy_image": "string";
  "creation_progress": "number";
  "update_progress": "number";
  "custom_domain": "string";
}

const statuses = {
  offline: "text-gray-500 bg-gray-100/10",
  online: "text-green-400 bg-green-400/10",
  error: "text-rose-400 bg-rose-400/10",
};

export default function ChannelList() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch(
          `https://orchestrate.staging.copyfuse.site/v1/channels`,
          {
            headers: {
              "x-copyfuse-orchestrate-id": "i-am-copyfuse-orchestrate",
            },
          },
        );
        const remoteChannels = await response.json();
        setChannels(remoteChannels);
      } catch (error) {
        alert("Something went wrong!");
      }
    };
    fetchChannels();
  }, []);

  return (
    <div class="p-5">
      {channels.map((channel: Channel) => (
        <ChannelItem channel={channel} id={channel.uuid} />
      ))}
    </div>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function ChannelItem({ channel, id }: { channel: Channel; id: string }) {
  const channelStatus = channel.creation_progress === 100
    ? "online"
    : "offline";

  return (
    <div className="min-w-0 flex-auto">
      <div className="flex items-center gap-x-3">
        <div
          className={classNames(
            statuses[channelStatus],
            "flex-none rounded-full p-1",
          )}
        >
          <div className="h-2 w-2 rounded-full bg-current" />
        </div>
        <h2 className="min-w-0 text-sm font-semibold leading-6 ">
          <a
            href={channel.url as string}
            className="flex gap-x-2"
            target="ghost"
          >
            <span className="whitespace-nowrap">{channel.name}</span>
            <span className="text-gray-400">-</span>
            <span className="truncate">{channel.description}</span>
          </a>
        </h2>
      </div>
      <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
        <p className="whitespace-nowrap">{channel.deploy_image}</p>
        <svg
          viewBox="0 0 2 2"
          className="h-0.5 w-0.5 flex-none fill-gray-300"
        >
          <circle cx={1} cy={1} r={1} />
        </svg>
        <p className="truncate">
          <span className="flex-none text-xs text-gray-600">
            {formatDistanceToNowStrict(new Date(channel.created_at), {
              addSuffix: true,
            })}
          </span>
        </p>
      </div>
    </div>
  );
}
