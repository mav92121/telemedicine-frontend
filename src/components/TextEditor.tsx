import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor: React.FC = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const { id: documentId } = useParams();

  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);
    s.on("connect", () => {
      console.log("Connected to server");
    });
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta: any, oldDelta: any, source: string) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta: any) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);
    return () => {
      socket.off("text-change", handler);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!socket || !quill) return;
    const inverval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);
    return () => {
      clearInterval(inverval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;
    socket.once("load-document", (document: any) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [quill, socket, documentId]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.disable();
    q.setText("Loading...");
    setQuill(q);
    // return () => {
    //   wrapper.innerHTML = "";
    // };
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
