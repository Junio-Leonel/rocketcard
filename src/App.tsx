import { useRef, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Download } from "lucide-react";

import logo from "./assets/logo.svg";
import { generateRandomColor } from "./utils/colors";
import { UserInformation } from "./components/UserInformation";

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
  const [currentColor, setCurrentColor] = useState(generateRandomColor());
  const pdfRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery<UserData>(
    "userData",
    async () => {
      const response = await axios.get(
        "https://api.github.com/users/vitorleonel"
      );

      return response.data;
    },
    {
      staleTime: 1000 * 60, // 1 minute
    }
  );

  function handleRandomColor() {
    setCurrentColor(generateRandomColor());
  }

  function handleDownloadPDF() {
    const input = pdfRef.current;

    if (!input) {
      window.alert("Não foi possivel baixar a imagem!");

      return;
    }

    html2canvas(input, { useCORS: true }).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");

      console.log(imageData);

      const pdf = new jsPDF({ orientation: "portrait", unit: "px" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
      const imageX = (pdfWidth - imageWidth * ratio) / 2;
      const imageY = 0;
      pdf.addImage(
        imageData,
        "PNG",
        imageX,
        imageY,
        imageWidth * ratio,
        imageHeight * ratio
      );
      pdf.save("card.pdf");
    });
  }

  return (
    <main className="px-2 w-screen h-screen max-w-4xl mx-auto flex items-center justify-between">
      <div
        ref={pdfRef}
        style={{ background: `${currentColor}` }}
        className="w-[438px] h-[693px] px-4 py-6 rounded-[50px]"
      >
        <div className="h-full bg-zinc-900 rounded-[50px] px-2 py-2 relative overflow-hidden">
          <header className="flex items-center justify-between px-6 pt-6 gap-5">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 border border-white rounded-full flex items-center justify-center gap-5">
                <img src={logo} alt="logo" className="w-6 md:w-[30px]" />
              </div>
              <h3 className="text-xl md:text-2xl">{data?.name}</h3>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="bg-zinc-700 hover:bg-zinc-800 rounded-full p-2 duration-300"
            >
              <Download size={20} color="white" />
            </button>
          </header>

          <img
            src={data?.avatar_url}
            alt="photo user"
            width={380}
            className="border-[10px] border-violet-500 rounded-full w-full mt-8 ml-14"
          />

          <div className="absolute ml-3 -mt-40 space-y-1 py-8 pl-5 w-48 h-48 rounded-[50px] bg-gradient-to-t from-zinc-800/70 via-zinc-600/40 to-zinc-900">
            <UserInformation
              icon="Users"
              text={`${data?.followers} Followers`}
            />

            <UserInformation
              icon="Users"
              text={`${data?.following} Following`}
            />
            <UserInformation
              icon="BookMarked"
              text={`${data?.public_repos} Repositories`}
            />
            <UserInformation
              icon="Building2"
              text={`${data?.company || "N/A"}`}
            />
            <UserInformation icon="MapPin" text={`${data?.location}`} />
          </div>

          <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
            <button
              onClick={handleRandomColor}
              className="md:hidden w-full mt-12 py-2 bg-zinc-700 hover:bg-zinc-800 duration-300 rounded-xl"
            >
              Generate background
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(currentColor)}
              className="md:hidden w-full py-2 bg-zinc-700 hover:bg-zinc-800 duration-300 rounded-xl"
            >
              Copy color
            </button>
          </div>

          <footer className="hidden md:flex items-center justify-end gap-3 md:mt-20 md:mr-6">
            <img src={logo} alt="logo" width={30} />
            <p>ROCKETCARD</p>
          </footer>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center gap-8">
        <p className="text-xl">Customize Rocketcard</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleRandomColor}
            className="bg-zinc-700 hover:bg-zinc-800 duration-300 py-2 px-6 rounded-xl"
          >
            Generate background
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(currentColor)}
            className="bg-zinc-700 hover:bg-zinc-800 duration-300 py-2 px-6 rounded-xl"
          >
            Copy color
          </button>
        </div>
      </div>
    </main>
  );
}
