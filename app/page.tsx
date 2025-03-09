"use client";
import Link from "next/link";
import Navbar from "./components/Navbar";
import BudgetItem from "./components/BudgetItem";
import budgets from "./data";
export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center flex-col py-10 w-full">
        <div>
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Prenez le contrôle <br />
              de vos finances
            </h1>

            <p className="py-6 text-base-800 text-center">
              Suivez vos budgets et dépenses <br /> en toute simplicité avec
              notre application.
            </p>

            <div className="flex justify-center">
              <Link
                href={"/sign-in"}
                className="btn btn-sm md:btn-md btn-outline btn-accent rounded-full"
              >
                Se connecter
              </Link>
              <Link
                href={"/sign-up"}
                className="btn btn-sm md:btn-md ml-2 btn-accent rounded-full"
              >
                S&apos;inscrire
              </Link>
            </div>

            <ul className="grid md:grid-cols-3 gap-4 mt-10 min-w-[1300px]">
              {budgets.map((budget) => (
                <Link href={``} key={budget.id}>
                  <BudgetItem budget={budget} enableHover={1} />
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
