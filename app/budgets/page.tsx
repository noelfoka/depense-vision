"use client";

import { useUser } from "@clerk/nextjs";
import Wrapper from "../components/Wrapper";
import { useState } from "react";

const Page = () => {
  const { user } = useUser();
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

  return (
    <Wrapper>
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        Nouveau budget
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Ceation d&apos;un budget</h3>
          <p className="py-4">
            Permet de controler vos depenses et vos revenus facilement.
          </p>

          <div className="w-full flex flex-col">
            <input
              type="text"
              value={budgetName}
              placeholder="Nom du budget"
              onChange={(e) => setBudgetName(e.target.value)}
              className="input input-bordered mb-3"
              required
            />

            <input
              type="number"
              value={budgetAmount}
              placeholder="Montant du budget"
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="input input-bordered mb-3"
            />

            <button className="btn">Ajouter Budget</button>
          </div>
        </div>
      </dialog>
    </Wrapper>
  );
};

export default Page;
