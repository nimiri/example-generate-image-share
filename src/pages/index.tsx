import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import { url } from "@/utils/config";
import * as htmlToImage from "html-to-image";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>("ぽえぽえ〜");
  const [isShareable, setIsShareable] = useState<boolean>(false);

  useEffect(() => {
    setIsShareable(navigator && !!navigator.share);
  }, []);

  const onGenerateButtonClick = useCallback(async () => {
    const imageArea = document.getElementById("imageArea");

    if (ref.current === null || !imageArea) {
      return;
    }

    // 二度目以降のために、初期化
    imageArea.innerHTML = "";

    htmlToImage
      .toPng(ref.current, {
        skipFonts: true,
        cacheBust: true,
        backgroundColor: "#ffd900",
        style: { transform: "scale(90%)" },
      })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;

        console.log(img);

        const imgNode = document.getElementById("imageArea")?.appendChild(img);
        if (imgNode) {
          imgNode.style.width = "100%";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const onShareButtonClick = useCallback(async () => {
    const img = document.getElementById("imageArea");

    if (img === null) {
      return;
    }
    htmlToImage.toBlob(img).then(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "generated-image.png");
      const shareData = {
        files: [file],
        title: inputValue,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share({
          files: [file],
          title: inputValue,
        });
      } else {
        // do something else like copying the data to the clipboard
      }
    });
  }, [inputValue]);

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
          id="imageTarget"
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
