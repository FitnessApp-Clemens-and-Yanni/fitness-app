import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/Alert-dialog";
import { ReactNode } from "react";
import { Text } from "react-native";

export function Alert(props: {
  isOpen: boolean;
  title: string;
  message: string;
  trigger: ReactNode;
  onOpenChange: (open: boolean) => void;
}) {
  const handleClose = () => {
    props.onOpenChange(false);
  };

  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      {props.trigger && (
        <AlertDialogTrigger asChild>{props.trigger}</AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onPress={handleClose}>
            <Text>Ok</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
