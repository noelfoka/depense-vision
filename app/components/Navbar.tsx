"use client";
import React, { useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { checkAndAddUser } from "../actions";
const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if(user?.primaryEmailAddress?.emailAddress) {
      checkAndAddUser(user?.primaryEmailAddress?.emailAddress)
    }
  }, [user])

  return (
    <div className="bg-base-200/30 px-5 md:px-[10%] py-4">
      {/* Vérifier si on a un loading */}
      {isLoaded &&
        // Si l'utilisateur est connecté
        (isSignedIn ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-2xl font-bold">
                dep <span className="text-accent">.Vision</span>
              </div>

              <div className="md:flex hidden">
                <Link href={"/budgets"} className="btn">
                  Mes budgets
                </Link>
                <Link href={"/dashboard"} className="btn mx-4">
                  Tableau de bord
                </Link>
                <Link href={"/transactions"} className="btn">
                  Mes transactions
                </Link>
              </div>

              <UserButton />
            </div>

            {/* pour les petits écrans */}
            <div className="flex md:hidden mt-2 justify-center">
              <Link href={"/budgets"} className="btn btn-sm">
                Mes budgets
              </Link>
              <Link href={"/dashboard"} className="btn btn-sm mx-4">
                Tableau de bord
              </Link>
              <Link href={"/transactions"} className="btn btn-sm">
                Mes transactions
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-2xl font-bold">
              dep <span className="text-accent">.Vision</span>
            </div>

            <div className="flex mt-2 justify-center">
              <Link href={"/sign-in"} className="btn btn-sm">
                Se connecter
              </Link>
              <Link href={"/sign-up"} className="btn btn-sm mx-4 btn-accent">
                S&apos;inscrire
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
