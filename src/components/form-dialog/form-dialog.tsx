import { ReactNode } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReusableFormDialogProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  submitButtonText: string;
  isPending?: boolean;
  preventOutsideClick?: boolean;
  maxWidth?: number;
}

export default function FormDialog({
  trigger,
  title,
  children,
  isOpen,
  onOpenChange,
  formId,
  submitButtonText,
  isPending = false,
  preventOutsideClick = true,
  maxWidth = 768,
}: ReusableFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={`max-w-[${maxWidth}px]`}
        onInteractOutside={(event) => preventOutsideClick && event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {isOpen && children}
        <DialogFooter>
          <Button className="border-1 cursor-pointer w-36 p-5 ml-auto" type="submit" form={formId} disabled={isPending}>
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
