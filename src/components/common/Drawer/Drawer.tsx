import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import CircleIcon from "@mui/icons-material/Circle";
import { BellIcon } from "@heroicons/react/24/outline";
import {useMarkNotificationAsRead} from "../../../api/hooks/notifications/useMarkNotificationAsRead";
interface RightDrawerProps {
  unreadCount: number;
  notifications: { id: number; message: string; is_read: boolean }[];
}

export default function RightDrawer({
  unreadCount,
  notifications,
}: RightDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const { mutate } = useMarkNotificationAsRead();
  const [readStatus, setReadStatus] = React.useState(
    notifications.map(() => false)
  );

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(open);
    };

  const markAsRead = (id: number) => () => {
    mutate(id);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {notifications.filter((notification) => !notification.is_read).length === 0 ? (
          <ListItem>
            <ListItemText primary="No unread notifications" />
          </ListItem>
        ) : (
          notifications.map((notification) => (
            <ListItem key={notification.id} disablePadding>
              <ListItemButton sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>
                <ListItemIcon>
                  <CircleIcon />
                </ListItemIcon>
                <ListItemText primary={notification.message} sx={{ marginBottom: '8px' }} />
                {!notification.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id)();
                    }}
                    className="text-blue-500 hover:underline px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200"
                    style={{ cursor: 'pointer' }}
                  >
                    Mark as Read
                  </button>
                )}
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div className="relative">
      <button
        className="p-2 rounded-md text-white hover:bg-primary-dark dark:text-gray-400 dark:hover:bg-gray-700"
        onClick={toggleDrawer(true)}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 text-xs font-medium flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}
// Usage example
// <RightDrawer unreadCount={3} notifications={[{ id: 1, message: "Notification 1", is_read: false }, { id: 2, message: "Notification 2", is_read: true }]} />
// Note: You can replace the dummy notifications with actual data from your state or props.
