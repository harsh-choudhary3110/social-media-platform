import { ConfirmModalType } from "@/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

const ConfirmModal = ({
  triggerComponent,
  description,
  onConfirm,
}: ConfirmModalType) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>{triggerComponent}</AlertDialogTrigger>
      <AlertDialogContent className="bg-dark-4 border border-light-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-light-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogTrigger asChild>
            <Button className="shad-button_dark">Cancel</Button>
          </AlertDialogTrigger>
          <AlertDialogTrigger asChild>
            <Button
              className="shad-button_primary whitespace-nowrap"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </AlertDialogTrigger>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
