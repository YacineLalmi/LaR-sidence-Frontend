"use client";
import React, { PropsWithChildren, use, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Filter, X } from "lucide-react";
import { Button } from "./button";
import { is } from "zod/v4/locales";

interface Props {
  buttonText: string;
  title: string;
  description?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}
export default function FilterDrawer({
  buttonText,
  title,
  description,
  children,
  isOpen,
  setIsOpen,
}: PropsWithChildren<Props>) {
  useEffect(() => {
    return () => {
      console.log("closing drawer...");
    };
  }, []);
  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="flex gap-2 p-6 rounded-4xl bg-transparent border-gray-600 border-1 cursor-pointer text-black hover:bg-amber-200">
          {buttonText}
          <Filter />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row justify-between">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerClose className="rounded-full bg-black p-1">
            <X color="white" size={15} />
          </DrawerClose>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
