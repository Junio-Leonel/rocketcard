import { useQuery } from "react-query";
import axios from "axios";

import logo from "./assets/logo.svg";
import { BookMarked, Building2, MapPin, Users } from "lucide-react";
import { useState } from "react";

interface UserData {
  avatar_url: string;
  name: string;
  followers: number;
  following: number;
  public_repos: number;
  company: string;
  location: string;
}

export function App() {
  const [changeColor, setChangeColor] = useState();

  const { data } = useQuery<UserData>(
    "userData",
    async () => {
      const response = await axios.get(
        "https://api.github.com/users/Junio-Leonel"
      );

      return response.data;
    },
    {
      staleTime: 1000 * 60, // 1 minute
    }
  );

  function randomColor() {
    let R = Math.floor(Math.random() * 255);
    let G = Math.floor(Math.random() * 255);
    let B = Math.floor(Math.random() * 255);
  }

  return (
    <main className="w-screen h-screen max-w-4xl mx-auto flex items-center justify-between">
      <div className="w-[438px] h-[693px] px-4 py-6 rounded-[50px] bg-zinc-700">
        <div className="h-full bg-zinc-900 rounded-[50px] px-2 py-2 relative overflow-hidden">
          <header className="flex items-center pl-6 pt-6 gap-5">
            <div className="w-14 h-14 border border-white rounded-full flex items-center justify-center gap-5">
              <img src={logo} alt="logo" width={30} />
            </div>
            <h3 className="text-2xl">{data?.name}</h3>
          </header>

          <img
            src={data?.avatar_url}
            alt="photo user"
            width={380}
            className="border-[10px] border-violet-500 rounded-full w-full mt-8 ml-14"
          />

          <div className="absolute ml-3 -mt-40 space-y-1 py-8 pl-5 w-48 h-48 rounded-[50px] bg-gradient-to-t from-zinc-800/70 via-zinc-600/40 to-zinc-900">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{`${data?.followers} Seguidores`}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{`${data?.following} Seguindo`}</span>
            </div>

            <div className="flex items-center gap-2">
              <BookMarked size={20} />
              <span>{`${data?.public_repos} Repositórios`}</span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 size={20} />
              <span>{data?.company}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{data?.location}</span>
            </div>
          </div>

          <div className="max-w-[250px] mx-auto">
            <button
              onClick={randomColor}
              className="md:hidden w-full mt-14 px-8 py-4 bg-zinc-700 hover:bg-zinc-800 transition-all rounded-2xl"
            >
              Gerar background
            </button>
          </div>

          <footer className="hidden md:flex items-center justify-end gap-3 md:mt-20 md:mr-6">
            <img src={logo} alt="logo" width={30} />
            <p>ROCKETCARD</p>
          </footer>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center gap-8">
        <p className="text-xl">Customizar Rocketcard</p>
        <button
          onClick={randomColor}
          className="bg-zinc-700 hover:bg-zinc-800 transition-all py-4 px-12 rounded-2xl"
        >
          Gerar background
        </button>
      </div>
    </main>
  );
}
