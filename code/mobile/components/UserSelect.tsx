import {
  POSSIBLE_USERS,
  PossibleUserId,
  useUserStore,
} from "@/lib/stores/user-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

export function UserSelect() {
  const userStore = useUserStore();

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
