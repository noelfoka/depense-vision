"use client";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();

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
                <Link href={""} className="btn">
                  Mes budgets
                </Link>
                <Link href={""} className="btn mx-4">
                  Tableau de bord
                </Link>
                <Link href={""} className="btn">
                  Mes transactions
                </Link>
              </div>

              <UserButton />
            </div>

            {/* pour les petits écrans */}
            <div className="flex md:hidden mt-2 justify-center">
              <Link href={""} className="btn btn-sm">
                Mes budgets
              </Link>
              <Link href={""} className="btn btn-sm mx-4">
                Tableau de bord
              </Link>
              <Link href={""} className="btn btn-sm">
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
