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

interface RightDrawerProps {
  unreadCount: number;
  notifications: string[];
}

export default function RightDrawer({
  unreadCount,
  notifications,
}: RightDrawerProps) {
  const [open, setOpen] = React.useState(false);

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

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText primary="No notifications" />
          </ListItem>
        ) : (
          notifications.map((text, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CircleIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
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
// <RightDrawer unreadCount={3} notifications={["Notification 1", "Notification 2"]} />
// Note: You can replace the dummy notifications with actual data from your state or props.
