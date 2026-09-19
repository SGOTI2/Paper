import { createContext, useState, type ReactNode } from "react";
import type { Feed } from "./networking/types";
import { produce } from "immer";
import GetFullFeed from "./networking/getFullFeed";
import subscribe from "./networking/subscribe";
import type { Task } from "./Task";

type ContextType = {
  feeds: {
    [fscn: string]: Feed
  },
  setFeed: (fscn: string, feed: Feed) => void,
  acquireFeed: (fscn: string) => Promise<void>
}

const providerlessContext: ContextType = {feeds: {}, setFeed: () => {}, acquireFeed: async () => {}};

export const FeedManager = createContext(providerlessContext);

export function FeedManagerProvider({ children }: { children: ReactNode }) {
  const [feeds_, setFeeds_] = useState<typeof providerlessContext.feeds>({})

  function setFeed(fscn: string, feed: Partial<Feed>) {
    setFeeds_((draft) => {
      draft[fscn] = {
        ...draft[fscn] ?? {},
        ...feed
      };
      return draft;
    })
  }

  async function acquireFeed(fscn: string) {
    if (!fscn) return;
    if (Object.keys(feeds_).includes(fscn)) {
      if (feeds_[fscn].isAcquiring || feeds_[fscn].available) return;
      setFeed(fscn, {isAcquiring: true});
    } else {
      setFeed(fscn, {
        data: [],
        name: fscn,
        latestUpdate: new Date(),
        available: false,
        isAcquiring: true
      } as Feed);
    }
    
    const data = await GetFullFeed(fscn);

    setFeeds_(produce((draft) => {
      draft[fscn].data = data;
      draft[fscn].available = true;
      draft[fscn].isAcquiring = false;
      draft[fscn].unsubscribe = subscribe(fscn, (newTask, del) => {
        setFeeds_(produce((draft) => {
          const index = draft[fscn].data.findIndex((task: Task) => task.id == newTask.id);
          if (del) {
            draft[fscn].data.splice(index, 1)
            return;
          }
          if (index == -1) {
            draft[fscn].data.push(newTask)
          } else { // Aksually this is a update not a new task
            draft[fscn].data[index] = newTask
          }
        }))
      })
    }));
  }

  return (
    <FeedManager value={{
      feeds: feeds_, 
      setFeed: setFeed,
      acquireFeed: acquireFeed
    }}>
      {children}
    </FeedManager>
  )
}