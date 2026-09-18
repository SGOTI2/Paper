import { useContext, useEffect, type ReactNode } from "react";
import { type Task } from "../lib/Task";
import Cell from "./Cell";
import { FeedManager } from "../lib/feedManager";
import { MdWarning } from "react-icons/md";
import { UnifiedStaticData } from "../lib/unifiedStaticData";

function LivePanelError({ children }: { children: ReactNode }) {
  return (
    <h6 className="h-full flex items-center justify-center text-red-500">
      <MdWarning className="size-12 me-2"/>
      {children}
    </h6>
  )
}

export default function LivePanel({ fscn }: { fscn: string }) {
  const unifiedStaticState = useContext(UnifiedStaticData);
  const feedManager = useContext(FeedManager)

  useEffect(() => {
    (async () => {
      await feedManager.acquireFeed(fscn)
    })();
  }, [feedManager, fscn])

  return (
    <div
      className="rounded border border-gray-700 bg-gray-800 py-5 px-4 lg:min-w-xl w-full min-h-64 shadow-[8px_8px_0px] shadow-gray-950/40 inline-flex flex-col overflow-hidden"
      style={{ fontFamily: "JetBrains Mono" }}
    >
      <h4 className="text-lg lg:text-3xl font-bold">{unifiedStaticState.fscnMapping[fscn]}</h4>
      <div className="flex-1 relative overflow-hidden mt-3">
        {(!feedManager.feeds[fscn]           && (<LivePanelError>FSCN "{fscn}" does not have a feed in feedManager</LivePanelError>)) ||
        (feedManager.feeds[fscn].isAcquiring && (<LivePanelError>Acquiring Live Feed</LivePanelError>)) ||
        (!feedManager.feeds[fscn].available  && (<LivePanelError>Feed Unavilable - Not attempting to connect</LivePanelError>)) ||
        (feedManager.feeds[fscn].data.length == 0 && (<h6 className="h-full flex items-center justify-center text-gray-500">No Parts</h6>)) ||
          <div className="border border-gray-700 overflow-y-scroll h-full">
            <table className="w-full text-left table-fixed border-separate border-spacing-0">
              <thead className="table-header-group h-8 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-700 bg-gray-800 py-1 ps-2 w-32">Status</th>
                  <th className="border border-gray-700 bg-gray-800 py-1 ps-2 w-32 lg:w-auto">Name</th>
                  <th className="border border-gray-700 bg-gray-800 py-1 ps-2 w-32 lg:w-auto">Subteam</th>
                  <th className="border border-gray-700 bg-gray-800 py-1 ps-2 w-24">Priority</th>
                  <th className="border border-gray-700 bg-gray-800 py-1 ps-2 w-14">Part</th>
                  <th className="border border-gray-700 bg-gray-800 py-1 ps-2 w-12">QTY</th>
                  <th className="border border-gray-700 bg-gray-800 py-1 ps-2 w-32 lg:w-auto">Due</th>
                </tr>
              </thead>
              <tbody>
                {((feedManager.feeds[fscn]?.data ?? []) as Task[]).map((task, taskIndex) => (
                  <tr className="leading-none overflow-hidden h-4" key={taskIndex}>
                    {(Object.keys(task) as Array<keyof Task>).filter((k) => k != "id").map((dataKey) => 
                      <Cell task={task} dataKey={dataKey} key={taskIndex+dataKey} />
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
      <div/>
    </div>
  )
}