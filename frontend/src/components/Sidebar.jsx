import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length-1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "data:image/png;base64,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"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;