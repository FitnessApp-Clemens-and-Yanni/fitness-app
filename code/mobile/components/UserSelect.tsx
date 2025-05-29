import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

export const POSSIBLE_USERS = ["yanni", "gugi"] as const;

export function UserSelect() {
  return (
    <Select
      defaultValue={{ value: POSSIBLE_USERS[0], label: POSSIBLE_USERS[0] }}
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
