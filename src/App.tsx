import { useQuery } from "react-query";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import logo from "./assets/logo.svg";
import { BookMarked, Building2, Download, MapPin, Users } from "lucide-react";
import { useRef, useState } from "react";

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
  const [changeColor, setChangeColor] = useState("#27272a");
  const pdfRef = useRef();

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

  function handleRandomColor() {
    const randomColor = "#" + Math.random().toString(16).slice(2, 8);

    setChangeColor(randomColor);
  }

  function handleDownloadPDF() {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
      const imageX = (pdfWidth - imageWidth * ratio) / 2;
      const imageY = 30;
      pdf.addImage(
        imageData,
        "PNG",
        imageX,
        imageY,
        imageWidth * ratio,
        imageHeight * ratio
      );
      pdf.save("invoice.pdf");
    });
  }

  return (
    <main className="px-2 w-screen h-screen max-w-4xl mx-auto flex items-center justify-between">
      <div
        ref={pdfRef}
        style={{ background: `${changeColor}` }}
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
              className="bg-zinc-800 rounded-full p-2"
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
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{`${data?.followers} Followers`}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{`${data?.following} Following`}</span>
            </div>

            <div className="flex items-center gap-2">
              <BookMarked size={20} />
              <span>{`${data?.public_repos} Repositories`}</span>
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

          <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
            <button
              onClick={handleRandomColor}
              className="md:hidden w-full mt-12 py-2 bg-zinc-700 hover:bg-zinc-800 transition-all rounded-xl"
            >
              Generate background
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(changeColor)}
              className="md:hidden w-full py-2 bg-zinc-700 hover:bg-zinc-800 transition-all rounded-xl"
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
            className="bg-zinc-700 hover:bg-zinc-800 transition-all py-2 px-6 rounded-xl"
          >
            Generate background
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(changeColor)}
            className="bg-zinc-700 hover:bg-zinc-800 transition-all py-2 px-6 rounded-xl"
          >
            Copy color
          </button>
        </div>
      </div>
    </main>
  );
}
