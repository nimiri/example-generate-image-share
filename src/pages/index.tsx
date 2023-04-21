import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import { url } from "@/utils/config";
import * as htmlToImage from "html-to-image";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>("ぽえぽえ〜");
  const [isShareable, setIsShareable] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    setIsShareable(navigator && !!navigator.share);
  }, []);

  const onGenerateButtonClick = useCallback(async () => {
    const targetArea = document.getElementById("targetArea");
    const imageArea = document.getElementById("imageArea");

    if (!targetArea || !imageArea) {
      return;
    }

    // 二度目以降のために、初期化
    imageArea.innerHTML = "";

    htmlToImage
      .toPng(targetArea, {
        skipFonts: true,
        cacheBust: true,
        // backgroundColor: "#ffd900",
        // style: { transform: "scale(90%)" },
      })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;

        const pngFile = dataURLToPngFile(dataUrl, `${inputValue}.png`);
        if (pngFile) {
          setFile(pngFile);
        }

        console.log(img);

        const imgNode = document.getElementById("imageArea")?.appendChild(img);
        if (imgNode) {
          imgNode.style.width = "100%";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [inputValue]);

  const onShareButtonClick = useCallback(async () => {
    if (!file) {
      return;
    }

    const shareData = {
      files: [file],
      title: inputValue,
      type: "image/*",
    };

    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData).catch((error) => {
        console.log(error);
      });
    } else {
      // do something else like copying the data to the clipboard
    }
  }, [file, inputValue]);

  const dataURLToPngFile = (dataURL: string, name: string) => {
    const type = "image/png";
    const decodedData = window.atob(dataURL.replace(/^.*,/, ""));
    const buffers = new Uint8Array(decodedData.length);

    for (let i = 0; i < decodedData.length; ++i) {
      buffers[i] = decodedData.charCodeAt(i);
    }

    try {
      const blob = new Blob([buffers.buffer], {
        type,
      });

      return new File([blob], `${name}.png`, { type });
    } catch {
      return null;
    }
  };

  return (
    <>
      <Head>
        <title>画像作成テスト</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "6rem",
          minHeight: "100vh",
          gap: "16px",
        }}
      >
        <div
          ref={ref}
          id="targetArea"
          style={{
            border: "solid 1px #fff",
            width: "200px",
            height: "200px",
            position: "relative",
          }}
        >
          <img src={url("/inu.png")} alt="" style={{ width: "100%" }} />
          <p
            style={{
              position: "absolute",
              margin: "auto",
              bottom: "12px",
              left: 0,
              right: 0,
              textAlign: "center",
              color: "#000",
            }}
          >
            {inputValue}
          </p>
        </div>

        <input
          type="text"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          value={inputValue}
        />
        <button onClick={onGenerateButtonClick}>↓ Generate! ↓</button>

        <div
          style={{
            border: "solid 1px #fff",
            width: "200px",
            height: "200px",
            position: "relative",
          }}
        >
          <div id="imageArea" style={{ width: "100%" }} />
        </div>

        {isShareable ? (
          <button onClick={onShareButtonClick}>Share!</button>
        ) : (
          <p>この環境では navigator.share はできません！</p>
        )}
      </main>
    </>
  );
}
