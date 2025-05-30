import { Icon } from "@rneui/themed";

export function FontAwesomeIcon(props: {
  name: string;
  color: string;
  className?: string;
}) {
  return (
    <Icon
      name={props.name}
      type="font-awesome-5"
      color={props.color}
      solid
      className={`${props.className}`}
    />
  );
}
