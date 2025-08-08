"use client";
import CustomInput from "@/components/custom-input/custom-input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { CircleX, Eclipse, Filter, Search, X } from "lucide-react";
import React, { FormEvent, useCallback, useRef, useState } from "react";

export default function RoleFilter() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const handleFiltering = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("role"));
    console.log(formData.get("permission"));
    console.log(formData.get("date"));
  }, []);
  const handleSearching = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.currentTarget);
    console.log(formData);
  }, []);
  return (
    <>
      <div className="flex items-center gap-2 justify-between w-full p-0">
        <div className="flex w-full gap-2">
          <form className="relative w-1/2" onSubmit={handleSearching} id="role-search">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input type="search" placeholder="Tapez pour rechercher" className="pl-10 pr-4 w-full" />
          </form>
          <Button
            className="flex gap-2 p-2 bg-transparent"
            variant="outline"
            type="submit"
            form="role-search"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <span>Recherche</span>
            <Search />
          </Button>
          <Button
            className="flex gap-2 p-2 bg-transparent"
            variant="outline"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <span>Filter</span>
            <Filter />
          </Button>
        </div>
      </div>

      <Drawer open={isFilterModalOpen} direction="right">
        <DrawerContent className="p-5">
          <DrawerHeader className="flex flex-row justify-between">
            <div>
              <DrawerTitle>Filtres</DrawerTitle>
            </div>
            <DrawerClose>
              <Button onClick={() => setIsFilterModalOpen(false)} className="rounded-full">
                <X />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <form onSubmit={handleFiltering} id="role-filter" className="flex flex-col gap-2">
            <CustomInput id="role" name="role" placeholder="Nom de rôle" label="Rôle" />
            <CustomInput id="code" name="code" placeholder="Code de rôle" label="Code" />
            <CustomInput id="Statue" name="Statue" placeholder="Statue de rôle" label="Statue" />
          </form>
          <DrawerFooter>
            <Button form="role-filter" type="submit">
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
