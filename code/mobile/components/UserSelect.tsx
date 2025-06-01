import {
  POSSIBLE_USERS,
  PossibleUserId,
  useUserStore,
} from "@/lib/stores/user-store";
import { api } from "@/utils/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useEffect } from "react";

export function UserSelect() {
  // TODO: Fix bug where the state isn't percistent on navigation
  const userStore = useUserStore();
  const apiUtils = api.useUtils();

  useEffect(() => {
    apiUtils.invalidate();
  }, [userStore.currentUser]);

  return (
    <Select
      defaultValue={{
        value: userStore.currentUser,
        label: userStore.currentUser,
      }}
      onValueChange={(option) => {
        const value = option!.value as PossibleUserId;
        userStore.setCurrentUser(value);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select user" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Users</SelectLabel>
          {POSSIBLE_USERS.map((user) => (
            <SelectItem label={user} value={user} key={user}>
              {user}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
